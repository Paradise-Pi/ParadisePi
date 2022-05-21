import { Paper, Text, Button } from '@mantine/core'
import { QRCodeSVG } from 'qrcode.react'
import React from 'react'
import { Link } from 'react-router-dom'

export const AboutPage = () => {
	return (
		<>
			<Paper shadow="xl" p="lg" withBorder>
				<Text>ParadisePi</Text>
				<Text>Facility control panel for sACN & OSC, in Electron.</Text>
			</Paper>
			<QRCodeSVG value="https://google.com/" bgColor="#000000" fgColor="#FFFFFF" />
			<Link to="/admin/controls">
				<Button variant="default">Exit to Admin</Button>
			</Link>
		</>
	)
}
