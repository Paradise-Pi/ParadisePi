import { ActionIcon, Button, Divider, Group, Select, SelectItem, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { FaCheck } from '@react-icons/all-files/fa/FaCheck'
import { FaExclamationTriangle } from '@react-icons/all-files/fa/FaExclamationTriangle'
import { FaPlus } from '@react-icons/all-files/fa/FaPlus'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'
import React, { useEffect } from 'react'
import { DatabaseVariable } from '../../../../shared/sharedTypes'
import { useAppSelector } from '../../../apis/redux/mainStore'
import { InputProps } from '../../InputProps'
interface FormValues {
	rules: Array<{
		logic: string
		variable: number
		value: string
		key: string
	}>
	showHide: string
}

// Return true to show, false to hide
export const displayBasedOnVariablesParser = (rules: string, variables: Array<DatabaseVariable>): boolean => {
	if (typeof rules !== 'undefined' && rules !== null && rules !== '') {
		// Parse the rules string to an object
		const rulesObject: {
			rules: Array<{
				logic: string
				variable: number
				value: string
				key: string
			}>
			showHide: string
		} = JSON.parse(rules) || {}
		if (rulesObject.showHide === '' || rulesObject.showHide == 'show')
			return true // If set as force show, always show
		else if (rulesObject.showHide == 'hide') return false // If set as force hide, always hide

		// Convert variables array to a key-value object
		const variablesMap = variables.reduce(
			(acc, variable) => {
				if (variable.id !== undefined) {
					acc[variable.id.toString()] = variable.value
				}
				return acc
			},
			{} as Record<string, string>
		)

		let countPass = 0
		let countFail = 0
		if (rulesObject.rules && rulesObject.rules.length > 0 && variables.length > 0) {
			rulesObject.rules.forEach(rule => {
				if (!variablesMap.hasOwnProperty(rule.variable)) return
				else if (rule.logic === 'equal') {
					if (variablesMap[rule.variable] === rule.value) countPass++
					else countFail++
				} else if (rule.logic === 'notequal') {
					if (variablesMap[rule.variable] !== rule.value) countPass++
					else countFail++
				} else if (rule.logic === 'isnull') {
					if (variablesMap[rule.variable] === null || variablesMap[rule.variable] == '') countPass++
					else countFail++
				} else if (rule.logic === 'isnotnull') {
					if (variablesMap[rule.variable] !== null || variablesMap[rule.variable] != '') countPass++
					else countFail++
				}
			})
		}

		if (rulesObject.showHide === 'hideOR') {
			if (countPass > 0) return true
			else return false
		} else if (rulesObject.showHide === 'showOR') {
			if (countPass > 0) return false
			else return true
		} else if (rulesObject.showHide === 'hideAND') {
			if (countFail > 0) return false
			else return true
		} else if (rulesObject.showHide === 'showAND') {
			if (countFail > 0) return true
			else return false
		} else return true
	} else {
		return true
	}
}

export const DisplayBasedOnVariablesEditor = (props: InputProps) => {
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
			showHide: 'show',
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
				showHide: valueObject.showHide,
				rules: valueObject.rules.map(
					(item: { logic: string; variable: number; value: string; key: string }, index: number) => ({
						logic: item.logic,
						variable: item.variable,
						value: item.value,
						key: `rule-${index}`,
					})
				),
			})
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.value])
	const showHide = displayBasedOnVariablesParser(JSON.stringify(form.values), variables)
	return (
		<>
			<Divider
				my="md"
				label={`Show/hide configuration - currently ${showHide ? 'shown' : 'hidden'}`}
				labelPosition="center"
			/>
			<Select
				{...form.getInputProps(`showHide`)}
				data={[
					{ value: 'show', label: 'Always show' },
					{ value: 'hide', label: 'Always hide' },
					{ value: 'hideOR', label: 'Show when any of the following rules match, otherwise hide' },
					{ value: 'showOR', label: 'Hide when any of the following rules match, otherwise show' },
					{ value: 'hideAND', label: 'Show when all of the following rules match, otherwise hide' },
					{ value: 'showAND', label: 'Hide when all of the following rules match, otherwise show' },
				]}
			/>
			{!['show', 'hide'].includes(form.values.showHide)
				? form.values.rules.map((item, index) => (
						<Group key={item.key} mt="xs">
							<Select
								placeholder="Variable"
								{...form.getInputProps(`rules.${index}.variable`)}
								data={variablesForSelect}
							/>
							<Select
								{...form.getInputProps(`rules.${index}.logic`)}
								data={[
									{ value: 'equal', label: 'equal to' },
									{ value: 'notequal', label: 'not equal to' },
									{ value: 'isnull', label: 'is blank' },
									{ value: 'isnotnull', label: 'is not blank' },
								]}
							/>
							{['equal', 'notequal'].includes(form.values.rules[index].logic) ? (
								<TextInput {...form.getInputProps(`rules.${index}.value`)} placeholder="Value" />
							) : null}
							<ActionIcon
								color="red"
								variant="transparent"
								onClick={() => form.removeListItem('rules', index)}
							>
								<FaTrash />
							</ActionIcon>
						</Group>
					))
				: null}
			<Group position="center" mt="md">
				{!['show', 'hide'].includes(form.values.showHide) ? (
					<Button
						onClick={() =>
							form.insertListItem('rules', {
								logic: '',
								variable: '',
								value: '',
								key: `rule-${form.values.rules.length}`,
							})
						}
						rightIcon={<FaPlus />}
					>
						Add rule
					</Button>
				) : null}
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
