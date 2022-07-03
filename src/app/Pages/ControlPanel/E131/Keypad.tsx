import { Button, SimpleGrid, TextInput, Space, Slider, Container, Title } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { ApiCall } from '../../../apis/wrapper'
import { channelData } from '../../../../output/e131'

export const KeypadPage = () => {
	const [faderDisabled, setFaderDisabled] = useState<boolean>(true)
	const [intensity, setIntensity] = useState<number>(0)
	const [commandText, setCommandText] = useState<string>('')

	//Update e131 output on intensity change
	useEffect(() => {
		const command = commandText.split(' ')
		const channels: Array<channelData> = []
		if (validCommand(command)) {
			setFaderDisabled(false)
			if (command[2]) {
				for (let i = parseInt(command[0]); i <= parseInt(command[2]); i++) {
					channels.push({ channel: i, level: intensity })
				}
			} else {
				channels.push({ channel: parseInt(command[0]), level: intensity })
			}

			sendLX(1, channels, 0)
		} else {
			setFaderDisabled(true)
		}
	}, [commandText, intensity])

	/**
	 * Verify a command array will actually be able to control fixtures
	 * @param command - The command array to verify
	 * @returns True if the command array is valid, false otherwise
	 */
	function validCommand(command: string[]) {
		if (
			command.length === 0 ||
			command.length > 3 ||
			command.length === 2 ||
			command[0] === '' ||
			command[2] === '' ||
			parseInt(command[0]) > 512 ||
			parseInt(command[2]) > 512 ||
			parseInt(command[2]) < parseInt(command[0])
		) {
			return false
		}
		return true
	}

	/**
	 * Actually update our e131 Data
	 * @param universe - Current Universe
	 * @param channels - Channels to update
	 * @param fadeTime - how long to fade the channels
	 */
	function sendLX(universe: number, channels: Array<channelData>, fadeTime: number) {
		const data: apiObject = { universe: universe, channelData: channels, fadeTime: fadeTime * 1000 }
		ApiCall.put('/outputModules/e131/output', data)
	}

	/**
	 * Update and verify the command array and enable intensity slider if valid
	 * @param commandValue - the new value to add
	 */
	function updateCommandString(commandValue: string) {
		if (commandValue === 'clear') {
			setCommandText('')
			setIntensity(0)
		} else {
			setCommandText(commandText + commandValue)
		}
	}

	return (
		<Container>
			<TextInput disabled aria-label="Command Output" size="xl" value={commandText} />
			<Space h="xl" />
			<SimpleGrid cols={3}>
				{['7', '8', '9', '4', '5', '6', '1', '2', '3'].map(number => (
					<Button
						size="lg"
						key={number}
						onClick={() => {
							updateCommandString(number)
						}}
					>
						{number}
					</Button>
				))}
				<Button
					size="lg"
					onClick={() => {
						updateCommandString('clear')
					}}
				>
					Clear
				</Button>
				<Button
					size="lg"
					onClick={() => {
						updateCommandString('0')
					}}
				>
					0
				</Button>
				<Button
					size="lg"
					onClick={() => {
						updateCommandString(' thru ')
					}}
				>
					Thru
				</Button>
			</SimpleGrid>
			{!faderDisabled ? (
				<>
					<Space h="xl" />
					<Title order={2}>Intensity</Title>
					<Slider
						value={intensity}
						onChange={setIntensity}
						size="xl"
						radius="xl"
						min={0}
						max={255}
						marks={[
							{ value: 0, label: '0%' },
							{ value: 64, label: '25%' },
							{ value: 128, label: '50%' },
							{ value: 192, label: '75%' },
							{ value: 255, label: '100%' },
						]}
					></Slider>
				</>
			) : null}
		</Container>
	)
}