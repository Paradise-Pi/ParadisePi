import React from 'react'
import { GetInputProps } from '@mantine/form/lib/types'
import { ActionIcon, Button, Group, JsonInput, NumberInput, Select, Tabs } from '@mantine/core'
import { useForm, FormList, formList } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'
import { useAppSelector } from '../../../../../../app/apis/redux/mainStore'
import { isValidJson } from './isValidJson'

/**
 * List of commands formatted for \@mantine/form
 */
export interface OSCFormValues {
	commands: FormList<OSCFormValue>
}

/**
 * A single osc command, stored as individual fields to allow editing.
 * The command is combined and formatted when sent using OSC.sendPreset()
 */
export interface OSCFormValue {
	command1: string
	value1: string
	command2: string
	value2: string
	key: string
}

/**
 * Wrapper for an OSC command initial option - eg '/ch/'
 *
 * First options take a number of formats, most commonly a type followed by a parameter number.
 *
 * Some have second options (eg pan, level, on/off), but not all. If it doesn't have a second option,
 * the value of this option is often a recall parameter (eg for scenes)m however this is not always the
 * case so be careful!
 */
interface oscCommand {
	value: string
	label: string
	properties: {
		startVal: number
		endVal: number
		step: number
		secondOption: string //the array from oscSecondOptionList containing the relevant options for this command
	}
}
interface oscCommands {
	[console: string]: oscCommand[]
}

interface oscSecondOption {
	value: string
	label: string
	properties: {
		startVal: number
		endVal: number
		step: number
		precision: number
	}
}

interface oscSecondOptions {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: oscSecondOption[]
}

export const OSCPresetEditModal = (props: GetInputProps<'input'>) => {
	const mixer = useAppSelector(state => (state.database ? state.database.config.osc.OSCMixerType : false))

	const oscFirstOption: oscCommands = {
		// "mixer":[{value:"address",label:"name", properties:{startVal, endVal, Step, secondOption, valIsEncode}}]
		xair: [
			{
				value: '/ch/',
				label: 'Channel',
				properties: { startVal: 1, endVal: 16, step: 1, secondOption: 'channel' },
			},
			{
				value: '/config/mute/',
				label: 'Mute Group',
				properties: { startVal: 1, endVal: 6, step: 1, secondOption: 'basic' },
			},
			{
				value: '/lr',
				label: 'Master',
				properties: { startVal: -1, endVal: -1, step: -1, secondOption: 'basic' },
			},
			{
				value: '/-snap',
				label: 'Load Snapshot',
				properties: { startVal: 1, endVal: 64, step: 1, secondOption: 'snap' },
			},
		],
		x32: [
			{
				value: '/ch/',
				label: 'Channel',
				properties: { startVal: 1, endVal: 16, step: 1, secondOption: 'channel' },
			},
			{
				value: '/config/mute/',
				label: 'Mute Group',
				properties: { startVal: 1, endVal: 6, step: 1, secondOption: 'basic' },
			},
			{
				value: '/main/st',
				label: 'Master',
				properties: { startVal: -1, endVal: -1, step: -1, secondOption: 'basic' },
			},
			{
				value: '/-action',
				label: 'Console Actions',
				properties: { startVal: -1, endVal: -1, step: -1, secondOption: 'action' },
			},
		],
		'': [],
	}

	/**
	 * The second part of the OSC command.
	 * This is made up of lists of options, that should be selected in the above oscFirstOption.
	 */
	const oscSecondOptionList: oscSecondOptions = {
		basic: [
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
		],
		channel: [
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
		],
		snap: [
			{
				value: '/load',
				label: 'Load Snapshot',
				properties: { startVal: 1, endVal: 64, step: 1, precision: 0 },
			},
		],
		action: [
			{
				value: '/gocue',
				label: 'Load Cue',
				properties: { startVal: 0, endVal: 99, step: 1, precision: 0 },
			},
			{
				value: '/goscene',
				label: 'Load Scene',
				properties: { startVal: 0, endVal: 99, step: 1, precision: 0 },
			},
			{
				value: '/gosnippet',
				label: 'Load Snippet',
				properties: { startVal: 0, endVal: 99, step: 1, precision: 0 },
			},
		],
	}
	let preset = JSON.parse('[]')
	let disableForm = false
	if (isValidJson(props.value)) {
		preset = JSON.parse(props.value)
	} else if (props.value !== null) {
		disableForm = true
	}

	const form = useForm<OSCFormValues>({
		initialValues: {
			commands: formList(preset),
		},
	})
	return (
		<Tabs>
			<Tabs.Tab label="Edit" disabled={disableForm}>
				{form.values.commands.map((item, index) => {
					if (mixer !== false) {
						const part1Index = oscFirstOption[mixer.replace('midas-', '')].findIndex(
							x => x.value == form.values.commands[index].command1
						)

						const part2Array =
							part1Index != -1
								? oscFirstOption[mixer.replace('midas-', '')][part1Index].properties.secondOption
								: null

						const part2Index =
							part1Index != -1
								? oscSecondOptionList[part2Array].findIndex(
										x => x.value == form.values.commands[index].command2
								  )
								: null

						return (
							<Group key={item.key} mt="xs">
								<Select
									placeholder="State"
									{...form.getListInputProps('commands', index, 'command1')}
									label="Part 1"
									searchable
									nothingFound="No options"
									data={oscFirstOption[mixer.replace('midas-', '')]}
								/>
								{form.values.commands[index].command1 &&
								oscFirstOption[mixer.replace('midas-', '')][part1Index].properties.startVal > -1 ? (
									<NumberInput
										label="Part 1 Value"
										placeholder="Command Value"
										{...form.getListInputProps('commands', index, 'value1')}
										min={
											oscFirstOption[mixer.replace('midas-', '')][part1Index].properties.startVal
										}
										max={oscFirstOption[mixer.replace('midas-', '')][part1Index].properties.endVal}
										step={oscFirstOption[mixer.replace('midas-', '')][part1Index].properties.step}
										precision={0}
									/>
								) : null}
								{form.values.commands[index].command1 && part2Array ? (
									<Select
										placeholder="Options"
										{...form.getListInputProps('commands', index, 'command2')}
										label="Part 2"
										searchable
										nothingFound="No options"
										data={oscSecondOptionList[part2Array]}
									/>
								) : null}
								{form.values.commands[index].command1 &&
								form.values.commands[index].command2 &&
								oscSecondOptionList[part2Array][part2Index].properties.startVal > -1 ? (
									<NumberInput
										placeholder="Option Value"
										label="Part 2 Value"
										{...form.getListInputProps('commands', index, 'value2')}
										min={oscSecondOptionList[part2Array][part2Index].properties.startVal}
										max={oscSecondOptionList[part2Array][part2Index].properties.endVal}
										step={oscSecondOptionList[part2Array][part2Index].properties.step}
										precision={oscSecondOptionList[part2Array][part2Index].properties.precision}
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
					}
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
					<Button onClick={() => props.onChange(JSON.stringify(form.values.commands))}>Apply</Button>
				</Group>
			</Tabs.Tab>
			<Tabs.Tab label="JSON Mode">
				<JsonInput formatOnBlur={true} autosize maxRows={20} value={props.value} onChange={props.onChange} />
			</Tabs.Tab>
		</Tabs>
	)
}
