import { Stack, Title, PasswordInput, Button } from '@mantine/core'
import React from 'react'
import { useInputState, useViewportSize } from '@mantine/hooks'
import { FaLock } from '@react-icons/all-files/fa/FaLock'
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft'
import { Link } from 'react-router-dom'
import { ApiCall } from '../apis/wrapper'
import { SocketConnection } from '../apis/socketIo'

const submitPassword = (password: string) => {
	if (password !== '') {
		sessionStorage.setItem('paradiseRemotePassword', password)
		SocketConnection.destroy()
		ApiCall.get('/ping', {}).then(() => {
			window.location.reload()
		})
	}
}

export const Authentication = () => {
	const viewportSize = useViewportSize()
	const [passwordField, setPasswordField] = useInputState('')
	return (
		<Stack
			style={{ width: viewportSize.width, height: viewportSize.height }}
			align="center"
			spacing="lg"
			justify="center"
		>
			<Title order={1}>
				<FaLock /> Remote Access Password Required
			</Title>
			<PasswordInput
				size="xl"
				style={{ width: viewportSize.width / 2 }}
				value={passwordField}
				onChange={setPasswordField}
			/>
			<Button.Group>
				<Button size="lg" onClick={() => submitPassword(passwordField)} mx={'md'}>
					Login
				</Button>
			</Button.Group>
		</Stack>
	)
}
