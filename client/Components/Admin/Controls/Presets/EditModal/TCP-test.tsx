import { Alert, Button, Code, Text } from '@mantine/core'
import { FaExclamationTriangle } from '@react-icons/all-files/fa/FaExclamationTriangle'
import React, { useState } from 'react'
import { ApiCall } from '../../../../../apis/wrapper'

export const TCPPresetEditModalTestFunction = (props: {
	data: { deviceHost: { ip: string; port: number }; data: string }
	disabled: boolean
}) => {
	const [testTCPResponse, setTestTCPResponse] = useState<string | null>(null)
	const [testTCPResponseTime, setTestTCPResponseTime] = useState<number | null>(null)
	const [testTCPError, setTestTCPError] = useState<string | null>(null)
	const [loadingTCP, setLoadingTCP] = useState<boolean>(false)
	if (props.disabled || props.data.data == null) return null
	const data = JSON.parse(props.data.data)
	return (
		<>
			<Button
				my={'md'}
				onClick={() => {
					setLoadingTCP(true)
					setTestTCPError(null)
					setTestTCPResponse(null)
					setTestTCPResponseTime(null)
					ApiCall.get('/presets/test/tcp', {
						ip: props.data.deviceHost.ip,
						port: props.data.deviceHost.port,
						message: data.message,
						timeout: data.timeout,
					}).then(response => {
						setLoadingTCP(false)
						if (response.error) {
							setTestTCPError(response.error)
						} else {
							setTestTCPResponseTime(response.speed)
							setTestTCPResponse(response.data)
						}
					})
				}}
				loading={loadingTCP}
			>
				Send a test request
			</Button>
			{testTCPResponse !== null ? (
				<>
					<Text>Received after {testTCPResponseTime}ms:</Text>
					<Code block>{testTCPResponse}</Code>
				</>
			) : null}
			{testTCPError !== null ? <Alert icon={<FaExclamationTriangle size={16} />}>{testTCPError}</Alert> : null}
		</>
	)
}
