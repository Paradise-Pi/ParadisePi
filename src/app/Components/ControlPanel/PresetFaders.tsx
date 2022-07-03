import React from 'react'
import { Badge, Group, Title } from '@mantine/core'
import { useAppSelector } from './../../apis/redux/mainStore'
import { Fader } from './../../Components/ControlPanel/Fader'
import { DatabaseFader } from './../../../database/repository/fader'
import { faderArrayToString } from './../../../output/osc/faderFunctions'
import { ApiCall } from './../../apis/wrapper'

export const PresetFaders = (props: { faders: Array<DatabaseFader> }) => {
	const oscDatastore = useAppSelector(state => (state.oscDatastore ? state.oscDatastore : false))
	const deviceType = useAppSelector(state => (state.database ? state.database.config.osc.OSCMixerType : false))
	if (oscDatastore) {
		console.log(oscDatastore)
	}
	if (oscDatastore && deviceType) {
		return (
			<>
				{props.faders.map(fader => {
					const faderString = faderArrayToString(fader.type, fader.channel, deviceType)
					console.log(
						typeof oscDatastore.faderValues[faderString] !== 'undefined'
							? Math.floor(oscDatastore.faderValues[faderString] * 100)
							: false,
						faderString
					)
					return (
						<>
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
								onChange={val => {
									ApiCall.post('/faders', {
										address: '/' + faderString + '/mix/fader',
										value: val / 100,
									})
								}}
							/>
						</>
					)
				})}
			</>
		)
	} else return <></>
}
