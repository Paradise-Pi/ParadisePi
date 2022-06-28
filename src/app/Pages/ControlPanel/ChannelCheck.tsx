import { Button, Center, Container, SimpleGrid, Space, Text } from '@mantine/core'
import React, { useEffect, useRef, useState } from 'react'
import { ApiCall } from '../../../app/apis/wrapper'
import { channelData } from '../../../output/e131'

export const ChannelCheckPage = () => {
	const textRef = useRef<HTMLDivElement>()

	const [channel, setChannel] = useState<number>(0)

	useEffect(() => {
		if (channel > 0) {
			setAllLX(0)
			textRef.current.innerText = channel.toString()

			const data: apiObject = {
				universe: 1,
				channels: { channel: channel, level: 180 },
				fadeTime: 0,
			}
			ApiCall.get('/outputModules/e131/output', data)
		}
	}, [channel])

	function setAllLX(intensity: number) {
		const channels: Array<channelData> = []
		for (let i = 1; i <= 512; i++) {
			channels.push({ channel: i, level: intensity })
		}
		const data: apiObject = {
			universe: 1,
			channels: channels,
			fadeTime: 0,
		}
		ApiCall.get('/outputModules/e131/output', data)
	}

	function checkPrevious() {
		if (channel == 1) {
			setChannel(512)
		} else {
			setChannel(channel - 1)
		}
	}

	function checkNext() {
		if (channel == 512) {
			setChannel(1)
		} else {
			setChannel(channel + 1)
		}
	}

	function checkAll() {
		setAllLX(180)
		setChannel(0)
		textRef.current.innerText = 'All'
	}

	function checkOff() {
		setAllLX(0)
		setChannel(-1)
		textRef.current.innerText = 'Off'
	}

	return (
		<Container>
			<Space h="xl" />
			<SimpleGrid cols={3}>
				<Button size="xl" onClick={checkPrevious}>
					Previous
				</Button>
				<Center>
					<Text size="xl" color="white" ref={textRef}>
						Off
					</Text>
				</Center>
				<Button size="xl" onClick={checkNext}>
					Next
				</Button>
				<Button size="xl" onClick={checkOff}>
					Off
				</Button>
				<Space />
				<Button size="xl" onClick={checkAll}>
					All
				</Button>
			</SimpleGrid>
		</Container>
	)
}
