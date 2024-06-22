import { Button, Center, Container, NumberInput, SimpleGrid, Slider, Space, Text, Title } from '@mantine/core'
import { FaSpaceShuttle } from '@react-icons/all-files/fa/FaSpaceShuttle'
import React, { useEffect, useState } from 'react'
import { ApiCall } from '../../../../app/apis/wrapper'
import { channelData } from '../../../../output/e131'
import { useAppSelector } from './../../../apis/redux/mainStore'

export const ChannelCheckPage = () => {
	const e131Enabled = useAppSelector(state => (state.database ? state.database.config.e131.e131Enabled : null))

	if (e131Enabled) {
		return <ChannelCheckContent />
	} else {
		return (
			<Container>
				<Title>sACN (E1.31) is disabled</Title>
				<Text>Lighting must be set up to use Channel Check</Text>
			</Container>
		)
	}
}

const ChannelCheckContent = () => {
	const e131Config = useAppSelector(state => (state.database ? state.database.config.e131 : null))
	const [universe, setUniverse] = useState<number>(e131Config.e131FirstUniverse)
	const [channel, setChannel] = useState<number>(-1)
	const [channelText, setChannelText] = useState<string>('Off')
	const [intensity, setIntensity] = useState<number>(180)

	useEffect(() => {
		if (channel > 0) {
			setChannelText(channel.toString())
			setChannelE131(channel, intensity)
		} else if (channel === 0) {
			setAllE131(intensity)
			setChannelText('All')
		} else {
			setAllE131(0)
			setChannelText('Off')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [channel, universe, intensity])

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
				min={e131Config.e131FirstUniverse}
				max={e131Config.e131FirstUniverse + e131Config.e131Universes - 1}
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
		</Container>
	)
}
