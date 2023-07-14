import React, { useEffect } from 'react'
import { Group, ActionIcon, Button, Text, Checkbox, NumberInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'
import { randomId } from '@mantine/hooks'
import { InputProps } from '../../../../InputProps'

interface Trigger {
	time: string
	enabled: boolean
	timeout: number
	countdownWarning: number
	key: string
}
interface FormValues {
	triggers: Array<Trigger>
}

export const TimeClockTriggersEditor = (props: InputProps) => {
	const form = useForm<FormValues>({
		initialValues: {
			triggers: [],
		},
	})
	useEffect(() => {
		if (props.value !== null) {
			const valueObject = JSON.parse(props.value) || {}
			form.setValues({
				triggers: valueObject.map((item: Trigger) => ({
					time: item.time,
					key: item.key,
				})),
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.value])
	return (
		<>
			<Group mt="xs">
				<Text mt={'md'}>Time Clock Triggers</Text>
				<Button
					mt={'md'}
					size="sm"
					onClick={() =>
						form.insertListItem('triggers', {
							time: '',
							enabled: true,
							timeout: 60,
							countdownWarning: 0,
							key: randomId(),
						})
					}
				>
					Add Trigger
				</Button>
				{form.isDirty() ? (
					<Button mt={'md'} size="sm" onClick={() => props.onChange(JSON.stringify(form.values.triggers))}>
						Apply
					</Button>
				) : null}
			</Group>
			<Text size={'sm'}>Time Clock Triggers will recall this preset at the following times (if enabled)</Text>
			{form.values.triggers.map((item, index) => (
				<Group key={item.key} mt="xs">
					<NumberInput
						label="Trigger Time"
						max={2359}
						min={0}
						parser={value =>
							value.match(/\d(?=(?:\D*\d){0,3}$)/g) ? value.match(/\d(?=(?:\D*\d){0,3}$)/g).join('') : ''
						}
						formatter={value =>
							!Number.isNaN(parseFloat(value))
								? value.replace(/\b\d{1,4}\b/g, match => {
										const paddedNumber = match.padStart(4, '0')
										const hours = paddedNumber.slice(0, 2)
										const minutes = paddedNumber.slice(2)
										return `${hours}:${minutes}`
								  })
								: ''
						}
						{...form.getInputProps(`triggers.${index}.time`)}
					/>
					<Checkbox
						mt={'lg'}
						size={'lg'}
						label="Enabled"
						{...form.getInputProps(`triggers.${index}.enabled`, { type: 'checkbox' })}
					/>
					<ActionIcon
						mt={'lg'}
						color="red"
						variant="transparent"
						onClick={() => form.removeListItem('triggers', index)}
					>
						<FaTrash />
					</ActionIcon>
				</Group>
			))}

			<Group position="center" mt="md"></Group>
		</>
	)
}
