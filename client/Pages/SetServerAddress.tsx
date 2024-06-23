import { Button, TextInput } from '@mantine/core'
import React, { useState } from 'react'

export const SetServerAddress = () => {
	const serverAddress = sessionStorage.getItem('paradiseServerAddress') || window.location.host
	const [value, setValue] = useState(serverAddress)
	return (
		<>
			<TextInput
				label="Server Address"
				value={value}
				onChange={event => setValue(event.currentTarget.value)}
				size="xl"
				rightSection={
					<Button
						onClick={() => {
							sessionStorage.setItem('paradiseServerAddress', value)
							window.location.reload()
						}}
					>
						Change
					</Button>
				}
			/>
		</>
	)
}
