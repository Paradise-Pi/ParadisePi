import React, { useEffect, useState } from 'react'
import { RingProgress, Text, Button, Group, Modal, Skeleton } from '@mantine/core'
import * as timeago from 'timeago.js'
import { Prism } from '@mantine/prism'
import { ApiCall } from './../../../apis/wrapper'

export const UsageRings = () => {
	const [usageModalOpened, setUsageModalOpened] = useState(false)
	const [usageData, setUsageData] = useState<apiObject>({})
	useEffect(() => {
		const getOSUsageTimer = setInterval(() => {
			ApiCall.get('/about/operatingSystemUsage', {}).then((data: apiObject) => {
				setUsageData(data)
			})
		}, 1000)
		return () => {
			clearInterval(getOSUsageTimer)
		}
	}, [])
	if (Object.keys(usageData).length === 0) {
		return (
			<Group position="center">
				<Skeleton height={100} circle />
				<Skeleton height={100} circle />
				<Skeleton height={100} circle />
				<Skeleton height={100} circle />
			</Group>
		)
	}
	const uptime = usageData.uptime as number
	const uptimeString = timeago.format(Date.now() - uptime * 1000)
	const megabytes = usageData.memory.totalMemMb as number
	const gigabytes = megabytes / 1024
	const percentage: number = Math.round((gigabytes / 8) * 100)
	return (
		<Group position="center">
			<RingProgress
				sections={[
					{
						value: usageData.cpuPercent as number,
						color: 'pink',
					},
				]}
				label={
					<Text color="white" align="center" size="md">
						CPU
						<br />
						{Math.round(usageData.cpuPercent as number)}%
					</Text>
				}
			></RingProgress>
			<RingProgress
				sections={[
					{
						value: usageData.cpuPercent as number,
						color: 'pink',
					},
				]}
				label={
					<Text color="white" align="center" size="md">
						RAM
						<br />
						{Math.round(usageData.memory.usedMemPercentage as number)}%
					</Text>
				}
			></RingProgress>
			<RingProgress
				sections={[
					{
						value: percentage > 100 ? 100 : percentage,
						color: 'pink',
					},
				]}
				label={
					<Text color="white" align="center" size="md">
						RAM <br />
						{Math.round(gigabytes)}GB
					</Text>
				}
			></RingProgress>
			<RingProgress
				sections={[
					{
						value: 100,
						color: 'pink',
					},
				]}
				label={
					<Text color="white" align="center" size="md">
						Uptime <br />
						{uptimeString.replace(' ago', '')}
					</Text>
				}
			></RingProgress>
			<Button color="pink" onClick={() => setUsageModalOpened(true)} variant="default" size="sm" mx="xs">
				View System Resource Usage
			</Button>
			<Modal
				centered
				size="lg"
				overflow="inside"
				opened={usageModalOpened}
				onClose={() => setUsageModalOpened(false)}
				title="System Resource Usage"
			>
				<Prism language="json" noCopy>
					{JSON.stringify(usageData, null, 2)}
				</Prism>
			</Modal>
		</Group>
	)
}
