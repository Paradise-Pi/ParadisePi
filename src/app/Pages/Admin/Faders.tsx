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
import { useForm } from '@mantine/form'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { FaFolder } from '@react-icons/all-files/fa/FaFolder'
import { FaGripVertical } from '@react-icons/all-files/fa/FaGripVertical'
import { FaHashtag } from '@react-icons/all-files/fa/FaHashtag'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'
import { FaIcons } from '@react-icons/all-files/fa/FaIcons'
import { FaSave } from '@react-icons/all-files/fa/FaSave'
import { FaPlus } from '@react-icons/all-files/fa/FaPlus'
import { FaCheck } from '@react-icons/all-files/fa/FaCheck'
import { useAppSelector } from './../../apis/redux/mainStore'
import { DatabaseFader } from './../../../database/repository/fader'
import { ApiCall } from './../../apis/wrapper'
import { showNotification } from '@mantine/notifications'
import { usePrompt } from '../../apis/utilities/usePrompt'

interface FormValues {
	faders: Array<DatabaseFader>
}
const FaderChoices = (mixer: string) => {
	const choices = [
		{
			value: 'ch',
			label: 'Channel',
			group: 'Inputs',
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
	]
	if (mixer === 'x32') {
		choices.push(
			{
				value: 'main/st',
				label: 'Stereo Master',
				group: 'Outputs',
			},
			{
				value: 'main/m',
				label: 'Mono Master',
				group: 'Outputs',
			}
		)
	}
	if (mixer === 'xair') {
		choices.push({
			value: 'lr',
			label: 'Stereo Master',
			group: 'Outputs',
		})
	}
	return choices
}
export const FadersConfigurationPage = () => {
	const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
	const [formOriginalValues, setFormOriginalValues] = useState<string>('') // Values used to detect unsaved changes
	const faders = useAppSelector(state => (state.database ? state.database.faders : false))
	const folders = useAppSelector(state => (state.database ? state.database.folders : false))
	const mixer = useAppSelector(state => (state.database ? state.database.config.osc.OSCMixerType : false))
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
			faders: [],
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
			const formValues = { faders: faders.map(item => ({ ...item })) } // Make a copy of the faders using map because the object is not extensible
			form.setValues(formValues)
			setFormOriginalValues(JSON.stringify(formValues))
			setLoadingOverlayVisible(false)
		} else if (!loadingOverlayVisible) setLoadingOverlayVisible(true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [faders])
	const saveByUserNeeded = formOriginalValues !== JSON.stringify(form.values) // Does the user have unsaved changes
	usePrompt(saveByUserNeeded ? 'You have unsaved changes, are you sure you want to leave this page?' : false)

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
						<TextInput placeholder="Name" {...form.getInputProps(`faders.${index}.name`)} />
					</td>
					<td>
						<Select
							placeholder="Folder"
							icon={<FaFolder />}
							//
							{...form.getInputProps(`faders.${index}.folderId`)}
							data={foldersForSelect}
						/>
					</td>
					<td>
						<Select
							placeholder="Type"
							icon={<FaIcons />}
							{...form.getInputProps(`faders.${index}.type`)}
							data={mixer !== false ? FaderChoices(mixer.replace('midas-', '')) : []}
						/>
					</td>
					<td>
						{!['main/st', 'main/m', 'lr'].includes(form.values.faders[index].type) ? (
							<NumberInput
								placeholder="Number"
								icon={<FaHashtag />}
								min={1}
								max={99}
								{...form.getInputProps(`faders.${index}.channel`)}
							/>
						) : null}
					</td>
					<td>
						<Checkbox
							size={'lg'}
							title="Visible"
							{...form.getInputProps(`faders.${index}.enabled`, { type: 'checkbox' })}
						/>
					</td>
					<td>
						<ActionIcon
							color="red"
							variant="transparent"
							onClick={() => form.removeListItem('faders', index)}
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
				{faders !== false && folders !== false && mixer !== false ? (
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
												form.insertListItem('faders', {
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
									<th>Folder</th>
									<th>Type</th>
									<th>Number</th>
									<th>Controllable</th>
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
