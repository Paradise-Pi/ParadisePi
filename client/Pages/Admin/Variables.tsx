import {
	ActionIcon,
	Box,
	Button,
	Center,
	CopyButton,
	Group,
	LoadingOverlay,
	Modal,
	Table,
	Text,
	Textarea,
	TextInput,
	Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { FaCheck } from '@react-icons/all-files/fa/FaCheck'
import { FaCopy } from '@react-icons/all-files/fa/FaCopy'
import { FaGripVertical } from '@react-icons/all-files/fa/FaGripVertical'
import { FaPencilAlt } from '@react-icons/all-files/fa/FaPencilAlt'
import { FaPlus } from '@react-icons/all-files/fa/FaPlus'
import { FaSave } from '@react-icons/all-files/fa/FaSave'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { DatabaseVariable } from '../../../shared/sharedTypes'
import { useAppSelector } from '../../apis/redux/mainStore'
import { usePrompt } from '../../apis/utilities/usePrompt'
import { ApiCall } from '../../apis/wrapper'
interface FormValues {
	variables: Array<DatabaseVariable>
}
export const VariablesConfigurationPage = () => {
	const [modalVisible, setModalVisible] = useState<number | false>(false)
	const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
	const ipAddress = useAppSelector(state => (state.database ? state.database.about.ipAddress : null))
	const port = useAppSelector(state => (state.database ? state.database.about.port : false))
	const [formOriginalValues, setFormOriginalValues] = useState<string>('') // Values used to detect unsaved changes
	const variables = useAppSelector(state => (state.database ? state.database.variables : false))
	// Setup the form
	const form = useForm<FormValues>({
		initialValues: {
			variables: [],
		},
		clearInputErrorOnChange: true,
		validateInputOnBlur: true,
		validate: {
			variables: {
				name(value, values, path) {
					if (value === '') return 'Name is required'
					// Check for duplicate names, must be unique
					const names = values.variables.map(item => item.name)
					if (names.filter(name => name === value).length > 1) return 'Name must be unique'

					if (value.length < 2) return 'Name is too short'
					value = value.replace(/ /g, '_') // Remove spaces
					value = value.toUpperCase() // Convert to uppercase
					if (!/^[A-Z0-9_]*$/.test(value))
						return 'Name can only contain uppercase letters, numbers and underscores'
					if (value.length > 100) 'Name is too long'
					values.variables[path.split('.')[1]].name = value
					return null
				},
			},
		},
	})
	useEffect(() => {
		// Normally called when the database is populated and ready, so we can populate the form
		if (variables !== false) {
			const formValues = { variables: variables.map(item => ({ ...item })) } // Make a copy of the object using map because the object is not extensible
			form.setValues(formValues)
			setFormOriginalValues(JSON.stringify(formValues))
			setLoadingOverlayVisible(false)
		} else if (!loadingOverlayVisible) setLoadingOverlayVisible(true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [variables])
	const saveByUserNeeded = formOriginalValues !== JSON.stringify(form.values) // Does the user have unsaved changes
	usePrompt(saveByUserNeeded ? 'You have unsaved changes, are you sure you want to leave this page?' : false)

	// Handle the submit button
	const handleSubmit = (values: FormValues) => {
		setLoadingOverlayVisible(true)
		ApiCall.put('/variables', values.variables).then(() => {
			showNotification({
				message: 'Your changes have been saved',
				autoClose: 2000,
				disallowClose: true,
				color: 'green',
				icon: <FaCheck />,
			})
		})
	}
	const fields = form.values.variables.map((_, index) => (
		<Draggable key={index} index={index} draggableId={index.toString()}>
			{provided => (
				<tr ref={provided.innerRef} {...provided.draggableProps}>
					<td>
						<Center {...provided.dragHandleProps}>
							<FaGripVertical />
						</Center>
					</td>
					<td>
						{form.values.variables[index].id ? (
							<>
								<Text span c="dimmed">
									{'{{ VARIABLES.'}
								</Text>
								<Text span>{form.values.variables[index].name}</Text>
								<Text span c="dimmed">
									{' }}'}
								</Text>
								<CopyButton value={`{{ VARIABLES.${form.values.variables[index].name} }}`}>
									{({ copied, copy }) => (
										<ActionIcon
											variant="transparent"
											onClick={copy}
											ml={'sm'}
											style={{ display: 'inline-block' }}
										>
											{copied ? <FaCheck /> : <FaCopy />}
										</ActionIcon>
									)}
								</CopyButton>
								<input type="hidden" {...form.getInputProps(`variables.${index}.name`)} />
							</>
						) : (
							<TextInput placeholder="Name" {...form.getInputProps(`variables.${index}.name`)} />
						)}
					</td>
					<td>
						<TextInput placeholder="Value" {...form.getInputProps(`variables.${index}.value`)} />
					</td>
					<td>
						<Modal
							opened={modalVisible === index}
							onClose={() => {
								setModalVisible(false)
							}}
							size="xl"
							title={`Edit Variable ${form.values.variables[index].name}`}
							overflow="inside"
						>
							<Textarea label="Variable Notes" {...form.getInputProps(`variables.${index}.notes`)} />
							{form.values.variables[index].id ? (
								<>
									<Text my={'md'} fz="lg">
										Status Check API URL - returns value of the variable
									</Text>
									<Text span c="dimmed">
										{'http://' + ipAddress + ':' + port + '/monitoring/variable/'}
									</Text>
									<Text span>{form.values.variables[index].name}</Text>
									<CopyButton
										value={
											'http://' +
											ipAddress +
											':' +
											port +
											'/monitoring/variable/' +
											form.values.variables[index].name
										}
									>
										{({ copied, copy }) => (
											<ActionIcon
												variant="transparent"
												onClick={copy}
												ml={'sm'}
												style={{ display: 'inline-block' }}
											>
												{copied ? <FaCheck /> : <FaCopy />}
											</ActionIcon>
										)}
									</CopyButton>
								</>
							) : null}
						</Modal>
						<ActionIcon variant="transparent" onClick={() => setModalVisible(index)}>
							<FaPencilAlt />
						</ActionIcon>
					</td>
					<td>
						<ActionIcon
							color="red"
							variant="transparent"
							onClick={() => form.removeListItem('variables', index)}
						>
							<FaTrash />
						</ActionIcon>
					</td>
				</tr>
			)}
		</Draggable>
	))

	return (
		<Box mx="lg">
			<div style={{ position: 'relative' }}>
				<LoadingOverlay visible={loadingOverlayVisible} transitionDuration={0} />
				{variables !== false ? (
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<Group position="left" mt="md">
							<Title>Variables</Title>
							{saveByUserNeeded ? (
								<Button variant="outline" type="submit" leftIcon={<FaSave />}>
									Save
								</Button>
							) : null}
						</Group>
						<Text>Variables are used to store values that can be used in various places in Paradise</Text>
						<Table verticalSpacing="sm" fontSize="md">
							<thead>
								<tr>
									<th>
										<Button
											compact
											variant="default"
											onClick={() => {
												form.insertListItem('variables', {
													id: null,
													name: 'New variable',
													value: '',
													notes: '',
												})
											}}
										>
											<FaPlus />
										</Button>
									</th>
									<th>Name</th>
									<th>Value</th>
									<th></th>
									<th></th>
								</tr>
							</thead>
							<DragDropContext
								onDragEnd={({ destination, source }) =>
									form.reorderListItem('variables', {
										from: source.index,
										to: destination.index,
									})
								}
							>
								<Droppable droppableId="dnd-list" direction="vertical">
									{provided => (
										<tbody {...provided.droppableProps} ref={provided.innerRef}>
											{fields}
											{provided.placeholder}
										</tbody>
									)}
								</Droppable>
							</DragDropContext>
						</Table>
					</form>
				) : (
					'Loading'
				)}
			</div>
		</Box>
	)
}
