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
	ColorInput,
	Modal,
	SelectItem,
	NumberInput,
	Chips,
	Chip,
	Text,
	Title,
	Table,
	Alert,
} from '@mantine/core'
import { useForm, formList } from '@mantine/form'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { FaFolder } from '@react-icons/all-files/fa/FaFolder'
import { FaGripVertical } from '@react-icons/all-files/fa/FaGripVertical'
import { FaRegClock } from '@react-icons/all-files/fa/FaRegClock'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'
import { FaPencilAlt } from '@react-icons/all-files/fa/FaPencilAlt'
import { FaSpaceShuttle } from '@react-icons/all-files/fa/FaSpaceShuttle'
import { FaSave } from '@react-icons/all-files/fa/FaSave'
import { FaPlus } from '@react-icons/all-files/fa/FaPlus'
import { FaRecycle } from '@react-icons/all-files/fa/FaRecycle'
import { FormList } from '@mantine/form/lib/form-list/form-list'
import { useAppSelector } from './../../apis/redux/mainStore'
import { DatabasePreset, PresetTypes } from './../../../database/repository/preset'
import { ApiCall } from './../../apis/wrapper'
import { OSCPresetEditModal } from './../../Components/Admin/Controls/Presets/EditModal/OSC'
import { HTTPPresetEditModal } from './../../Components/Admin/Controls/Presets/EditModal/HTTP'
import { MacroPresetEditModal } from './../../Components/Admin/Controls/Presets/EditModal/Macro'
import { E131PresetEditModal } from './../../Components/Admin/Controls/Presets/EditModal/E131'
import { useModals } from '@mantine/modals'
import { FaCheck } from '@react-icons/all-files/fa/FaCheck'
import { showNotification } from '@mantine/notifications'
import { isValidJson } from './../../Components/Admin/Controls/Presets/EditModal/isValidJson'

interface FormValues {
	presets: FormList<DatabasePreset>
}

export const PresetsConfigurationPage = () => {
	const modalManager = useModals()
	const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
	const [formOriginalValues, setFormOriginalValues] = useState<string>('') // Values used to detect unsaved changes
	const [modalVisible, setModalVisible] = useState<number | false>(false)
	const presets = useAppSelector(state => (state.database ? state.database.presets : false))
	const folders = useAppSelector(state => (state.database ? state.database.folders : false))
	const foldersForSelect: Array<SelectItem> = []
	// Prepare folders list for select dropdown
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
			presets: formList([]),
		},
		validate: {
			presets: {
				name: value => (value.length < 2 ? 'Name should have at least 2 letters' : null),
				fadeTime: value => (value >= 0 && value <= 60 ? null : 'Fade time must be between 0 and 60 seconds'),
				folderId: value =>
					typeof value === 'undefined' || value == null || parseInt(value) == 0
						? 'Folder must be selected'
						: null,
				data: value => (isValidJson(value) || value === null ? null : 'Data is not valid JSON'),
			},
		},
	})
	useEffect(() => {
		if (presets !== false) {
			const formValues = { presets: formList(presets.map(item => ({ ...item }))) }
			form.setValues(formValues) // Make a copy of the presets using map because the object is not extensible
			setFormOriginalValues(JSON.stringify(formValues))
			setLoadingOverlayVisible(false)
		} else if (!loadingOverlayVisible) setLoadingOverlayVisible(true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [presets])
	const saveByUserNeeded = formOriginalValues !== JSON.stringify(form.values) // Does the user have unsaved changes
	// Handle the submit button
	const handleSubmit = (values: typeof form.values) => {
		setLoadingOverlayVisible(true)
		ApiCall.put('/presets', values.presets).then(() => {
			showNotification({
				message: 'Your changes have been saved',
				autoClose: 2000,
				disallowClose: true,
				color: 'green',
				icon: <FaCheck />,
			})
		})
	}
	const fields = form.values.presets.map((_, index) => (
		<Draggable key={index} index={index} draggableId={index.toString()}>
			{provided => (
				<tr ref={provided.innerRef} {...provided.draggableProps}>
					<td>
						<Center {...provided.dragHandleProps}>
							<FaGripVertical />
						</Center>
					</td>
					<td>
						<TextInput placeholder="Name" {...form.getListInputProps('presets', index, 'name')} />
					</td>
					<td>
						<Select
							placeholder="Folder"
							icon={<FaFolder />}
							// form.values.presets[index].folderId
							{...form.getListInputProps('presets', index, 'folderId')}
							data={foldersForSelect}
						/>
					</td>
					<td>
						<ColorInput
							format="hex"
							{...form.getListInputProps('presets', index, 'color')}
							swatches={['#2C2E33', '#C92A2A', '#A61E4D', '#862E9C', '#1864AB', '#2B8A3E', '#E67700']}
							swatchesPerRow={7}
						/>
					</td>
					<td>
						<NumberInput
							placeholder="Fade time"
							icon={<FaRegClock />}
							min={0}
							max={60}
							{...form.getListInputProps('presets', index, 'fadeTime')}
						/>
					</td>
					<td>
						<Checkbox
							size={'lg'}
							title="Visible"
							{...form.getListInputProps('presets', index, 'enabled', { type: 'checkbox' })}
						/>
					</td>
					<td>
						<Modal
							opened={modalVisible === index}
							onClose={() => {
								setModalVisible(false)
							}}
							size="xl"
							title="Edit Preset"
							overflow="inside"
						>
							{form.values.presets[index].type === 'e131' ? (
								<>
									<TextInput
										py={'md'}
										placeholder="Universe"
										icon={<FaSpaceShuttle />}
										description="Universe number"
										{...form.getListInputProps('presets', index, 'universe')}
									/>
									<E131PresetEditModal {...form.getListInputProps('presets', index, 'data')} />
								</>
							) : null}
							{form.values.presets[index].type === 'osc' ? (
								<OSCPresetEditModal {...form.getListInputProps('presets', index, 'data')} />
							) : null}
							{form.values.presets[index].type === 'http' ? (
								<HTTPPresetEditModal {...form.getListInputProps('presets', index, 'data')} />
							) : null}
							{form.values.presets[index].type === 'macro' ? (
								<MacroPresetEditModal {...form.getListInputProps('presets', index, 'data')} />
							) : null}
						</Modal>
						<ActionIcon variant="hover" onClick={() => setModalVisible(index)}>
							<FaPencilAlt />
						</ActionIcon>
					</td>
					<td>
						<ActionIcon color="red" variant="hover" onClick={() => form.removeListItem('presets', index)}>
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
				{presets !== false && folders !== false ? (
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<Group position="left" mt="md">
							<Title>Presets</Title>
							{saveByUserNeeded ? (
								<Button type="submit" leftIcon={<FaSave />}>
									Save
								</Button>
							) : (
								<Button
									leftIcon={<FaRecycle />}
									variant="outline"
									onClick={() => {
										modalManager.openConfirmModal({
											title: 'Start Sampling Mode',
											children: (
												<Text size="sm">
													Are you sure you wish to sample for data from other lighting control
													systems? This will stop all lighting output from Paradise
												</Text>
											),
											labels: { confirm: 'Confirm', cancel: 'Cancel' },
											onConfirm: () => ApiCall.get('/outputModules/e131/startSampling', {}),
										})
									}}
								>
									Start Sampling Mode
								</Button>
							)}
						</Group>
						{Object.entries(form.errors).map(([type]) => {
							const typeArray = type.split('.')
							let name = 'one of the presets'
							if (form.values.presets[typeArray[1] as unknown as number] !== undefined) {
								name = form.values.presets[typeArray[1] as unknown as number].name
							}
							if (typeArray.length === 3 && typeArray[2] === 'data') {
								return (
									<Alert key={type} title="Data Error" variant="outline" my={'md'}>
										The data for {name} is invalid - use the pencil icon to edit it
									</Alert>
								)
							}
						})}
						<Table verticalSpacing="sm" fontSize="md">
							<thead>
								<tr>
									<th>
										<Button
											compact
											variant="default"
											onClick={() => {
												const createNewPresetModal = modalManager.openModal({
													title: 'Please select a preset type',
													children: (
														<Chips
															size={'md'}
															multiple={false}
															onChange={value => {
																form.addListItem('presets', {
																	id: null,
																	name: 'New ' + value + ' preset',
																	enabled: true,
																	type: value as PresetTypes,
																	universe: null,
																	fadeTime: 0,
																	data: null,
																	folderId: '0',
																	color: '#2C2E33',
																})
																modalManager.closeModal(createNewPresetModal)
															}}
														>
															<Chip value="e131">sACN (E1.31)</Chip>
															<Chip value="osc">OSC</Chip>
															<Chip value="http">HTTP</Chip>
															<Chip value="macro">Macro</Chip>
														</Chips>
													),
												})
											}}
										>
											<FaPlus />
										</Button>
									</th>
									<th>Name</th>
									<th>Folder</th>
									<th>Button Colour</th>
									<th>Fade Time</th>
									<th>Visible</th>
									<th></th>
									<th></th>
								</tr>
							</thead>
							<DragDropContext
								onDragEnd={({ destination, source }) =>
									form.reorderListItem('presets', {
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
