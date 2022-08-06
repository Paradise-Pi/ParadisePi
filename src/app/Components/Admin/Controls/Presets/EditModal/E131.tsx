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
					min={1}
					max={505}
					px={'lg'}
					step={8}
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
						<tr>
							<Input channel={pagination} value={valueObject[pagination]} onChange={onChangeFunction} />
							<Input
								channel={pagination + 1}
								value={valueObject[pagination + 1]}
								onChange={onChangeFunction}
							/>
							<Input
								channel={pagination + 2}
								value={valueObject[pagination + 2]}
								onChange={onChangeFunction}
							/>
							<Input
								channel={pagination + 3}
								value={valueObject[pagination + 3]}
								onChange={onChangeFunction}
							/>
						</tr>
						<tr>
							<Input
								channel={pagination + 4}
								value={valueObject[pagination + 4]}
								onChange={onChangeFunction}
							/>
							<Input
								channel={pagination + 5}
								value={valueObject[pagination + 5]}
								onChange={onChangeFunction}
							/>
							<Input
								channel={pagination + 6}
								value={valueObject[pagination + 6]}
								onChange={onChangeFunction}
							/>
							<Input
								channel={pagination + 7}
								value={valueObject[pagination + 7]}
								onChange={onChangeFunction}
							/>
						</tr>
					</tbody>
				</Table>
			</Tabs.Panel>
			<Tabs.Panel value="JSON" pt="xs">
				<JsonInput formatOnBlur={true} autosize maxRows={20} value={props.value} onChange={props.onChange} />
			</Tabs.Panel>
		</Tabs>
	)
}
