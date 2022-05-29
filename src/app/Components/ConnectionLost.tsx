import { Loader, Stack, Title } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import React from 'react'
import { useAppSelector } from './../apis/redux/mainStore'
import { runningInElectron } from './../apis/utilities/version'

export const ConnectionLost = (props: { children: React.ReactNode }) => {
	const viewportSize = useViewportSize()
	const socketConnected = useAppSelector(state => state.status.socketConnected)
	if (socketConnected || runningInElectron()) return <>{props.children}</>
	else
		return (
			<Stack
				style={{ width: viewportSize.width, height: viewportSize.height }}
				align="center"
				spacing="lg"
				justify="center"
			>
				<Loader size="xl" variant="bars" />
				<Title order={1}>Attempting to connect</Title>
			</Stack>
		)
}
