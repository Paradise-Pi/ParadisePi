import { Stack, Title, Collapse, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { useViewportSize } from '@mantine/hooks'
import { FaLock } from '@react-icons/all-files/fa/FaLock'
import { useAppSelector } from './../apis/redux/mainStore'
const LockedView = () => {
	/**
	 * When locked, show a bit more of a message when clicked. The idea is to provide a bit more feedback
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
				<FaLock />
			</Title>
			<Collapse in={showMoreDetails} transitionDuration={500} transitionTimingFunction="linear">
				<Text>Device is locked, unlock it using the administrator interface</Text>
			</Collapse>
		</Stack>
	)
}
export const Locked = (props: { children: React.ReactNode }) => {
	const deviceLocked = useAppSelector(state => (state.database ? state.database.config.general.deviceLock : true))
	return <div>{deviceLocked ? <LockedView /> : props.children}</div>
}
