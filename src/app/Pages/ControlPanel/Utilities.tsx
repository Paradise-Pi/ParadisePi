import { Button, SimpleGrid, Space, Title } from '@mantine/core'
import React from 'react'
import { Link } from 'react-router-dom'

export const UtilitiesPage = () => {
	return (
		<>
			<Title order={2}>Lighting Utilities</Title>
			<Space h="xl" />
			<SimpleGrid cols={4}>
				<Button<typeof Link> size="xl" component={Link} to="/controlPanel/lxkeypad">
					Keypad
				</Button>
			</SimpleGrid>
		</>
	)
}
