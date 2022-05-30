import React, { useEffect, useState } from 'react'
import { UnstyledButton, UnstyledButtonProps, Group, Avatar, Text, createStyles } from '@mantine/core'
import { useAppSelector } from './../../../apis/redux/mainStore'
import { FaWindows } from '@react-icons/all-files/fa/FaWindows'

export const SocketClients = () => {
	const clientsList = useAppSelector(state => state.status.socketClients)
	return (
		<Group position="center">
			{Object.entries(clientsList).map(([key, value]) => {
				return (
					<Group key={key}>
						<Avatar radius="xl">
							<FaWindows />
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
	)
}
