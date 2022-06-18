import { Stack, Title, Collapse, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { useViewportSize } from '@mantine/hooks'
import { FaRecycle } from '@react-icons/all-files/fa/FaRecycle'
import { useAppSelector } from '../apis/redux/mainStore'

const ScanningView = () => {
	/**
	 * When scanning in E1.31, show an explanation when clicked
	 */
	const viewportSize = useViewportSize()
	const [showMoreDetails, setShowMoreDetails] = useState(false)
	const [lastClicked, setLastClicked] = useState(0)
	useEffect(() => {
		const interval = setInterval(() => {
			if (showMoreDetails && lastClicked + 5 * 1000 < Date.now()) {
				setShowMoreDetails(false)
			}
		}, 1000)
		return () => clearInterval(interval)
	}, [lastClicked, showMoreDetails])

	return (
		<Stack
			style={{ width: viewportSize.width, height: viewportSize.height }}
			align="center"
			spacing="lg"
			justify="center"
			onClick={() => {
				setShowMoreDetails(true)
				setLastClicked(Date.now())
			}}
		>
			<Title order={1}>
				<FaRecycle />
			</Title>
			<Collapse in={showMoreDetails} transitionDuration={500} transitionTimingFunction="linear">
				<Text>Device is scanning for lighting scenes, Please Wait!</Text>
			</Collapse>
		</Stack>
	)
}

export const Scanning = (props: { children: React.ReactNode }) => {
	const deviceScanning = false
	return <div>{deviceScanning ? <ScanningView /> : props.children}</div>
}
