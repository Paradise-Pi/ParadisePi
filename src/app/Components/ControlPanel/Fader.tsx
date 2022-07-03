import React from 'react'
import { MantineTheme, Slider } from '@mantine/core'

/**
 * Notches on the fader used for the metering, available in decibels
 */
// const decibelMarks = [
// 	{ value: 100, label: '10db' },
// 	{ value: 87.5, label: '5db' },
// 	{ value: 75, label: '0db' },
// 	{ value: 62.5, label: '-5db' },
// 	{ value: 50, label: '-10db' },
// 	{ value: 37.5, label: '-20db' },
// 	{ value: 25, label: '-30db' },
// 	{ value: 12.5, label: '-50db' },
// 	{ value: 6.25, label: '-60db' },
// ]
/**
 * Notches on the fader used for metering, available as percentages
 */
const percentageMarks = [
	{ value: 0, label: 'Off' },
	{ value: 19, label: '25%' },
	{ value: 38, label: '50%' },
	{ value: 57, label: '75%' },
	{ value: 75, label: '100%' },
	//{ value: 94, label: '125%' },
]
/**
 * Takes a percentage and returns a meter value gradient
 * @param theme - Mantine theme object
 * @param value - Percentage value
 * @returns A linear gradient for meter
 */
const metering = (theme: MantineTheme, value: number) => {
	const colours = {
		green: theme.colors.green[4],
		yellow: theme.colors.yellow[4],
		red: theme.colors.red[4],
		defaultColour: theme.colors.dark[4],
	}
	const thresholds = {
		green: 75,
		yellow: 87.5,
	}
	let coloursArray: string[]
	if (value < 1) coloursArray = [colours.defaultColour + ' 0%', colours.defaultColour + ' 100%']
	else coloursArray = [colours.green + ' 0%']

	if (value <= thresholds.green) coloursArray.push(colours.green + ' ' + value + '%')
	else coloursArray.push(colours.green + ' ' + thresholds.green + '%', colours.yellow + ' ' + thresholds.green + '%')

	if (value <= thresholds.yellow) coloursArray.push(colours.yellow + ' ' + value + '%')
	else
		coloursArray.push(
			colours.yellow + ' ' + thresholds.yellow + '%',
			colours.red + ' ' + thresholds.yellow + '%',
			colours.red + ' ' + value + '%'
		)

	if (value > 0 && value < 100)
		coloursArray.push(colours.defaultColour + ' ' + value + '%', colours.defaultColour + ' 100%')
	return `linear-gradient(to right, ${coloursArray.join(', ')})`
}
/**
 * Fader component
 * @param props - Props supplied
 * @returns Fader component
 */
export const Fader = (props: {
	disabled: boolean
	meterValue: number
	value: number | false
	onChange: (value: number) => void
}) => {
	return (
		<Slider
			defaultValue={!props.disabled && props.value !== false ? props.value : null}
			disabled={props.value === false}
			onChange={value => (!props.disabled ? props.onChange(value) : false)}
			value={props.disabled && props.value !== false ? props.value : null}
			radius={'lg'}
			showLabelOnHover={false}
			size={'xl'}
			marks={percentageMarks}
			step={1}
			min={0}
			max={100}
			precision={0}
			label={() => null}
			styles={theme => ({
				track: {
					'&:before': {
						background: metering(theme, props.meterValue),
					},
				},
				bar: {
					backgroundColor: 'transparent',
				},
				mark: {
					border: 0,
					height: 12,
					width: 1,
				},
				thumb: {
					height: props.disabled ? '1em' : '2em',
					width: props.disabled ? '0.5em' : '1em',
					backgroundColor: 'white',
				},
				root: {
					paddingTop: '1em',
					paddingBottom: '2em',
				},
			})}
		/>
	)
}
