import { Collapse, Stack, Text, Title } from '@mantine/core'
import { useEventListener, useViewportSize } from '@mantine/hooks'
import { FaLock } from '@react-icons/all-files/fa/FaLock'
import React, { useCallback, useEffect, useState } from 'react'
import { useAppSelector } from '../apis/redux/mainStore'

const LockedMessage = () => {
	const [count, setCount] = useState(0)
	const increment = useCallback(() => setCount(c => c + 1), [])
	const ref = useEventListener('click', increment)
	const ipAddress = useAppSelector(state => (state.database ? state.database.about.ipAddress : null))
	const port = useAppSelector(state => (state.database ? state.database.about.port : false))
	if (count >= 5) {
		return (
			<Text size="sm" mx={'lg'} ta="center">
				Device is locked. To unlock it access the setup and administration area, by ensuring you are on the same
				network as this device and then navigating to http://
				{ipAddress + ':' + port ?? ''} with a web browser
			</Text>
		)
	} else {
		return (
			<Text
				size="sm"
				ref={ref}
				ta="center"
				style={{ userSelect: 'none', MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
			>
				Device is locked, unlock it using the setup and administration area on another device
			</Text>
		)
	}
}
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
				<LockedMessage />
			</Collapse>
		</Stack>
	)
}
export const Locked = (props: { children: React.ReactNode }) => {
	const deviceLocked = useAppSelector(state => (state.database ? state.database.config.general.deviceLock : true))
	return <div>{deviceLocked ? <LockedView /> : props.children}</div>
}
