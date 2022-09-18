import React, { useState } from 'react'
import { Button, Col, Grid, JsonInput, NumberInput, Slider, Table, Tabs } from '@mantine/core'
import { isValidJson } from './isValidJson'
import { InputProps } from '../../../../InputProps'
import { FaPlus } from '@react-icons/all-files/fa/FaPlus'
import { FaMinus } from '@react-icons/all-files/fa/FaMinus'
import { showNotification } from '@mantine/notifications'

const Input = (props: { channel: number; value: number; onChange(channel: number, value: number): void }) => (
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

const ShortcutButton = (props: { text: string; buttonClick(): void }) => (
	<Grid.Col span="content">
		<Button m={'sm'} onClick={() => props.buttonClick()}>
			{props.text}
		</Button>
	</Grid.Col>
)

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
				<Tabs.Tab value="Shortcuts" disabled={disableForm}>
					Shortcuts
				</Tabs.Tab>
				<Tabs.Tab value="JSON">JSON Editor</Tabs.Tab>
			</Tabs.List>
			<Tabs.Panel value="Channels" pt="xs">
				<Grid align={'center'} gutter={0}>
					<Col span="content">
						<Button
							compact
							onClick={() =>
								setPagination(value => (value > numberOfParameters ? value - numberOfParameters : 1))
							}
						>
							<FaMinus />
						</Button>
					</Col>
					<Col span={'auto'}>
						<Slider
							value={pagination}
							onChange={setPagination}
							label={(value: number) => `${value}-${value + (numberOfParameters - 1)}`}
							min={1}
							max={513 - numberOfParameters}
							px={'lg'}
							step={numberOfParameters}
							size={'xl'}
							showLabelOnHover={true}
						/>
					</Col>
					<Col span="content">
						<Button
							compact
							onClick={() =>
								setPagination(value =>
									value < 513 - numberOfParameters
										? value + numberOfParameters
										: 513 - numberOfParameters
								)
							}
						>
							<FaPlus />
						</Button>
					</Col>
				</Grid>
				<Table>
					<thead>
						<tr>
							{[...Array(numberOfParametersPerRow)].map((_x, i) => (
								<React.Fragment key={i}>
									<th>#</th>
									<th>Value</th>
								</React.Fragment>
							))}
						</tr>
					</thead>
					<tbody>
						{[...Array(numberOfParameters / numberOfParametersPerRow)].map((_y, row) => (
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
			<Tabs.Panel value="Shortcuts" pt="lg">
				<Grid gutter={0}>
					<ShortcutButton
						text="Initialise universe: set all to 0"
						buttonClick={() => {
							const newValue = { ...valueObject }
							for (let i = 1; i <= 512; i++) {
								newValue[i] = 0
							}
							props.onChange(JSON.stringify(newValue))
							showNotification({
								autoClose: 10000,
								message: 'Successfully initialised universe',
								color: 'green',
							})
						}}
					/>
					<ShortcutButton
						text="Initialise universe: set all to 255"
						buttonClick={() => {
							const newValue = { ...valueObject }
							for (let i = 1; i <= 512; i++) {
								newValue[i] = 255
							}
							props.onChange(JSON.stringify(newValue))
							showNotification({
								autoClose: 10000,
								message: 'Successfully initialised universe',
								color: 'green',
							})
						}}
					/>
					<ShortcutButton
						text="Set all blank channels to 0"
						buttonClick={() => {
							const newValue = { ...valueObject }
							for (let i = 1; i <= 512; i++) {
								if (newValue[i] === undefined) {
									newValue[i] = 0
								}
							}
							props.onChange(JSON.stringify(newValue))
							showNotification({
								autoClose: 10000,
								message: 'Successfully set blanks to 0',
								color: 'green',
							})
						}}
					/>
					<ShortcutButton
						text="Set all blank channels to 255"
						buttonClick={() => {
							const newValue = { ...valueObject }
							for (let i = 1; i <= 512; i++) {
								if (newValue[i] === undefined) {
									newValue[i] = 255
								}
							}
							props.onChange(JSON.stringify(newValue))
							showNotification({
								autoClose: 10000,
								message: 'Successfully set blanks to 255',
								color: 'green',
							})
						}}
					/>
					<ShortcutButton
						text="Blank all channels that are 0"
						buttonClick={() => {
							const newValue = { ...valueObject }
							for (let i = 1; i <= 512; i++) {
								if (newValue[i] === 0) {
									delete newValue[i]
								}
							}
							props.onChange(JSON.stringify(newValue))
							showNotification({
								autoClose: 10000,
								message: 'Blanked all channels that are 0',
								color: 'green',
							})
						}}
					/>
					<ShortcutButton
						text="Blank all channels that are 255"
						buttonClick={() => {
							const newValue = { ...valueObject }
							for (let i = 1; i <= 512; i++) {
								if (newValue[i] === 255) {
									delete newValue[i]
								}
							}
							props.onChange(JSON.stringify(newValue))
							showNotification({
								autoClose: 10000,
								message: 'Blanked all channels that are 255',
								color: 'green',
							})
						}}
					/>
				</Grid>
			</Tabs.Panel>
			<Tabs.Panel value="JSON" pt="xs">
				<JsonInput formatOnBlur={true} autosize maxRows={20} value={props.value} onChange={props.onChange} />
			</Tabs.Panel>
		</Tabs>
	)
}
