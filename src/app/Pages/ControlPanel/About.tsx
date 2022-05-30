import { Paper, Text, Button } from '@mantine/core'

import React from 'react'
import { Link } from 'react-router-dom'

export const AboutPage = () => {
	return (
		<>
			<Paper shadow="xl" p="lg" withBorder>
				<Text>ParadisePi</Text>
				<Text>Facility control panel for sACN & OSC, in Electron.</Text>
			</Paper>

			<Link to="/admin/controls">
				<Button variant="default">Exit to Admin</Button>
			</Link>
		</>
	)
}
