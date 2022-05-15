import React from 'react'
import { RingProgress, Text } from '@mantine/core'
import * as timeago from 'timeago.js'

export const UsageRings = (props: {
	usageData: apiObject
	type: 'CPU' | 'Memory' | 'Uptime' | 'MemoryTotal'
}) => {
	if (Object.keys(props.usageData).length === 0) {
		return <></>
	}
	if (props.type === 'CPU') {
		return (
			<RingProgress
				sections={[
					{
						value: props.usageData.cpuPercent as number,
						color: 'pink',
					},
				]}
				label={
					<Text color="white" align="center" size="md">
						CPU
						<br />
						{Math.round(props.usageData.cpuPercent as number)}%
					</Text>
				}
			></RingProgress>
		)
	} else if (props.type === 'Uptime') {
		const uptime = props.usageData.uptime as number
		const uptimeString = timeago.format(Date.now() - uptime * 1000)
		return (
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
		)
	} else if (props.type === 'MemoryTotal') {
		const megabytes = props.usageData.memory.totalMemMb as number
		const gigabytes = megabytes / 1024
		const percentage: number = Math.round((gigabytes / 8) * 100)
		return (
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
		)
	}
	return (
		<RingProgress
			sections={[
				{ value: props.usageData.cpuPercent as number, color: 'pink' },
			]}
			label={
				<Text color="white" align="center" size="md">
					RAM
					<br />
					{Math.round(
						props.usageData.memory.usedMemPercentage as number
					)}
					%
				</Text>
			}
		></RingProgress>
	)
}
