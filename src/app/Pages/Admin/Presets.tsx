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
} from '@mantine/core'
import { useForm, formList } from '@mantine/form'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { FaFolder } from '@react-icons/all-files/fa/FaFolder'
import { FaGripVertical } from '@react-icons/all-files/fa/FaGripVertical'
import { FaRegClock } from '@react-icons/all-files/fa/FaRegClock'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'
import { FaPencilAlt } from '@react-icons/all-files/fa/FaPencilAlt'
import { FaSpaceShuttle } from '@react-icons/all-files/fa/FaSpaceShuttle'
import { FormList } from '@mantine/form/lib/form-list/form-list'
import { useAppSelector } from './../../apis/redux/mainStore'
import { DatabasePreset, PresetTypes } from './../../../database/repository/preset'
import { ApiCall } from './../../apis/wrapper'
import { OSCPresetEditModal } from './../../Components/Admin/Controls/Presets/EditModal/OSC'
import { HTTPPresetEditModal } from './../../Components/Admin/Controls/Presets/EditModal/HTTP'
import { MacroPresetEditModal } from './../../Components/Admin/Controls/Presets/EditModal/Macro'
import { E131PresetEditModal } from './../../Components/Admin/Controls/Presets/EditModal/E131'
import { useModals } from '@mantine/modals'

interface FormValues {
	presets: FormList<DatabasePreset>
}

export const PresetsConfigurationPage = () => {
	const modalManager = useModals()
	const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
	const [modalVisible, setModalVisible] = useState<number | false>(false)
	const presets = useAppSelector(state => (state.database ? state.database.presets : false))
	const presetFolders = useAppSelector(state => (state.database ? state.database.presetFolders : false))
	const presetFoldersForSelect: Array<SelectItem> = []
	// Prepare preset folders list for select dropdown
	if (presetFolders !== false) {
		Object.entries(presetFolders).forEach(([, value]) => {
			presetFoldersForSelect.push({
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
				folderId: value => (value !== null ? null : 'Folder must be selected'),
			},
		},
	})
	useEffect(() => {
		if (presets !== false) form.setValues({ presets: formList(presets.map(item => ({ ...item }))) }) // Make a copy of the presets using map because the object is not extensible
		if (loadingOverlayVisible) setLoadingOverlayVisible(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [presets])
	// Handle the submit button
	const handleSubmit = (values: typeof form.values) => {
		setLoadingOverlayVisible(true)
		ApiCall.put('/presets', values.presets)
	}
	const fields = form.values.presets.map((_, index) => (
		<Draggable key={index} index={index} draggableId={index.toString()}>
			{provided => (
				<Group ref={provided.innerRef} mt="xs" {...provided.draggableProps}>
					<Center {...provided.dragHandleProps}>
						<FaGripVertical />
					</Center>
					<TextInput placeholder="Name" {...form.getListInputProps('presets', index, 'name')} />
					<Select
						placeholder="Folder"
						icon={<FaFolder />}
						// form.values.presets[index].folderId
						{...form.getListInputProps('presets', index, 'folderId')}
						data={presetFoldersForSelect}
					/>
					<ColorInput
						format="hex"
						{...form.getListInputProps('presets', index, 'color')}
						swatches={['#2C2E33', '#C92A2A', '#A61E4D', '#862E9C', '#1864AB', '#2B8A3E', '#E67700']}
						swatchesPerRow={7}
					/>
					<NumberInput
						placeholder="Fade time"
						icon={<FaRegClock />}
						min={0}
						max={60}
						{...form.getListInputProps('presets', index, 'fadeTime')}
					/>
					<Checkbox
						size={'lg'}
						title="Visible"
						{...form.getListInputProps('presets', index, 'enabled', { type: 'checkbox' })}
					/>
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
					<ActionIcon color="red" variant="hover" onClick={() => form.removeListItem('presets', index)}>
						<FaTrash />
					</ActionIcon>
				</Group>
			)}
		</Draggable>
	))

	return (
		<Box mx="lg">
			<div style={{ position: 'relative' }}>
				<LoadingOverlay visible={loadingOverlayVisible} transitionDuration={0} />
				{presets !== false && presetFolders !== false ? (
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<Group position="left" mt="md">
							<Button
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
								Create preset
							</Button>
                            <Button
                                onClick={() => {
									ApiCall.get('/e131Sampler', {})
								}}
                            >
                                Start Sampling Mode
                            </Button>
							<Button type="submit">Save</Button>
						</Group>
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
									<div {...provided.droppableProps} ref={provided.innerRef}>
										{fields}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</DragDropContext>
					</form>
				) : (
					'Loading'
				)}
			</div>
		</Box>
	)
}
