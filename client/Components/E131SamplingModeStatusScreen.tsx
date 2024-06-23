import { Title, Progress, Center, Code } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { useElementSize, useViewportSize } from '@mantine/hooks'
import { useAppSelector } from '../apis/redux/mainStore'

const SamplingView = () => {
	const samplingMode = useAppSelector(state => state.e131SamplingMode)
	const [progress, setProgress] = useState(0)
	const viewportSize = useViewportSize()
	const { ref, height } = useElementSize()
	useEffect(() => {
		const interval = setInterval(() => {
			const totalTime = samplingMode.finishingTimestamp - samplingMode.startedTimestamp
			const currentTime = samplingMode.finishingTimestamp - Date.now()
			setProgress(Math.round(((totalTime - currentTime) / totalTime) * 100))
		}, 100)
		return () => clearInterval(interval)
	}, [samplingMode])

	return (
		<>
			<div ref={ref}>
				<Progress radius={'xs'} size={'xl'} value={progress} />
				<Code
					block
					style={{ maxHeight: viewportSize.height / 2, width: viewportSize.width, overflow: 'hidden' }}
				>
					{samplingMode.messages.map(message => message + '\n')}
				</Code>
			</div>
			<Center style={{ width: viewportSize.width, height: viewportSize.height - height }}>
				<Title order={3} my="sm">
					Sampling for data from other Lighting Control Systems
				</Title>
				<br />
			</Center>
		</>
	)
}

export const E131SamplingModeStatusScreen = (props: { children: React.ReactNode }) => {
	const samplingModeRunning = useAppSelector(state => state.e131SamplingMode.sampling)
	return <div>{samplingModeRunning ? <SamplingView /> : props.children}</div>
}
