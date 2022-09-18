import React, { useState } from 'react'
import { JsonInput, NumberInput, Slider, Table, Tabs } from '@mantine/core'
import { isValidJson } from './isValidJson'
import { InputProps } from '../../../../InputProps'

const Input = (props: { channel: number; value: number; onChange(channel: number, value: number): void }) => {
	return (
		<>
			<td style={{ whiteSpace: 'nowrap' }}>{props.channel}</td>
			<td>
				<NumberInput
					value={props.value}
					min={0}
					max={255}
					step={1}
					onChange={value => props.onChange(props.channel, value)}
				></NumberInput>
			</td>
		</>
	)
}
export const E131PresetEditModal = (props: InputProps) => {
	const numberOfParameters = 8 //Number of parameters to show at once in the preset editor
	const numberOfParametersPerRow = 4 //Number of parameters to show per row in the preset editor (this should be a multiple of the number of parameters)
	let valueObject = JSON.parse('{}')
	let disableForm = false
	if (isValidJson(props.value)) {
		valueObject = JSON.parse(props.value)
	} else if (props.value !== null) {
		disableForm = true
	}

	const [pagination, setPagination] = useState(1)
	const onChangeFunction = (channel: number, value: number) => {
		const newValue = { ...valueObject }
		newValue[channel] = value
		props.onChange(JSON.stringify(newValue))
	}

	return (
		<Tabs defaultValue={disableForm ? 'JSON' : 'Channels'}>
			<Tabs.List>
				<Tabs.Tab value="Channels" disabled={disableForm}>
					Channels
				</Tabs.Tab>
				<Tabs.Tab value="JSON">JSON Editor</Tabs.Tab>
			</Tabs.List>
			<Tabs.Panel value="Channels" pt="xs">
				<Slider
					defaultValue={pagination}
					onChange={setPagination}
					label={(value: number) => `${value}-${value + (numberOfParameters - 1)}`}
					min={1}
					max={512 - numberOfParameters}
					px={'lg'}
					step={numberOfParameters}
					size={'xl'}
					showLabelOnHover={true}
				/>
				<Table>
					<thead>
						<tr>
							<th>#</th>
							<th>Value</th>
							<th>#</th>
							<th>Value</th>
							<th>#</th>
							<th>Value</th>
							<th>#</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
						{[...Array(numberOfParameters / numberOfParametersPerRow)].map((_x, row) => (
							<tr key={row}>
								{[...Array(numberOfParametersPerRow)].map((_z, col) => (
									<Input
										key={col}
										channel={pagination + col + row * numberOfParametersPerRow}
										value={valueObject[pagination + col + row * numberOfParametersPerRow]}
										onChange={onChangeFunction}
									/>
								))}
							</tr>
						))}
					</tbody>
				</Table>
			</Tabs.Panel>
			<Tabs.Panel value="JSON" pt="xs">
				<JsonInput formatOnBlur={true} autosize maxRows={20} value={props.value} onChange={props.onChange} />
			</Tabs.Panel>
		</Tabs>
	)
}
