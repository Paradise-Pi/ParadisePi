import { ActionIcon, Button, Group, Select, SelectItem, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { FaCheck } from '@react-icons/all-files/fa/FaCheck'
import { FaExclamationTriangle } from '@react-icons/all-files/fa/FaExclamationTriangle'
import { FaPlus } from '@react-icons/all-files/fa/FaPlus'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'
import React, { useEffect } from 'react'
import { useAppSelector } from '../../../../../apis/redux/mainStore'
import { InputProps } from '../../../../InputProps'
interface FormValues {
	steps: Array<{
		type: string
		value: string
		valueTwo: string
		key: string
	}>
}

export const MacroPresetEditModal = (props: InputProps) => {
	const variables = useAppSelector(state => (state.database ? state.database.variables : false))
	const variablesForSelect: Array<SelectItem> = []
	if (variables !== false) {
		Object.entries(variables).forEach(([, value]) => {
			variablesForSelect.push({
				value: value.id.toString(),
				label: value.name + ' (' + value.value + ')',
			})
		})
	}

	// Prepare folders list for select dropdown
	const folders = useAppSelector(state => (state.database ? state.database.folders : false))
	const foldersForSelect: Array<SelectItem> = []
	if (folders !== false) {
		Object.entries(folders)
			.sort(([, folderA], [, folderB]) => folderA.sort - folderB.sort)
			.forEach(([, value]) => {
				foldersForSelect.push({
					value: value.id.toString(),
					label: (value.parent ? value.parent.name + ' → ' : '') + value.name,
					group: 'Folder',
				})
			})
	}

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

	const form = useForm<FormValues>({
		initialValues: {
			steps: [],
		},
	})
	useEffect(() => {
		if (props.value !== null) {
			const valueObject = JSON.parse(props.value) || {}
			form.setValues({
				steps: valueObject.map(
					(item: { type: string; value: string; valueTwo: string; key: string }, index: number) => ({
						type: item.type,
						value: item.value,
						valueTwo: item.valueTwo,
						key: `key-${index}`,
					})
				),
			})
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.value])
	return (
		<>
			{form.values.steps.map((item, index) => (
				<Group key={item.key} mt="xs">
					<Select
						{...form.getInputProps(`steps.${index}.type`)}
						data={[
							{ value: 'preset', label: 'Trigger Preset' },
							{ value: 'link', label: 'Open a Page' },
							{ value: 'folder', label: 'Open a Folder' },
							{ value: 'configuration', label: 'Set Configuration' },
							{ value: 'variable', label: 'Set a Variable' },
						]}
					/>
					{form.values.steps[index].type === 'preset' ? (
						<>
							<Select
								placeholder="Preset"
								{...form.getInputProps(`steps.${index}.value`)}
								searchable={true}
								data={presetsForSelect}
							/>
							<input type="hidden" {...form.getInputProps(`steps.${index}.valueTwo`)} />
						</>
					) : form.values.steps[index].type === 'link' ? (
						<>
							<Select
								placeholder="Page"
								{...form.getInputProps(`steps.${index}.value`)}
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
							<input type="hidden" {...form.getInputProps(`steps.${index}.valueTwo`)} />
						</>
					) : form.values.steps[index].type === 'configuration' ? (
						<>
							<Select
								placeholder="Configuration"
								{...form.getInputProps(`steps.${index}.value`)}
								data={[
									{
										value: 'CONTROLPANEL-LOCKED',
										label: 'Set to locked',
										group: 'Control panel lock',
									},
									{
										value: 'CONTROLPANEL-UNLOCKED',
										label: 'Set to unlocked',
										group: 'Control panel lock',
									},
								]}
							/>
							<input type="hidden" {...form.getInputProps(`steps.${index}.valueTwo`)} />
						</>
					) : form.values.steps[index].type === 'variable' ? (
						<>
							<Select
								placeholder="Variable"
								{...form.getInputProps(`steps.${index}.value`)}
								data={variablesForSelect}
							/>
							<TextInput {...form.getInputProps(`steps.${index}.valueTwo`)} placeholder="Value" />
						</>
					) : form.values.steps[index].type === 'folder' ? (
						<>
							<Select
								placeholder="Folder"
								{...form.getInputProps(`steps.${index}.value`)}
								data={foldersForSelect}
							/>
							<input type="hidden" {...form.getInputProps(`steps.${index}.valueTwo`)} />
						</>
					) : null}
					<ActionIcon color="red" variant="transparent" onClick={() => form.removeListItem('steps', index)}>
						<FaTrash />
					</ActionIcon>
				</Group>
			))}

			<Group position="center" mt="md">
				<Button
					rightIcon={<FaPlus />}
					onClick={() =>
						form.insertListItem('steps', {
							type: '',
							value: '',
							valueTwo: '',
							key: `key-${form.values.steps.length}`,
						})
					}
				>
					Add step
				</Button>
				<Button
					disabled={props.value === JSON.stringify(form.values.steps)}
					color="red"
					rightIcon={
						props.value === JSON.stringify(form.values.steps) ? <FaCheck /> : <FaExclamationTriangle />
					}
					onClick={() => props.onChange(JSON.stringify(form.values.steps))}
				>
					Apply
				</Button>
			</Group>
		</>
	)
}
