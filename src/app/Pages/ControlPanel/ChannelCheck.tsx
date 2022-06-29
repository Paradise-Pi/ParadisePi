import { Button, Center, Container, SimpleGrid, Space, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { ApiCall } from '../../../app/apis/wrapper'
import { channelData } from '../../../output/e131'

export const ChannelCheckPage = () => {
	const [channel, setChannel] = useState<number>(-1)
	const [channelText, setChannelText] = useState<string>('Off')

	useEffect(() => {
		if (channel > 0) {
			setChannelText(channel.toString())
			setChannelLX(channel, 180)
		} else if (channel === 0) {
			setAllLX(180)
			setChannelText('All')
		} else {
			setAllLX(0)
			setChannelText('Off')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [channel])

	function setAllLX(intensity: number) {
		const channels: Array<channelData> = []
		for (let i = 1; i <= 512; i++) {
			channels.push({ channel: i, level: intensity })
		}
		const data: apiObject = {
			universe: 1,
			channelData: channels,
			fadeTime: 0,
		}
		ApiCall.get('/outputModules/e131/output', data)
	}

	function setChannelLX(thisChannel: number, intensity: number) {
		setAllLX(0)
		const data: apiObject = {
			universe: 1,
			channelData: [{ channel: thisChannel, level: intensity }],
			fadeTime: 0,
		}
		ApiCall.get('/outputModules/e131/output', data)
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
			<Space h="xl" />
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
