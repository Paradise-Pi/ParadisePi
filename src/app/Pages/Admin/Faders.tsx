import React, { useEffect, useState } from 'react'
import {
	Group,
	TextInput,
	Box,
	Button,
	Center,
	ActionIcon,
	Select,
	LoadingOverlay,
	Checkbox,
	SelectItem,
	NumberInput,
	Table,
	Title,
} from '@mantine/core'
import { useForm, formList } from '@mantine/form'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { FaFolder } from '@react-icons/all-files/fa/FaFolder'
import { FaGripVertical } from '@react-icons/all-files/fa/FaGripVertical'
import { FaHashtag } from '@react-icons/all-files/fa/FaHashtag'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'
import { FaIcons } from '@react-icons/all-files/fa/FaIcons'
import { FaSave } from '@react-icons/all-files/fa/FaSave'
import { FaPlus } from '@react-icons/all-files/fa/FaPlus'
import { FaCheck } from '@react-icons/all-files/fa/FaCheck'
import { FormList } from '@mantine/form/lib/form-list/form-list'
import { useAppSelector } from './../../apis/redux/mainStore'
import { DatabaseFader } from './../../../database/repository/fader'
import { ApiCall } from './../../apis/wrapper'
import { showNotification } from '@mantine/notifications'

interface FormValues {
	faders: FormList<DatabaseFader>
}

export const FadersConfigurationPage = () => {
	const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
	const [formOriginalValues, setFormOriginalValues] = useState<string>('') // Values used to detect unsaved changes
	const faders = useAppSelector(state => (state.database ? state.database.faders : false))
	const folders = useAppSelector(state => (state.database ? state.database.folders : false))
	const foldersForSelect: Array<SelectItem> = []
	// Prepare fader folders list for select dropdown
	if (folders !== false) {
		Object.entries(folders).forEach(([, value]) => {
			foldersForSelect.push({
				value: value.id.toString(),
				label: value.name,
				group: 'Folder',
			})
		})
	}
	// Setup the form
	const form = useForm<FormValues>({
		initialValues: {
			faders: formList([]),
		},
		validate: {
			faders: {
				name: value => (value.length < 2 ? 'Name should have at least 2 letters' : null),
				folderId: value => (value == null || parseInt(value) == 0 ? 'Folder must be selected' : null),
				channel: value =>
					typeof value === 'undefined' || value < 1 || value > 99 ? 'Channel must be between 1 and 99' : null,
			},
		},
	})
	useEffect(() => {
		// Normally called when the database is populated and ready, so we can populate the form
		if (faders !== false) {
			const formValues = { faders: formList(faders.map(item => ({ ...item }))) } // Make a copy of the faders using map because the object is not extensible
			form.setValues(formValues)
			setFormOriginalValues(JSON.stringify(formValues))
			setLoadingOverlayVisible(false)
		} else if (!loadingOverlayVisible) setLoadingOverlayVisible(true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [faders])
	const saveByUserNeeded = formOriginalValues !== JSON.stringify(form.values) // Does the user have unsaved changes
	// Handle the submit button
	const handleSubmit = (values: FormValues) => {
		setLoadingOverlayVisible(true)
		ApiCall.put('/faders', values.faders).then(() => {
			showNotification({
				message: 'Your changes have been saved',
				autoClose: 2000,
				disallowClose: true,
				color: 'green',
				icon: <FaCheck />,
			})
		})
	}
	const fields = form.values.faders.map((_, index) => (
		<Draggable key={index} index={index} draggableId={index.toString()}>
			{provided => (
				<tr ref={provided.innerRef} {...provided.draggableProps}>
					<td>
						<Center {...provided.dragHandleProps}>
							<FaGripVertical />
						</Center>
					</td>
					<td>
						<TextInput placeholder="Name" {...form.getListInputProps('faders', index, 'name')} />
					</td>
					<td>
						<Checkbox
							size={'lg'}
							title="Visible"
							{...form.getListInputProps('faders', index, 'enabled', { type: 'checkbox' })}
						/>
					</td>
					<td>
						<Select
							placeholder="Type"
							icon={<FaIcons />}
							{...form.getListInputProps('faders', index, 'type')}
							data={[
								{
									value: 'ch',
									label: 'Channel',
									group: 'Inputs',
								},
								{
									value: 'dca',
									label: 'DCAs',
									group: '',
								},
								{
									value: 'auxin',
									label: 'Aux In',
									group: 'Inputs',
								},
								{
									value: 'fxrtn',
									label: 'Effect Return',
									group: 'Outputs',
								},
								{
									value: 'bus',
									label: 'Bus',
									group: 'Outputs',
								},
								{
									value: 'main/st',
									label: 'Stereo Master',
									group: '',
								},
								{
									value: 'main/m',
									label: 'Mono Master',
									group: '',
								},
							]}
						/>
					</td>
					<td>
						{!['main/st', 'main/m'].includes(form.values.faders[index].type) ? (
							<NumberInput
								placeholder="Number"
								icon={<FaHashtag />}
								min={1}
								max={99}
								{...form.getListInputProps('faders', index, 'channel')}
							/>
						) : null}
					</td>
					<td>
						<Select
							placeholder="Folder"
							icon={<FaFolder />}
							//
							{...form.getListInputProps('faders', index, 'folderId')}
							data={foldersForSelect}
						/>
					</td>
					<td>
						<ActionIcon color="red" variant="hover" onClick={() => form.removeListItem('faders', index)}>
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
				{faders !== false && folders !== false ? (
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<Group position="left" mt="md">
							<Title>Faders</Title>
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
												form.addListItem('faders', {
													id: null,
													name: 'New Channel fader',
													channel: 1,
													enabled: true,
													type: 'ch',
													data: null,
													folderId: '0',
												})
											}}
										>
											<FaPlus />
										</Button>
									</th>
									<th>Name</th>
									<th>Visible</th>
									<th>Type</th>
									<th>Number</th>
									<th>Folder</th>
									<th></th>
								</tr>
							</thead>
							<DragDropContext
								onDragEnd={({ destination, source }) =>
									form.reorderListItem('faders', {
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
