import React, { useEffect } from 'react'
import { Group, ActionIcon, Button, Select } from '@mantine/core'
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
					enabled: item.enabled,
					timeout: item.timeout,
					countdownWarning: item.countdownWarning,
					key: item.key,
				})),
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.value])
	return (
		<>
			{form.values.triggers.map((item, index) => (
				<Group key={item.key} mt="xs">
					<Select
						{...form.getInputProps(`steps.${index}.time`)}
						data={[
							{ value: 'preset', label: 'Trigger Preset' },
							{ value: 'link', label: 'Open a Page' },
						]}
					/>
					<ActionIcon color="red" variant="transparent" onClick={() => form.removeListItem('steps', index)}>
						<FaTrash />
					</ActionIcon>
				</Group>
			))}

			<Group position="center" mt="md">
				<Button
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
					Add step
				</Button>
				<Button onClick={() => props.onChange(JSON.stringify(form.values.triggers))}>Apply</Button>
			</Group>
		</>
	)
}
