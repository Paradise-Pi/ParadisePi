import React, { useEffect, useState } from 'react'
import {
	Group,
	TextInput,
	Box,
	Text,
	Code,
	Button,
	Center,
	ActionIcon,
	Select,
	Tooltip,
	LoadingOverlay,
	Checkbox,
	ColorInput,
	Modal,
	JsonInput,
	Tabs,
	SelectItem,
} from '@mantine/core'
import { useForm, formList } from '@mantine/form'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { FaFolder, FaGripVertical, FaInfoCircle, FaRegClock, FaTrash, FaPencilAlt } from 'react-icons/fa'
import { FormList } from '@mantine/form/lib/form-list/form-list'
import { useAppSelector } from './../../Apis/mainStore'
import { DatabasePreset } from './../../../database/repository/preset'
import { DatabasePresetFolder } from './../../../database/repository/presetFolder'
import { ApiCall } from './../../Apis/wrapper'

interface FormValues {
	presets: FormList<DatabasePreset>
}

export const PresetsConfigurationPage = () => {
	const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
	const [modalVisible, setModalVisible] = useState<number | false>(false)
	const presets = useAppSelector(state => (state.database ? state.database.presets : false))
	const presetFolders = useAppSelector(state => (state.database ? state.database.presetFolders : false))
	const presetFoldersForSelect: Array<SelectItem> = []
	// Prepare preset folders list for select dropdown
	if (presetFolders !== false) {
		Object.entries(presetFolders).forEach(([key, value]) => {
			presetFoldersForSelect.push({
				value: value.id.toString(),
				label: value.name,
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
				folderId: value => (parseInt(value) > 0 ? null : 'Folder must be selected'),
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
					<TextInput
						placeholder="Fade time"
						icon={<FaRegClock />}
						{...form.getListInputProps('presets', index, 'fadeTime')}
						rightSection={
							<Tooltip label="Time in seconds for fade" position="left" placement="end">
								<FaInfoCircle />
							</Tooltip>
						}
					/>
					<Checkbox
						size={'lg'}
						title="Visible"
						{...form.getListInputProps('presets', index, 'enabled', { type: 'checkbox' })}
					/>
					<Select
						placeholder="Type"
						{...form.getListInputProps('presets', index, 'type')}
						data={[
							{ value: 'e131', label: 'sACN (E1.31)' },
							{ value: 'osc', label: 'OSC' },
							{ value: 'http', label: 'HTTP', disabled: true },
							{ value: 'macro', label: 'Macro', disabled: true },
						]}
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
						<Tabs>
							<Tabs.Tab label="Edit">Coming soon</Tabs.Tab>
							<Tabs.Tab label="JSON Mode">
								<JsonInput
									{...form.getListInputProps('presets', index, 'data')}
									formatOnBlur={true}
									autosize
									maxRows={10}
								/>
							</Tabs.Tab>
						</Tabs>
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
								onClick={() =>
									form.addListItem('presets', {
										id: 0,
										name: '',
										enabled: true,
										type: 'e131',
										universe: null,
										fadeTime: 0,
										data: null,
										folderId: '0',
										color: '#2C2E33',
									})
								}
							>
								Add preset
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
				{/*<Code block>{JSON.stringify(form.values, null, 2)}</Code>*/}
			</div>
		</Box>
	)
}
