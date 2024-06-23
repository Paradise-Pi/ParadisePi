import { Alert, Badge, Group, Title } from '@mantine/core'
import { FaExclamationTriangle } from '@react-icons/all-files/fa/FaExclamationTriangle'
import React from 'react'
import { faderArrayToString } from '../../../shared/faderFunctions'
import { DatabaseFader } from '../../../shared/sharedTypes'
import { useAppSelector } from '../../apis/redux/mainStore'
import { ApiCall } from '../../apis/wrapper'
import { Fader } from './Fader'

export const PresetFaders = (props: { faders: Array<DatabaseFader> }) => {
	const oscDatastore = useAppSelector(state => (state.oscDatastore ? state.oscDatastore : false))
	const deviceType = useAppSelector(state => (state.database ? state.database.config.osc.OSCMixerType : false))
	if (oscDatastore && deviceType && oscDatastore.status) {
		return (
			<>
				{props.faders.map(fader => {
					const faderString = faderArrayToString(fader.type, fader.channel, deviceType)
					return (
						<div key={fader.id}>
							<Group position="left" mt="md">
								<Title order={4} key={'title' + fader.id}>
									{fader.name}
								</Title>
								{typeof oscDatastore.faderMutes[faderString] !== 'undefined' &&
								oscDatastore.faderMutes[faderString] === false ? (
									<Badge color="red" size="md" radius="xs" variant="outline">
										Muted
									</Badge>
								) : (
									''
								)}
							</Group>
							<Fader
								disabled={!fader.enabled}
								key={'fader' + fader.id}
								meterValue={
									oscDatastore.metering !== false &&
									typeof oscDatastore.metering[faderString] !== 'undefined'
										? Math.floor(oscDatastore.metering[faderString] * 100)
										: null
								}
								value={
									typeof oscDatastore.faderValues[faderString] !== 'undefined'
										? Math.floor(oscDatastore.faderValues[faderString] * 100)
										: false
								}
								onChange={val =>
									ApiCall.post('/faders', {
										address: '/' + faderString + '/mix/fader',
										value: val / 100,
									})
								}
							/>
						</div>
					)
				})}
			</>
		)
	} else if (oscDatastore && !oscDatastore.status && props.faders.length > 0)
		return (
			<Alert icon={<FaExclamationTriangle />} title="Faders Unavailable" variant="outline">
				Could not connect to the sound system to get fader status
			</Alert>
		)
	else return <></>
}
