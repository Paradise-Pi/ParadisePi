import { Button, Group, Modal, SimpleGrid } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiCall } from './../../Apis/wrapper'
import { useAppSelector } from './../../Apis/mainStore'
import { runningInElectron } from './../../Apis/version'
import { UsageRings } from './../../Components/Admin/Controls/RingProgress'
import { Prism } from '@mantine/prism'

const PanelButton = (props: { children: React.ReactNode }) => {
	return (
		<Button variant="default" color="dark" size="lg" mx="xs" my="xs">
			{props.children}
		</Button>
	)
}
export const ControlsConfigurationPage = () => {
	const [usageModalOpened, setusageModalOpened] = useState(false)
	const operatingSystem = useAppSelector(state =>
		state.database
			? state.database.about.operatingSystem.name
			: 'Operating System'
	)
	const [usageData, setUsageData] = useState<apiObject>({})
	useEffect(() => {
		const getOSUsageTimer = setInterval(() => {
			ApiCall.get('/about/operatingSystemUsage', {}).then(
				(data: apiObject) => {
					console.log(data)
					setUsageData(data)
				}
			)
		}, 1000)
		return () => {
			clearInterval(getOSUsageTimer)
		}
	}, [])

	return (
		<SimpleGrid
			spacing="xl"
			breakpoints={[
				{ minWidth: 'xs', cols: 1 },
				{ minWidth: 'sm', cols: 2 },
				{ minWidth: 'lg', cols: 6 },
			]}
		>
			<div>
				<Link to="/controlPanel/about">
					<PanelButton>Control Panel</PanelButton>
				</Link>
				<PanelButton>Reboot</PanelButton>
				{runningInElectron() ? (
					<PanelButton>Quit to {operatingSystem}</PanelButton>
				) : (
					//TODO implement quit & reboot functions
					<a href="/database/download" target="_blank">
						<PanelButton>Download Database Backup</PanelButton>
					</a>
				)}
				<Modal
					centered
					size="lg"
					overflow="inside"
					opened={usageModalOpened}
					onClose={() => setusageModalOpened(false)}
					title="System Resource Usage"
				>
					<Prism language="json" noCopy>
						{JSON.stringify(usageData, null, 2)}
					</Prism>
				</Modal>
				<Group position="center">
					<Button
						onClick={() => setusageModalOpened(true)}
						variant="default"
						color="dark"
						size="lg"
						mx="xs"
						my="xs"
					>
						System Resource Usage
					</Button>
				</Group>
			</div>
			<div>
				<UsageRings usageData={usageData} type="CPU" />
			</div>
			<div>
				<UsageRings usageData={usageData} type="Memory" />
				<UsageRings usageData={usageData} type="MemoryTotal" />
			</div>
			<div>
				<UsageRings usageData={usageData} type="Uptime" />
			</div>
		</SimpleGrid>
	)
}
