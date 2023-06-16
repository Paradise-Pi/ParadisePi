import {
	ActionIcon,
	Alert,
	Badge,
	Box,
	Button,
	Center,
	Checkbox,
	Chip,
	ColorInput,
	Group,
	LoadingOverlay,
	Modal,
	NumberInput,
	Select,
	SelectItem,
	Table,
	Text,
	TextInput,
	Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useModals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { FaCheck } from '@react-icons/all-files/fa/FaCheck'
import { FaFolder } from '@react-icons/all-files/fa/FaFolder'
import { FaGripVertical } from '@react-icons/all-files/fa/FaGripVertical'
import { FaPencilAlt } from '@react-icons/all-files/fa/FaPencilAlt'
import { FaPlus } from '@react-icons/all-files/fa/FaPlus'
import { FaRecycle } from '@react-icons/all-files/fa/FaRecycle'
import { FaRegClock } from '@react-icons/all-files/fa/FaRegClock'
import { FaRegClone } from '@react-icons/all-files/fa/FaRegClone'
import { FaSave } from '@react-icons/all-files/fa/FaSave'
import { FaSpaceShuttle } from '@react-icons/all-files/fa/FaSpaceShuttle'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { DatabasePreset, PresetTypes } from './../../../database/repository/preset'
import { E131PresetEditModal } from './../../Components/Admin/Controls/Presets/EditModal/E131'
import { HTTPPresetEditModal } from './../../Components/Admin/Controls/Presets/EditModal/HTTP'
import { MacroPresetEditModal } from './../../Components/Admin/Controls/Presets/EditModal/Macro'
import { OSCPresetEditModal } from './../../Components/Admin/Controls/Presets/EditModal/OSC'
import { isValidJson } from './../../Components/Admin/Controls/Presets/EditModal/isValidJson'
import { ButtonIconSelectItem, availableIcons } from './../../Components/ControlPanel/ButtonIcon'
import { useAppSelector } from './../../apis/redux/mainStore'
import { ApiCall } from './../../apis/wrapper'

interface FormValues {
	presets: Array<DatabasePreset>
}

export const PresetsConfigurationPage = () => {
	const modalManager = useModals()
	const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
	const [formOriginalValues, setFormOriginalValues] = useState<string>('') // Values used to detect unsaved changes
	const [modalVisible, setModalVisible] = useState<number | false>(false)
	const presets = useAppSelector(state => (state.database ? state.database.presets : false))
	const folders = useAppSelector(state => (state.database ? state.database.folders : false))
	const ipAddress = useAppSelector(state => (state.database ? state.database.about.ipAddress : null))
	const port = useAppSelector(state => (state.database ? state.database.about.port : false))
	const foldersForSelect: Array<SelectItem> = []
	// Prepare folders list for select dropdown
	if (folders !== false) {
		Object.entries(folders).forEach(([, value]) => {
			foldersForSelect.push({
				value: value.id.toString(),
				label: (value.parent ? value.parent.name + ' → ' : '') + value.name,
				group: 'Folder',
			})
		})
	}
	// Setup the form
	const form = useForm<FormValues>({
		initialValues: {
			presets: Array<DatabasePreset>(),
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
			const formValues = { presets: presets.map(item => ({ ...item })) }
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
					<td style={{ width: '1em' }}>
						<Center {...provided.dragHandleProps}>
							<FaGripVertical />
						</Center>
					</td>
					<td style={{ width: '1em' }}>
						<Badge variant="light">
							{form.values.presets[index].type === 'e131'
								? 'sACN (E1.31)'
								: form.values.presets[index].type === 'osc'
								? 'OSC'
								: form.values.presets[index].type === 'http'
								? 'HTTP'
								: form.values.presets[index].type === 'macro'
								? 'Macro'
								: ''}
						</Badge>
					</td>
					<td>
						<TextInput placeholder="Name" {...form.getInputProps(`presets.${index}.name`)} />
					</td>
					<td>
						<Select
							placeholder="Folder"
							icon={<FaFolder />}
							// form.values.presets[index].folderId
							{...form.getInputProps(`presets.${index}.folderId`)}
							data={foldersForSelect}
						/>
					</td>
					<td style={{ width: 0 }}>
						<Checkbox
							size={'lg'}
							title="Visible"
							{...form.getInputProps(`presets.${index}.enabled`, { type: 'checkbox' })}
						/>
					</td>
					<td style={{ width: 0 }}>
						<Modal
							opened={modalVisible === index}
							onClose={() => {
								setModalVisible(false)
							}}
							size="xl"
							title="Edit Preset"
							overflow="inside"
						>
							<Select
								placeholder="Icon"
								label="Icon"
								{...form.getInputProps(`presets.${index}.icon`)}
								itemComponent={ButtonIconSelectItem}
								searchable={true}
								nothingFound="No icons found"
								clearable={true}
								data={[
									{ value: null, icon: null, label: '' },
									...Object.entries(availableIcons()).map(([value, name]) => ({
										value: value,
										icon: value,
										label: name,
									})),
								]}
							/>
							<ColorInput
								format="hex"
								{...form.getInputProps(`presets.${index}.color`)}
								swatches={['#2C2E33', '#C92A2A', '#A61E4D', '#862E9C', '#1864AB', '#2B8A3E', '#E67700']}
								swatchesPerRow={7}
								label="Button Colour"
								my={'md'}
							/>
							<Checkbox
								my={'md'}
								size={'lg'}
								label="HTTP Trigger Enabled"
								description="Enable this preset to be triggered by HTTP requests"
								{...form.getInputProps(`presets.${index}.httpTriggerEnabled`, { type: 'checkbox' })}
							/>
							{form.values.presets[index].httpTriggerEnabled ? (
								<TextInput
									description={'HTTP Trigger URL'}
									readOnly={true}
									value={
										form.values.presets[index].id
											? 'http://' +
											  ipAddress +
											  ':' +
											  port +
											  '/trigger/preset/' +
											  form.values.presets[index].id
											: 'Save preset to generate URL'
									}
								/>
							) : null}
							{form.values.presets[index].type === 'e131' ? (
								<>
									<NumberInput
										placeholder="Fade time"
										icon={<FaRegClock />}
										min={0}
										max={60}
										label="Fade time in seconds"
										{...form.getInputProps(`presets.${index}.fadeTime`)}
									/>
									<TextInput
										py={'md'}
										placeholder="Universe"
										icon={<FaSpaceShuttle />}
										label="Universe number"
										{...form.getInputProps(`presets.${index}.universe`)}
									/>
									<E131PresetEditModal {...form.getInputProps(`presets.${index}.data`)} />
								</>
							) : null}
							{form.values.presets[index].type === 'osc' ? (
								<OSCPresetEditModal {...form.getInputProps(`presets.${index}.data`)} />
							) : null}
							{form.values.presets[index].type === 'http' ? (
								<HTTPPresetEditModal {...form.getInputProps(`presets.${index}.data`)} />
							) : null}
							{form.values.presets[index].type === 'macro' ? (
								<MacroPresetEditModal {...form.getInputProps(`presets.${index}.data`)} />
							) : null}
						</Modal>
						<ActionIcon variant="transparent" title="Edit" onClick={() => setModalVisible(index)}>
							<FaPencilAlt />
						</ActionIcon>
					</td>
					<td style={{ width: 0 }}>
						<ActionIcon
							title="Duplicate"
							variant="transparent"
							onClick={() =>
								form.insertListItem('presets', {
									id: null,
									name: 'Copy of ' + form.values.presets[index].name,
									enabled: form.values.presets[index].enabled,
									type: form.values.presets[index].type as PresetTypes,
									universe: form.values.presets[index].universe,
									fadeTime: form.values.presets[index].fadeTime,
									data: form.values.presets[index].data,
									timeClockTriggers: null, //Deliberate decision not to copy these
									httpTriggerEnabled: form.values.presets[index].httpTriggerEnabled,
									folderId: form.values.presets[index].folderId,
									color: form.values.presets[index].color,
									icon: form.values.presets[index].icon,
								})
							}
						>
							<FaRegClone />
						</ActionIcon>
					</td>
					<td style={{ width: 0 }}>
						<ActionIcon
							color="red"
							title="Delete"
							variant="transparent"
							onClick={() => form.removeListItem('presets', index)}
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
														<Chip.Group
															multiple={false}
															onChange={(value: string) => {
																form.insertListItem('presets', {
																	id: null,
																	name: 'New ' + value + ' preset',
																	enabled: true,
																	type: value as PresetTypes,
																	universe: 1,
																	fadeTime: 0,
																	data: null,
																	timeClockTriggers: null,
																	httpTriggerEnabled: false,
																	folderId: '0',
																	icon: null,
																	color: '#2C2E33',
																})
																modalManager.closeModal(createNewPresetModal)
															}}
														>
															<Chip size="md" value="e131">
																sACN (E1.31)
															</Chip>
															<Chip size="md" value="osc">
																OSC
															</Chip>
															<Chip size="md" value="http">
																HTTP
															</Chip>
															<Chip size="md" value="macro">
																Macro
															</Chip>
														</Chip.Group>
													),
												})
											}}
										>
											<FaPlus />
										</Button>
									</th>
									<th>Type</th>
									<th>Name</th>
									<th>Folder</th>
									<th>Visible</th>
									<th></th>
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
