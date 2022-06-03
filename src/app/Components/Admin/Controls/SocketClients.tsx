import React, { useState } from 'react'
import { Group, Avatar, Text, Center, Title, Modal } from '@mantine/core'
import { useAppSelector } from './../../../apis/redux/mainStore'
import { GetOSIcon } from './../../../apis/utilities/os'
import { FaServer } from '@react-icons/all-files/fa/FaServer'
import { QRCodeSVG } from 'qrcode.react'
import { useViewportSize } from '@mantine/hooks'

export const SocketClients = () => {
	const { width } = useViewportSize()
	const [modalOpened, setModalOpened] = useState(false)
	const clientsList = useAppSelector(state => state.status.socketClients)
	const ipAddress = useAppSelector(state => (state.database ? state.database.about.ipAddress : null))
	const port = useAppSelector(state => (state.database ? state.database.about.port : null))
	return (
		<>
			<Center>
				<Title my={'sm'} order={5}>
					Paradise Devices
				</Title>
			</Center>
			<Group position="center">
				<Group onClick={() => setModalOpened(true)}>
					<Avatar radius="xl">
						<FaServer />
					</Avatar>

					<div style={{ flex: 1 }}>
						<Text size="sm" weight={500}>
							Server: {ipAddress}
						</Text>
						<Text color="dimmed" size="xs">
							Click for QR Code
						</Text>
					</div>
				</Group>
				{Object.entries(clientsList).map(([key, value]) => {
					return (
						<Group key={key}>
							<Avatar radius="xl" title={value.os}>
								<GetOSIcon os={value.os} />
							</Avatar>

							<div style={{ flex: 1 }}>
								<Text size="sm" weight={500}>
									{value.ip.replace('::ffff:', '')}
								</Text>

								<Text color="dimmed" size="xs">
									{key}
								</Text>
							</div>
						</Group>
					)
				})}
			</Group>
			<Modal
				centered
				size={width / 3}
				overflow="outside"
				opened={modalOpened}
				onClose={() => setModalOpened(false)}
				title={'Connect to ' + ipAddress + ':' + port}
				overlayColor={'#000000'}
				overlayOpacity={1}
				overlayBlur={0}
			>
				<Center>
					<QRCodeSVG
						value={'http://' + ipAddress + ':' + port}
						bgColor="#000000"
						fgColor="#FFFFFF"
						level={'M'}
						size={width / 3}
						includeMargin={false}
					/>
				</Center>
			</Modal>
		</>
	)
}
