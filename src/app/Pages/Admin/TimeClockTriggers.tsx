import {
	ActionIcon,
	Box,
	Button,
	Checkbox,
	Group,
	LoadingOverlay,
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
import { Draggable } from 'react-beautiful-dnd'
import { TimeClockTrigger } from '../../../database/repository/preset'
import { useAppSelector } from '../../apis/redux/mainStore'
import { ApiCall } from '../../apis/wrapper'

interface FormValues {
	triggers: Array<TimeClockTrigger>
}

export const TimeClockTriggersConfigurationPage = () => {
	const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
	const [formOriginalValues, setFormOriginalValues] = useState<string>('') // Values used to detect unsaved changes
	const presets = useAppSelector(state => (state.database ? state.database.presets : false))
	const timeClockTriggers = useAppSelector(state => (state.database ? state.database.timeClockTriggers : false))
	const presetsForSelect: Array<SelectItem> = []
	// Prepare folders list for select dropdown
	if (presets !== false) {
		Object.entries(presets).forEach(([, value]) => {
			presetsForSelect.push({
				value: value.id.toString(),
				label: value.name,
				group: value.folderId.toString(),
			})
		})
	}
	// Setup the form
	const form = useForm<FormValues>({
		initialValues: {
			triggers: Array<TimeClockTrigger>(),
		},
		validate: {
			triggers: {
				timeout: value => (value < 0 ? 'Timeout should be a number' : null),
				time: value => (value.match(/^\d{1,2}:\d{2}$/) ? null : 'Time should be in hh:mm format'),
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
		<Draggable key={index} index={index} draggableId={index.toString()}>
			{provided => (
				<tr ref={provided.innerRef} {...provided.draggableProps}>
					<td>
						<TextInput placeholder="Name" {...form.getInputProps(`triggers.${index}.time`)} />
					</td>
					<td>
						<Select
							placeholder="Preset"
							{...form.getInputProps(`triggers.${index}.presetId`)}
							data={presetsForSelect}
						/>
					</td>
					<td style={{ width: 0 }}>
						<Checkbox
							my={'md'}
							size={'lg'}
							title="Enabled"
							{...form.getInputProps(`triggers.${index}.enabled`, { type: 'checkbox' })}
						/>
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
			)}
		</Draggable>
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
											variant="default"
											onClick={() =>
												form.insertListItem('triggers', {
													time: '00:00',
													presetId: null,
												})
											}
										>
											<FaPlus />
										</Button>
									</th>
									<th>Time</th>
									<th>Preset</th>
									<th>Enabled</th>
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
