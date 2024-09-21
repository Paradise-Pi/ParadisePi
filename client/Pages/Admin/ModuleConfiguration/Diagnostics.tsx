import { Button, Container, Divider } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { Prism } from '@mantine/prism'
import React from 'react'
import { useAppSelector } from '../../../apis/redux/mainStore'

const Logs = () => {
	const { width } = useViewportSize()
	const logs = useAppSelector(state => state.logs.logs)
	return (
		<Container size={width}>
			<Prism
				withLineNumbers
				language="json"
				copyLabel="Copy code to clipboard"
				copiedLabel="Code copied to clipboard"
			>
				{logs.map(logLine => JSON.stringify(JSON.parse(logLine), null, 2)).join('\n')}
			</Prism>
		</Container>
	)
}
export const DiagnosticsConfigurationPage = () => (
	<>
		<a
			href={`http://${sessionStorage.getItem('paradiseServerAddress') || window.location.host}/error-logs`}
			
		>
			<Button variant="default" color="dark" size="md" mx="xs" my="xs">
				Download Diagnostics Logs
			</Button>
		</a>
		<Divider my={'sm'} label="Live diagnostic logging" labelPosition="center" />
		<Logs />
	</>
)
