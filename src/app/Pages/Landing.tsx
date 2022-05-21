import { Button, Stack, Title } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import React from 'react'
import { Link } from 'react-router-dom'
import { runningInElectron } from '../Apis/version'

export const LandingPage = () => {
	const { height, width } = useViewportSize()
	return (
		<>
			<Stack style={{ width, height }} align="center" spacing="lg" justify="center">
				<Title order={1}>ParadisePi</Title>
				<Link to="/admin/controls">
					<Button variant="default" color="dark" size="xl">
						Administration
					</Button>
				</Link>
				<Link to="/controlPanel">
					<Button variant="default" color="dark" size="xl">
						Control Panel
					</Button>
				</Link>
				{runningInElectron() ? ( //TODO implement	quit function
					<Button variant="default" size="xl">
						Quit
					</Button>
				) : null}
			</Stack>
		</>
	)
}
