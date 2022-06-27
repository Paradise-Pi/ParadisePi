import React from 'react'
import { GetInputProps } from '@mantine/form/lib/types'
import { ActionIcon, Button, Group, JsonInput, NumberInput, Select, Tabs } from '@mantine/core'
import { useForm, FormList, formList } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'

export const OSCPresetEditModal = (props: GetInputProps<'input'>) => {
	interface FormValues {
		commands: FormList<{
			command1: string
			value1: string
			command2: string
			value2: string
			key: string
		}>
	}
	const mixer = 'x32'
	//TODO: make this part of osc classes @cherry-john
	const oscFirstOption = {
		// "mixer":[{value:"address",label:"name", properties:{startVal, endVal, Step, hasSecondOption, valIsEncode}}]
		xair: [
			{
				value: '/ch/',
				label: 'Channel',
				properties: { startVal: 1, endVal: 16, step: 1, hasSecondOption: true, valIsEncode: false },
			},
			{
				value: '/config/mute/',
				label: 'Mute Group',
				properties: { startVal: 1, endVal: 6, step: 1, hasSecondOption: false, valIsEncode: false },
			},
			{
				value: '/lr',
				label: 'Master',
				properties: { startVal: -1, endVal: -1, step: -1, hasSecondOption: true, valIsEncode: false },
			},
			{
				value: '/-snap/load',
				label: 'Load Snapshot',
				properties: { startVal: 1, endVal: 64, step: 1, hasSecondOption: false, valIsEncode: true },
			},
		],
		x32: [
			{
				value: '/ch/',
				label: 'Channel',
				properties: { startVal: 1, endVal: 16, step: 1, hasSecondOption: true, valIsEncode: false },
			},
			{
				value: '/config/mute/',
				label: 'Mute Group',
				properties: { startVal: 1, endVal: 6, step: 1, hasSecondOption: false, valIsEncode: false },
			},
			{
				value: '/main/st',
				label: 'Master',
				properties: { startVal: -1, endVal: -1, step: -1, hasSecondOption: true, valIsEncode: false },
			},
			{
				value: '/‐action/gocue',
				label: 'Load Cue',
				properties: { startVal: 0, endVal: 99, step: 1, hasSecondOption: false, valIsEncode: true },
			},
			{
				value: '/‐action/goscene',
				label: 'Load Scene',
				properties: { startVal: 0, endVal: 99, step: 1, hasSecondOption: false, valIsEncode: true },
			},
			{
				value: '/‐action/gosnippet',
				label: 'Load Snippet',
				properties: { startVal: 0, endVal: 99, step: 1, hasSecondOption: false, valIsEncode: true },
			},
		],
	}
	const oscSecondOption = [
		{
			value: '/mix/on',
			label: 'Mute',
			properties: { startVal: 0, endVal: 1, step: 1, precision: 0 },
		},
		{
			value: '/mix/fader',
			label: 'Level',
			properties: { startVal: 0.0, endVal: 1.0, step: 0.01, precision: 2 },
		},
		{
			value: '/mix/pan',
			label: 'Pan',
			properties: { startVal: 0.0, endVal: 1.0, step: 0.01, precision: 2 },
		},
		{
			value: '/headamp/gain',
			label: 'Gain',
			properties: { startVal: 0.0, endVal: 1.0, step: 0.01, precision: 2 },
		},
		{
			value: '/headamp/phantom',
			label: '+48V',
			properties: { startVal: 0, endVal: 1, step: 1, precision: 0 },
		},
	]

	const preset = JSON.parse(props.value) || {}
	console.log(preset)
	const form = useForm<FormValues>({
		initialValues: {
			commands: formList(preset),
		},
	})
	return (
		<Tabs>
			<Tabs.Tab label="Edit">
				{form.values.commands.map((item, index) => {
					const part1Index = oscFirstOption[mixer].findIndex(
						x => x.value == form.values.commands[index].command1
					)
					const part2Index = oscSecondOption.findIndex(x => x.value == form.values.commands[index].command2)
					return (
						<Group key={item.key} mt="xs">
							<Select
								placeholder="State"
								{...form.getListInputProps('commands', index, 'command1')}
								label="Part 1"
								searchable
								nothingFound="No options"
								data={oscFirstOption[mixer]}
							/>
							{form.values.commands[index].command1 &&
							oscFirstOption[mixer][part1Index].properties.startVal > -1 ? (
								<NumberInput
									label="Part 1 Value"
									placeholder="Command Value"
									{...form.getListInputProps('commands', index, 'value1')}
									min={oscFirstOption[mixer][part1Index].properties.startVal}
									max={oscFirstOption[mixer][part1Index].properties.endVal}
									step={oscFirstOption[mixer][part1Index].properties.step}
									precision={0}
								/>
							) : null}
							{form.values.commands[index].command1 &&
							oscFirstOption[mixer][part1Index].properties.hasSecondOption ? (
								<Select
									placeholder="Options"
									{...form.getListInputProps('commands', index, 'command2')}
									label="Part 2"
									searchable
									nothingFound="No options"
									data={oscSecondOption}
								/>
							) : null}
							{form.values.commands[index].command1 &&
							form.values.commands[index].command2 &&
							oscSecondOption[part2Index].properties.startVal > -1 ? (
								<NumberInput
									placeholder="Option Value"
									label="Part 2 Value"
									{...form.getListInputProps('commands', index, 'value2')}
									min={oscSecondOption[part2Index].properties.startVal}
									max={oscSecondOption[part2Index].properties.endVal}
									step={oscSecondOption[part2Index].properties.step}
									precision={oscSecondOption[part2Index].properties.precision}
								/>
							) : null}
							<ActionIcon
								color="red"
								variant="hover"
								onClick={() => form.removeListItem('commands', index)}
							>
								<FaTrash />
							</ActionIcon>
						</Group>
					)
				})}
				<Group position="center" mt="md">
					<Button
						onClick={() =>
							form.addListItem('commands', {
								command1: '',
								value1: '',
								command2: '',
								value2: '',
								key: randomId(),
							})
						}
					>
						Add OSC Call
					</Button>
					<Button onClick={() => props.onChange(JSON.stringify(form.values.commands))}>Save</Button>
				</Group>
			</Tabs.Tab>
			<Tabs.Tab label="JSON Mode">
				<JsonInput formatOnBlur={true} autosize maxRows={20} value={props.value} onChange={props.onChange} />
			</Tabs.Tab>
		</Tabs>
	)
}
