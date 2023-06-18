import {
	ActionIcon,
	Box,
	Button,
	Checkbox,
	Group,
	LoadingOverlay,
	Modal,
	NumberInput,
	Select,
	SelectItem,
	Table,
	Text,
	TextInput,
	Textarea,
	Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { FaCheck } from '@react-icons/all-files/fa/FaCheck'
import { FaCog } from '@react-icons/all-files/fa/FaCog'
import { FaPlus } from '@react-icons/all-files/fa/FaPlus'
import { FaRegClone } from '@react-icons/all-files/fa/FaRegClone'
import { FaSave } from '@react-icons/all-files/fa/FaSave'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'
import React, { useEffect, useState } from 'react'
import { DatabaseTimeClockTrigger } from '../../../database/repository/timeClockTrigger'
import { useAppSelector } from '../../apis/redux/mainStore'
import { ApiCall } from '../../apis/wrapper'

interface FormValues {
	triggers: Array<DatabaseTimeClockTrigger>
}

export const TimeClockTriggersConfigurationPage = () => {
	const [modalVisible, setModalVisible] = useState<number | false>(false)
	const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
	const [formOriginalValues, setFormOriginalValues] = useState<string>('') // Values used to detect unsaved changes
	const presets = useAppSelector(state => (state.database ? state.database.presets : false))
	const folders = useAppSelector(state => (state.database ? state.database.folders : false))
	const timeClockTriggers = useAppSelector(state => (state.database ? state.database.timeClockTriggers : false))
	const presetsForSelect: Array<SelectItem> = []
	// Prepare folders list for select dropdown
	if (presets !== false && folders !== false) {
		Object.entries(presets).forEach(([, value]) => {
			presetsForSelect.push({
				value: value.id.toString(),
				label: value.name,
				group: folders[value.folderId as unknown as number].name,
			})
		})
	}
	// Setup the form
	const form = useForm<FormValues>({
		initialValues: {
			triggers: Array<DatabaseTimeClockTrigger>(),
		},
		validate: {
			triggers: {
				timeout: (value: number) => (value < 0 ? 'Timeout should be a number' : null),
				time: (value: string) =>
					value.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/) ? null : 'Time should be in hh:mm format',
				presetId: value =>
					typeof value === 'undefined' || value == null || parseInt(value) == 0
						? 'Preset must be selected'
						: null,
			},
		},
	})
	useEffect(() => {
		if (timeClockTriggers !== false) {
			const formValues = { triggers: timeClockTriggers.map(item => ({ ...item })) }
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
		ApiCall.put('/timeClockTriggers', values.triggers).then(() => {
			showNotification({
				message: 'Your changes have been saved',
				autoClose: 2000,
				disallowClose: true,
				color: 'green',
				icon: <FaCheck />,
			})
		})
	}
	const fields = form.values.triggers.map((_, index) => (
		<tr key={index}>
			<td style={{ width: '36.5em' }}>
				{form.values.triggers[index].notes ? <Text mb={'sm'}>{form.values.triggers[index].notes}</Text> : null}
				<Group position="left">
					{['Mon', 'Tues', 'Weds', 'Thurs', 'Fri', 'Sat', 'Sun'].map((day, i) => (
						<Checkbox
							key={i}
							size={'lg'}
							description={day}
							{...form.getInputProps(`triggers.${index}.${day.toLowerCase()}`, { type: 'checkbox' })}
						/>
					))}
				</Group>
			</td>
			<td style={{ width: '6em' }}>
				<TextInput {...form.getInputProps(`triggers.${index}.time`)} />
			</td>
			<td>
				<Select
					placeholder="Preset"
					searchable={true}
					nothingFound="Preset not found"
					{...form.getInputProps(`triggers.${index}.presetId`)}
					data={presetsForSelect}
				/>
			</td>
			<td style={{ width: 0 }}>
				<Modal
					opened={modalVisible === index}
					onClose={() => {
						setModalVisible(false)
					}}
					size="xl"
					title="Advanced Options"
					overflow="inside"
				>
					<Textarea
						{...form.getInputProps(`triggers.${index}.notes`)}
						label="Notes"
						description={'Only visible here in the editor'}
						mt={'md'}
						rows={3}
					/>
					<Checkbox
						size={'lg'}
						mt={'md'}
						label="Enabled"
						description="If unchecked, this trigger will never be used"
						{...form.getInputProps(`triggers.${index}.enabled`, { type: 'checkbox' })}
					/>
					<Checkbox
						size={'lg'}
						mt={'md'}
						label="Run when locked"
						description="If unchecked, this trigger will be skipped if the control panel is locked"
						{...form.getInputProps(`triggers.${index}.enabledWhenLocked`, { type: 'checkbox' })}
					/>
					<NumberInput
						{...form.getInputProps(`triggers.${index}.timeout`)}
						min={1}
						label="Timeout"
						description="How many minutes after the time stated the trigger can run"
						max={60}
						step={1}
						mt={'lg'}
					/>
					<Text mt="md">Last Triggered: {form.values.triggers[index].lastTriggeredString}</Text>
				</Modal>

				<ActionIcon variant="transparent" onClick={() => setModalVisible(index)}>
					<FaCog />
				</ActionIcon>
			</td>
			<td style={{ width: 0 }}>
				<ActionIcon
					title="Duplicate"
					variant="transparent"
					onClick={() => {
						const newItem = form.values.triggers[index]
						newItem.id = null
						form.insertListItem('triggers', newItem)
					}}
				>
					<FaRegClone />
				</ActionIcon>
			</td>
			<td style={{ width: 0 }}>
				<ActionIcon
					color="red"
					title="Delete"
					variant="transparent"
					onClick={() => form.removeListItem('triggers', index)}
				>
					<FaTrash />
				</ActionIcon>
			</td>
		</tr>
	))

	return (
		<Box mx="lg">
			<div style={{ position: 'relative' }}>
				<LoadingOverlay visible={loadingOverlayVisible} transitionDuration={0} />
				{timeClockTriggers !== false && presets !== false ? (
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<Group position="left" mt="md">
							<Title>Scheduled Presets</Title>
							{saveByUserNeeded ? (
								<Button type="submit" leftIcon={<FaSave />}>
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
											mr={'md'}
											variant="default"
											onClick={() =>
												form.insertListItem('triggers', {
													time: '00:00',
													timeout: 5,
													enabled: true,
													enabledWhenLocked: true,
													mon: true,
													tues: true,
													weds: true,
													thurs: true,
													fri: true,
													sat: true,
													sun: true,
													presetId: null,
												})
											}
										>
											<FaPlus />
										</Button>
										Days of Week
									</th>
									<th>Time</th>
									<th>Preset</th>
									<th></th>
									<th></th>
									<th></th>
								</tr>
							</thead>
							<tbody>{fields}</tbody>
						</Table>
					</form>
				) : (
					'Loading'
				)}
			</div>
		</Box>
	)
}
