import { Button, Divider, Group, Text } from '@mantine/core'
import React from 'react'
import { Link } from 'react-router-dom'

import { useAppSelector } from '../../apis/redux/mainStore'
import { runningInElectron } from '../../apis/utilities/version'
import { UsageRings } from '../../Components/Admin/Controls/UsageRings'
import { useModals } from '@mantine/modals'

const PanelButton = (props: { children: React.ReactNode; onClick?: React.MouseEventHandler<HTMLButtonElement> }) => {
	return (
		<Button variant="default" color="dark" size="md" mx="xs" my="xs" onClick={props.onClick}>
			{props.children}
		</Button>
	)
}

export const ControlsConfigurationPage = () => {
	const operatingSystem = useAppSelector(state =>
		state.database ? state.database.about.operatingSystem.name : 'Desktop'
	)
	const modals = useModals()
	const openQuitModal = () =>
		modals.openConfirmModal({
			title: 'Are you sure you wish to quit?',
			centered: true,
			children: (
				<Text size="sm">
					Are you sure you want to quit?
					<br />
					This will result in loss of lighting/sound/video
				</Text>
			),
			labels: { confirm: 'Quit', cancel: 'Cancel' },
			confirmProps: { color: 'red' },
			onConfirm: () => console.log('Confirmed'), //TODO implement quit functionality
		})
	const openRebootModal = () =>
		modals.openConfirmModal({
			title: 'Are you sure you wish to reboot?',
			centered: true,
			children: (
				<Text size="sm">
					Are you sure you want to reboot this computer?
					<br />
					This may result in loss of lighting/sound/video whilst the reboot takes place
				</Text>
			),
			labels: { confirm: 'Quit', cancel: 'Cancel' },
			confirmProps: { color: 'red' },
			onConfirm: () => console.log('Confirmed'), //TODO implement quit functionality
		})
	return (
		<div>
			<Group position="center" spacing={0}>
				<Link to="/controlPanel/help">
					<PanelButton>Control Panel</PanelButton>
				</Link>
				<PanelButton onClick={openRebootModal}>Reboot</PanelButton>
				{runningInElectron() ? (
					<PanelButton onClick={openQuitModal}>Quit to {operatingSystem}</PanelButton>
				) : (
					<>
						<a href="/database/download" target="_blank">
							<PanelButton>Download Database Backup</PanelButton>
						</a>
						<a href="/logs" target="_blank">
							<PanelButton>Download Logs</PanelButton>
						</a>
					</>
				)}
			</Group>
			<Divider my="sm" />
			<UsageRings />
		</div>
	)
}
