import { Stack, Title, Space } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { useElementSize, useIdle, useViewportSize } from '@mantine/hooks'

const ScreensaverView = () => {
	/**
	 * When in screensaver state, shuffle the message up and down the screen to create a screensaver effect. The idea is to
	 */
	const viewportSize = useViewportSize()
	const { ref, height } = useElementSize()
	const [padHeight, setPadHeight] = useState(99999)
	const [heightGoingUp, setHeightGoingUp] = useState(false)
	const defaultHeight = (viewportSize.height - height) / 2 // This is the center position
	if (padHeight === 99999) setPadHeight(defaultHeight)
	useEffect(() => {
		const interval = setInterval(() => {
			if (heightGoingUp && padHeight + height + 100 > viewportSize.height) {
				setHeightGoingUp(false)
			}
			if (!heightGoingUp && padHeight < 100) {
				setHeightGoingUp(true)
			}

			setPadHeight(padHeight + (heightGoingUp ? 1 : -1))
		}, 1000)
		return () => clearInterval(interval)
	}, [height, heightGoingUp, padHeight, viewportSize.height])

	return (
		<Stack
			style={{ width: viewportSize.width, height: viewportSize.height }}
			align="center"
			spacing="lg"
			justify="flex-start"
		>
			<Space h={padHeight} />
			<div ref={ref}>
				<Title order={1}>Tap to wake</Title>
			</div>
		</Stack>
	)
}
export const ScreenSaver = (props: { children: React.ReactNode }) => {
	const timeoutTime = 2 * 60 * 1000 // TODO use a config value for timeout time
	const showScreensaver = useIdle(timeoutTime, { initialState: false })
	return <div>{showScreensaver ? <ScreensaverView /> : props.children}</div>
}
