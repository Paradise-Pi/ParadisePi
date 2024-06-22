import { Stack, Title, Space, Image } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { useElementSize, useIdle, useViewportSize } from '@mantine/hooks'
import { useAppSelector } from '../apis/redux/mainStore'

const ScreensaverView = () => {
	const logo = useAppSelector(state => (state.images ? state.images.logo : false))
	/**
	 * When in screensaver state, shuffle the message up and down the screen to create a screensaver effect. The idea is that no single pixel is ever always displaying the message.
	 */
	const viewportSize = useViewportSize()
	const { ref, height } = useElementSize()
	const [padHeight, setPadHeight] = useState<number | false>(false)
	const [heightGoingUp, setHeightGoingUp] = useState(false)
	const defaultHeight = (viewportSize.height - height) / 2 // This is the center position
	const upperHeight = defaultHeight + height / 1.9
	const lowerHeight = defaultHeight - height / 1.9
	if (padHeight === false) setPadHeight(defaultHeight)
	useEffect(() => {
		const interval = setInterval(() => {
			if (padHeight !== false) {
				if (heightGoingUp && padHeight > upperHeight) {
					//Only needs to go up as far as its height
					setHeightGoingUp(false)
				}
				if (!heightGoingUp && padHeight < lowerHeight) {
					setHeightGoingUp(true)
				}

				setPadHeight(padHeight + (heightGoingUp ? 1 : -1))
			}
		}, 2000)
		return () => clearInterval(interval)
	}, [heightGoingUp, lowerHeight, padHeight, upperHeight])

	return (
		<Stack
			style={{ width: viewportSize.width, height: viewportSize.height }}
			align="center"
			spacing="lg"
			justify="flex-start"
		>
			<Space h={padHeight !== false ? padHeight : 0} />
			<div ref={ref}>
				{logo !== false ? (
					<Image src={logo} height={viewportSize.height / (viewportSize.height > 800 ? 5 : 3)} />
				) : (
					<Title order={1}>Tap to wake</Title>
				)}
			</div>
		</Stack>
	)
}
export const ScreenSaver = (props: { children: React.ReactNode }) => {
	const defaultTimeoutTime = 2 * 60 * 1000 // 2 minutes
	let timeoutTime = useAppSelector(state =>
		state.database ? state.database.config.general.timeoutTime : defaultTimeoutTime
	)
	if (timeoutTime < 4000) timeoutTime = 4000 //Set a lower limit of 4 seconds otherwise it all gets a bit silly really
	const showScreensaver = useIdle(timeoutTime, { initialState: true })
	return <>{showScreensaver ? <ScreensaverView /> : props.children}</>
}
