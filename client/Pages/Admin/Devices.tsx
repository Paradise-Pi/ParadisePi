import { ActionIcon, Box, Button, Center, Group, LoadingOverlay, Table, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { FaCheck } from '@react-icons/all-files/fa/FaCheck'
import { FaGripVertical } from '@react-icons/all-files/fa/FaGripVertical'
import { FaPlus } from '@react-icons/all-files/fa/FaPlus'
import { FaSave } from '@react-icons/all-files/fa/FaSave'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { DatabaseDevice } from '../../../shared/sharedTypes'
import { useAppSelector } from '../../apis/redux/mainStore'
import { usePrompt } from '../../apis/utilities/usePrompt'
import { ApiCall } from '../../apis/wrapper'

interface FormValues {
	devices: Array<DatabaseDevice>
}
export const DevicesConfigurationPage = () => {
	const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
	const [formOriginalValues, setFormOriginalValues] = useState<string>('') // Values used to detect unsaved changes
	const devices = useAppSelector(state => (state.database ? state.database.devices : false))
	// Setup the form
	const form = useForm<FormValues>({
		initialValues: {
			devices: [],
		},
		clearInputErrorOnChange: true,
		validateInputOnBlur: true,
		validate: {
			devices: {
				name: value => (value.length < 2 ? 'Name should have at least 2 letters' : null),
				ip: (value, values, path) => {
					if (value == null || value.length < 1) return null

					// Check for duplicates
					const duplicate = values.devices.findIndex(
						(item, index) => item.ip === value && index !== parseInt(path.split('.')[1])
					)
					if (duplicate !== -1) return 'IP address used by another device'

					if (
						/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
							value
						)
					)
						return null
					else return 'IPv4 address not valid'
				},
				endpoint: value =>
					value == null || value.length < 1 || value.startsWith('https://') || value.startsWith('http://')
						? null
						: 'Endpoint not valid',
			},
		},
	})
	useEffect(() => {
		// Normally called when the database is populated and ready, so we can populate the form
		if (devices !== false) {
			const formValues = { devices: devices.map(item => ({ ...item })) } // Make a copy of the object using map because the object is not extensible
			form.setValues(formValues)
			setFormOriginalValues(JSON.stringify(formValues))
			setLoadingOverlayVisible(false)
		} else if (!loadingOverlayVisible) setLoadingOverlayVisible(true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [devices])
	const saveByUserNeeded = formOriginalValues !== JSON.stringify(form.values) // Does the user have unsaved changes
	usePrompt(saveByUserNeeded ? 'You have unsaved changes, are you sure you want to leave this page?' : false)

	// Handle the submit button
	const handleSubmit = (values: FormValues) => {
		setLoadingOverlayVisible(true)
		ApiCall.put('/devices', values.devices).then(() => {
			showNotification({
				message: 'Your changes have been saved',
				autoClose: 2000,
				disallowClose: true,
				color: 'green',
				icon: <FaCheck />,
			})
		})
	}

	const fields = form.values.devices.map((_, index) => (
		<Draggable key={index} index={index} draggableId={index.toString()}>
			{provided => (
				<tr ref={provided.innerRef} {...provided.draggableProps}>
					<td>
						<Center {...provided.dragHandleProps}>
							<FaGripVertical />
						</Center>
					</td>
					<td>
						<TextInput placeholder="Name" {...form.getInputProps(`devices.${index}.name`)} />
					</td>
					<td>
						<TextInput placeholder="IP" {...form.getInputProps(`devices.${index}.ip`)} />
					</td>
					<td>
						<TextInput placeholder="endpoint" {...form.getInputProps(`devices.${index}.endpoint`)} />
					</td>
					<td>
						<TextInput
							placeholder="statusCheckPath"
							{...form.getInputProps(`devices.${index}.statusCheckPath`)}
						/>
					</td>
					<td>
						<TextInput
							placeholder="statusCheckString"
							{...form.getInputProps(`devices.${index}.statusCheckString`)}
						/>
					</td>
					<td>
						<TextInput placeholder="notes" {...form.getInputProps(`devices.${index}.notes`)} />
					</td>
					<td>
						<ActionIcon
							color="red"
							variant="transparent"
							onClick={() => form.removeListItem('devices', index)}
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
				{devices !== false ? (
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<Group position="left" mt="md">
							<Title>Devices</Title>
							{saveByUserNeeded ? (
								<Button variant="outline" type="submit" leftIcon={<FaSave />}>
									Save
								</Button>
							) : null}
						</Group>
						<Table verticalSpacing="sm" fontSize="md">
							<thead>
								<tr>
									<th>
										<Button
											compact
											variant="default"
											onClick={() => {
												form.insertListItem('devices', {
													id: null,
													name: 'New device',
												})
											}}
										>
											<FaPlus />
										</Button>
									</th>
									<th>Name</th>
									<th>IP</th>
									<th></th>
								</tr>
							</thead>
							<DragDropContext
								onDragEnd={({ destination, source }) =>
									form.reorderListItem('devices', {
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
