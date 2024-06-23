import { Loader, Stack, Title } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import React from 'react'
import { SetServerAddress } from '../Pages/SetServerAddress'
import { useAppSelector } from '../apis/redux/mainStore'
import { Authentication } from './Authentication'

export const ConnectionLost = (props: { children: React.ReactNode }) => {
	const viewportSize = useViewportSize()
	const socketConnected = useAppSelector(state => state.status.socketConnected)
	const passwordRequired = useAppSelector(state => state.status.passwordRequired)
	if (socketConnected) return <>{props.children}</>
	else if (passwordRequired) return <Authentication />
	else
		return (
			<Stack
				style={{ width: viewportSize.width, height: viewportSize.height }}
				align="center"
				spacing="lg"
				justify="center"
			>
				<Loader size="xl" variant="bars" />
				<Title order={1}>Attempting to connect to Paradise</Title>
				<SetServerAddress />
			</Stack>
		)
}
