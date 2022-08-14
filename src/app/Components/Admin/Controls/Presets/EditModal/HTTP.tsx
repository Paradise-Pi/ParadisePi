import React from 'react'
import { JsonInput, Select, TextInput } from '@mantine/core'
import { InputProps } from '../../../../InputProps'

export const HTTPPresetEditModal = (props: InputProps) => {
	const preset = JSON.parse(props.value) || {}
	const onChangeFunction = (key: string, value: string) => {
		const newValue = { ...preset }
		newValue[key] = value
		props.onChange(JSON.stringify(newValue))
	}
	return (
		<>
			<TextInput
				label="URL"
				value={preset.url}
				onChange={event => onChangeFunction('url', event.currentTarget.value)}
			/>
			<Select
				label="Method"
				value={preset.method}
				onChange={value => onChangeFunction('method', value)}
				data={[
					{ value: 'get', label: 'GET', selected: true },
					{ value: 'post', label: 'POST' },
					{ value: 'put', label: 'PUT' },
					{ value: 'delete', label: 'DELETE' },
				]}
			/>
			<JsonInput
				label="Data"
				validationError="Invalid json"
				formatOnBlur
				autosize
				value={preset.data}
				onChange={value => onChangeFunction('data', value)}
				minRows={4}
			/>
			<JsonInput
				label="Headers"
				validationError="Invalid json"
				formatOnBlur
				autosize
				value={preset.headers}
				onChange={value => onChangeFunction('headers', value)}
			/>
		</>
	)
}
