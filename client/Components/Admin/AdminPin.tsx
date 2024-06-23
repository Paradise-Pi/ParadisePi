import { Button, PasswordInput, SimpleGrid, Stack, Title } from '@mantine/core'
import { useDisclosure, useInputState, useViewportSize } from '@mantine/hooks'
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft'
import { FaLock } from '@react-icons/all-files/fa/FaLock'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../apis/redux/mainStore'

export const AdminPin = (props: { children: React.ReactNode }) => {
	const [currentAdminPin, setCurrentAdminPin] = useState('')
	const adminPin = useAppSelector(state => (state.database ? state.database.config.general.adminPin : ''))

	const viewportSize = useViewportSize()
	const [visible, { toggle }] = useDisclosure(true)
	const [pinField, setPinField] = useInputState('')
	const [passwordIncorrectText, setPasswordIncorrectText] = useState('')

	if (currentAdminPin === adminPin || adminPin === '') return <>{props.children}</>
	const submitForm = () => {
		if (pinField !== adminPin) {
			setPasswordIncorrectText('Incorrect pin')
		} else {
			setCurrentAdminPin(pinField)
		}
	}
	return (
		<Stack
			style={{ width: viewportSize.width, height: viewportSize.height }}
			align="center"
			spacing="lg"
			justify="center"
		>
			<Title order={1}>
				<FaLock /> Enter Admin Pin
			</Title>
			<PasswordInput
				size="xl"
				style={{ width: viewportSize.width / 2 }}
				value={pinField}
				visible={visible}
				error={passwordIncorrectText}
				onVisibilityChange={toggle}
				onChange={setPinField}
				autoFocus={true}
				onKeyDown={e => {
					if (e.key === 'Enter') submitForm()
				}}
			/>
			<SimpleGrid cols={3}>
				{['7', '8', '9', '4', '5', '6', '1', '2', '3'].map(number => (
					<Button size="lg" key={number} onClick={() => setPinField(pinField + number)}>
						{number}
					</Button>
				))}
				<Link to="/controlPanel/help">
					<Button color="gray" size="lg" leftIcon={<FaArrowLeft />}>
						Back
					</Button>
				</Link>
				<Button size="lg" onClick={() => setPinField(pinField + '0')}>
					0
				</Button>
				<Button size="lg" color="teal" onClick={() => submitForm()}>
					Login
				</Button>
			</SimpleGrid>
		</Stack>
	)
}
