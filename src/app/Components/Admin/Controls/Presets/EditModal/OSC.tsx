import React from 'react'
import { GetInputProps } from '@mantine/form/lib/types'
import { ActionIcon, Button, Group, JsonInput, NumberInput, Select, Tabs } from '@mantine/core'
import { useForm, FormList, formList } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'

export const OSCPresetEditModal = (props: GetInputProps<'input'>) => {
	interface FormValues {
		steps: FormList<{
			part1: string
			value1?: string
			part2: string | null
			value2?: string
			key: string
		}>
	}
	const mixer = 'x32'
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
			properties: { startVal: 0, endVal: 1, step: 1 },
		},
		{
			value: '/mix/fader',
			label: 'Level',
			properties: { startVal: 0.0, endVal: 1.0, step: 0.01 },
		},
		{
			value: '/mix/pan',
			label: 'Pan',
			properties: { startVal: 0.0, endVal: 1.0, step: 0.01 },
		},
		{
			value: '/headamp/gain',
			label: 'Gain',
			properties: { startVal: 0.0, endVal: 1.0, step: 0.01 },
		},
		{
			value: '/headamp/phantom',
			label: '+48V',
			properties: { startVal: 0, endVal: 1, step: 1 },
		},
	]

	const preset = JSON.parse(props.value) || {}
	const form = useForm<FormValues>({
		initialValues: {
			steps: formList([]),
		},
	})
	return (
		<Tabs>
			<Tabs.Tab label="Edit">
				{form.values.steps.map((item, index) => {
					const part1Index = oscFirstOption[mixer].findIndex(x => x.value == form.values.steps[index].part1)
					const part2Index = oscSecondOption.findIndex(x => x.value == form.values.steps[index].part2)
					console.log(part2Index)
					return (
						<Group key={item.key} mt="xs">
							<Select
								placeholder="State"
								{...form.getListInputProps('steps', index, 'part1')}
								label="First Step"
								searchable
								nothingFound="No options"
								data={oscFirstOption[mixer]}
							/>
							{form.values.steps[index].part1 &&
							oscFirstOption[mixer][part1Index].properties.startVal > -1 ? (
								<NumberInput
									label="Step Value"
									{...form.getListInputProps('steps', index, 'value1')}
									min={oscFirstOption[mixer][part1Index].properties.startVal}
									max={oscFirstOption[mixer][part1Index].properties.endVal}
									step={oscFirstOption[mixer][part1Index].properties.step}
								/>
							) : null}
							{form.values.steps[index].part1 &&
							oscFirstOption[mixer][part1Index].properties.hasSecondOption ? (
								<Select
									placeholder="Options"
									{...form.getListInputProps('steps', index, 'part2')}
									label="Second Step"
									searchable
									nothingFound="No options"
									data={oscSecondOption}
								/>
							) : null}
							{form.values.steps[index].part1 &&
							form.values.steps[index].part2 &&
							oscSecondOption[part2Index].properties.startVal > -1 ? (
								<NumberInput
									label="Step 2 Value"
									{...form.getListInputProps('steps', index, 'value2')}
									min={oscSecondOption[part2Index].properties.startVal}
									max={oscSecondOption[part2Index].properties.endVal}
									step={oscSecondOption[part2Index].properties.step}
								/>
							) : null}
							<ActionIcon color="red" variant="hover" onClick={() => form.removeListItem('steps', index)}>
								<FaTrash />
							</ActionIcon>
						</Group>
					)
				})}
				<Group position="center" mt="md">
					<Button
						onClick={() =>
							form.addListItem('steps', { part1: '', value1: '', part2: '', value2: '', key: randomId() })
						}
					>
						Add OSC Call
					</Button>
					<Button onClick={() => props.onChange(JSON.stringify(form.values.steps))}>Save</Button>
				</Group>
			</Tabs.Tab>
			<Tabs.Tab label="JSON Mode">
				<JsonInput formatOnBlur={true} autosize maxRows={20} value={props.value} onChange={props.onChange} />
			</Tabs.Tab>
		</Tabs>
	)
}
