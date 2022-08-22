import { Button, Center, Container, NumberInput, SimpleGrid, Space, Text, Title } from '@mantine/core'
import { FaSpaceShuttle } from '@react-icons/all-files/fa/FaSpaceShuttle'
import React, { useEffect, useState } from 'react'
import { ApiCall } from '../../../../app/apis/wrapper'
import { channelData } from '../../../../output/e131'
// TODO allow level to be configured
// TODO respect first universe
export const ChannelCheckPage = () => {
	const [universe, setUniverse] = useState<number>(1)
	const [channel, setChannel] = useState<number>(-1)
	const [channelText, setChannelText] = useState<string>('Off')

	useEffect(() => {
		if (channel > 0) {
			setChannelText(channel.toString())
			setChannelE131(channel, 180)
		} else if (channel === 0) {
			setAllE131(180)
			setChannelText('All')
		} else {
			setAllE131(0)
			setChannelText('Off')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [channel, universe])

	function setAllE131(intensity: number) {
		const channels: Array<channelData> = []
		for (let i = 1; i <= 512; i++) {
			channels.push({ channel: i, level: intensity })
		}
		const data: apiObject = {
			universe: universe,
			channelData: channels,
			fadeTime: 0,
		}
		ApiCall.put('/outputModules/e131/output', data)
	}

	function setChannelE131(thisChannel: number, intensity: number) {
		setAllE131(0)
		const data: apiObject = {
			universe: universe,
			channelData: [{ channel: thisChannel, level: intensity }],
			fadeTime: 0,
		}
		ApiCall.put('/outputModules/e131/output', data)
	}

	function checkPrevious() {
		if (channel == 1 || channel < 1) {
			setChannel(512)
		} else {
			setChannel(channel - 1)
		}
	}

	function checkNext() {
		if (channel == 512 || channel < 1) {
			setChannel(1)
		} else {
			setChannel(channel + 1)
		}
	}

	return (
		<Container>
			<Title order={2}>Channel Check</Title>
			<Space h="md" />
			<NumberInput
				py={'md'}
				icon={<FaSpaceShuttle />}
				description="Universe number"
				value={universe}
				min={1}
				max={63999}
				onChange={setUniverse}
			/>
			<Space h="md" />
			<SimpleGrid cols={3}>
				<Button size="xl" onClick={checkPrevious}>
					Previous
				</Button>
				<Center>
					<Text size="xl" color="white">
						{channelText}
					</Text>
				</Center>
				<Button size="xl" onClick={checkNext}>
					Next
				</Button>
				<Button
					size="xl"
					onClick={() => {
						setChannel(-1)
					}}
				>
					Off
				</Button>
				<Space />
				<Button
					size="xl"
					onClick={() => {
						setChannel(0)
					}}
				>
					All
				</Button>
			</SimpleGrid>
		</Container>
	)
}
