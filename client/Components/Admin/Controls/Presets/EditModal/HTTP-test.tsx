import { Alert, Button, Code, Text } from '@mantine/core'
import { FaExclamationTriangle } from '@react-icons/all-files/fa/FaExclamationTriangle'
import React, { useState } from 'react'
import { ApiCall } from '../../../../../apis/wrapper'

export const HTTPPresetEditModalTestFunction = (props: {
	data: { deviceHost: string; data: any }
	disabled: boolean
}) => {
	const [testHTTPResponse, setTestHTTPResponse] = useState<string | null>(null)
	const [testHTTPError, setTestHTTPError] = useState<string | null>(null)
	const [loadingHTTP, setLoadingHTTP] = useState<boolean>(false)
	if (props.disabled) return null
	return (
		<>
			<Button
				my={'md'}
				onClick={() => {
					setLoadingHTTP(true)
					setTestHTTPError(null)
					setTestHTTPResponse(null)
					ApiCall.get('/presets/test/http', props.data).then(response => {
						setLoadingHTTP(false)
						if (response.error) {
							setTestHTTPError(response.error)
						} else {
							setTestHTTPResponse(response.response)
						}
					})
				}}
				loading={loadingHTTP}
			>
				Send a test request
			</Button>
			{testHTTPResponse !== null ? (
				<>
					<Text>Response received:</Text>
					<Code block>{testHTTPResponse}</Code>
				</>
			) : null}
			{testHTTPError !== null ? <Alert icon={<FaExclamationTriangle size={16} />}>{testHTTPError}</Alert> : null}
		</>
	)
}
