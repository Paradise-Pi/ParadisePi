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
	return (
		<>
			<TextInput
				label="Hex String"
				value={preset.message}
				onChange={event => onChangeFunction('message', event.currentTarget.value)}
			/>
			<NumberInput
				label="Timeout"
				description="Timeout in Seconds"
				value={isNaN(preset.timeout) ? 60 : Number(preset.timeout)}
				placeholder="60"
				min={1}
				max={60}
				onChange={(value: number) => onChangeFunction('timeout', value.toString())}
			/>
		</>
	)
}
