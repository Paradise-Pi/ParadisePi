import React, { useEffect } from 'react'
import { GetInputProps } from '@mantine/form/lib/types'
import { SelectItem, Group, ActionIcon, Button, Select } from '@mantine/core'
import { useForm, formList } from '@mantine/form'
import { FormList } from '@mantine/form/lib/form-list/form-list'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'
import { randomId } from '@mantine/hooks'
import { useAppSelector } from './../../../../../apis/redux/mainStore'
interface FormValues {
	steps: FormList<{
		type: string
		value: string
		key: string
	}>
}
export const MacroPresetEditModal = (props: GetInputProps<'input'>) => {
	const presets = useAppSelector(state => (state.database ? state.database.presets : false))
	const presetsForSelect: Array<SelectItem> = []
	// Prepare folders list for select dropdown
	if (presets !== false) {
		Object.entries(presets).forEach(([, value]) => {
			presetsForSelect.push({
				value: value.id.toString(),
				label: value.name,
				group: 'Preset',
			})
		})
	}

	const valueObject = JSON.parse(props.value) || {}
	const form = useForm<FormValues>({
		initialValues: {
			steps: formList([]),
		},
	})
	useEffect(() => {
		if (props.value !== null)
			form.setValues({
				steps: formList(
					valueObject.map((item: { type: string; value: string; key: string }) => ({
						type: item.type,
						value: item.value,
						key: randomId(),
					}))
				),
			})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.value])
	return (
		<>
			{form.values.steps.map((item, index) => (
				<Group key={item.key} mt="xs">
					<Select
						{...form.getListInputProps('steps', index, 'type')}
						data={[
							{ value: 'preset', label: 'Trigger Preset' },
							{ value: 'link', label: 'Open a Page' },
						]}
					/>
					{form.values.steps[index].type === 'preset' ? (
						<Select
							placeholder="Preset"
							{...form.getListInputProps('steps', index, 'value')}
							data={presetsForSelect}
						/>
					) : form.values.steps[index].type === 'link' ? (
						<Select
							placeholder="Page"
							{...form.getListInputProps('steps', index, 'value')}
							data={[
								{
									value: '/controlPanel/help',
									label: 'Help',
									group: 'General',
								},
								{
									value: '/admin/controls',
									label: 'Setup & Administration Menu',
									group: 'General',
								},
								{
									value: '/controlPanel/e131/lxKeypad',
									label: 'Keypad',
									group: 'sACN (E1.31)',
								},
								{
									value: '/controlPanel/e131/channelCheck',
									label: 'Channel Check',
									group: 'sACN (E1.31)',
								},
							]}
						/>
					) : null}
					<ActionIcon color="red" variant="hover" onClick={() => form.removeListItem('steps', index)}>
						<FaTrash />
					</ActionIcon>
				</Group>
			))}

			<Group position="center" mt="md">
				<Button onClick={() => form.addListItem('steps', { type: '', value: '', key: randomId() })}>
					Add step
				</Button>
				<Button onClick={() => props.onChange(JSON.stringify(form.values.steps))}>Apply</Button>
			</Group>
		</>
	)
}
