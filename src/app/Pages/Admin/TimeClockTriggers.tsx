import {
	ActionIcon,
	Box,
	Button,
	Checkbox,
	Group,
	LoadingOverlay,
	NumberInput,
	Select,
	SelectItem,
	Table,
	TextInput,
	Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { FaCheck } from '@react-icons/all-files/fa/FaCheck'
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
				time: (value: string) => (value.match(/^\d{1,2}:\d{2}$/) ? null : 'Time should be in hh:mm format'),
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
			<td style={{ width: '7em' }}>
				<TextInput placeholder="Name" {...form.getInputProps(`triggers.${index}.time`)} />
			</td>
			<td style={{ width: '38em' }}>
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
				<Checkbox
					size={'lg'}
					title="Enabled"
					{...form.getInputProps(`triggers.${index}.enabled`, { type: 'checkbox' })}
				/>
			</td>
			<td style={{ width: '4em' }}>
				<NumberInput {...form.getInputProps(`triggers.${index}.timeout`)} min={0} max={60} step={1} />
			</td>
			<td style={{ width: 0 }}>
				<ActionIcon
					title="Duplicate"
					variant="transparent"
					onClick={() => form.insertListItem('triggers', form.values.triggers[index])}
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
										Time
									</th>
									<th>Days of Week</th>
									<th>Preset</th>
									<th>Enabled</th>
									<th>Timeout</th>
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
