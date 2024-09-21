import { ActionIcon, Button, Group, Select, SelectItem, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { FaCheck } from '@react-icons/all-files/fa/FaCheck'
import { FaExclamationTriangle } from '@react-icons/all-files/fa/FaExclamationTriangle'
import { FaPlus } from '@react-icons/all-files/fa/FaPlus'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'
import React, { useEffect } from 'react'
import { useAppSelector } from '../../../apis/redux/mainStore'
import { InputProps } from '../../InputProps'
interface FormValues {
	rules: Array<{
		logic: string
		match: string
		variable: number
		value: string
		key: string
	}>
}

export const VariablesLogicEditor = (props: InputProps) => {
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
	const form = useForm<FormValues>({
		validateInputOnChange: true,
		validateInputOnBlur: true,
		initialValues: {
			rules: [],
		},
		validate: {
			rules: {
				logic: value => (value === '' ? 'Select an option' : null),
				variable: value => (value === null ? 'Variable is required' : null),
			},
		},
	})

	useEffect(() => {
		if (
			typeof props.value !== 'undefined' &&
			props.value !== null &&
			props.value !== '' &&
			props.value !== JSON.stringify(form.values)
		) {
			const valueObject = JSON.parse(props.value) || {}
			form.setValues({
				rules: valueObject.rules.map(
					(
						item: { logic: string; variable: number; match: string; value: string; key: string },
						index: number
					) => ({
						logic: item.logic,
						match: item.match,
						variable: item.variable,
						value: item.value,
						key: `rule-${index}`,
					})
				),
			})
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.value])
	return (
		<>
			{form.values.rules.map((item, index) => (
				<Group key={item.key} mt="xs">
					<Select
						{...form.getInputProps(`rules.${index}.logic`)}
						data={[
							{ value: 'equal', label: 'If response is equal to' },
							{ value: 'notequal', label: 'If response is not equal to' },
							{ value: 'isnull', label: 'If response is blank' },
							{ value: 'isnotnull', label: 'If response is not blank' },
						]}
					/>
					{['isnull', 'isnotnull'].includes(form.values.rules[index].logic) ? null : (
						<TextInput {...form.getInputProps(`rules.${index}.match`)} placeholder="to" />
					)}
					<Select
						placeholder="Then set variable"
						{...form.getInputProps(`rules.${index}.variable`)}
						data={variablesForSelect}
					/>
					<TextInput {...form.getInputProps(`rules.${index}.value`)} placeholder="to" />

					<ActionIcon color="red" variant="transparent" onClick={() => form.removeListItem('rules', index)}>
						<FaTrash />
					</ActionIcon>
				</Group>
			))}
			<Group position="center" mt="md">
				<Button
					onClick={() =>
						form.insertListItem('rules', {
							logic: 'equal',
							match: '',
							variable: '',
							value: '',
							key: `rule-${form.values.rules.length}`,
						})
					}
					rightIcon={<FaPlus />}
				>
					Add variable
				</Button>
				<Button
					disabled={props.value === JSON.stringify(form.values)}
					color="red"
					rightIcon={props.value === JSON.stringify(form.values) ? <FaCheck /> : <FaExclamationTriangle />}
					onClick={() => props.onChange(JSON.stringify(form.values))}
				>
					Apply
				</Button>
			</Group>
		</>
	)
}
