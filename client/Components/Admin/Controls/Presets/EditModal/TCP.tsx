import { NumberInput, TextInput } from '@mantine/core'
import React from 'react'
import { InputProps } from '../../../../InputProps'

export const TCPPresetEditModal = (props: InputProps) => {
	const preset = JSON.parse(props.value) || {}
	const onChangeFunction = (key: string, value: string) => {
		const newValue = { ...preset }
		newValue[key] = value
		props.onChange(JSON.stringify(newValue))
	}
	console.log(preset)
	return (
		<>
			<NumberInput
				label="Port"
				value={Number(preset.port)}
				min={0}
				onChange={(value: number) => onChangeFunction('port', value.toString())}
			/>
			<TextInput
				label="Hex String"
				value={preset.message}
				onChange={event => onChangeFunction('message', event.currentTarget.value)}
			/>
			<NumberInput
				label="Timeout"
				description="Timeout in Seconds"
				value={Number(preset.timeout)}
				placeholder="60"
				min={1}
				max={60}
				onChange={(value: number) => onChangeFunction('timeout', value.toString())}
			/>
		</>
	)
}
