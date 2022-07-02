import React from 'react'
import { Title } from '@mantine/core'
import { useAppSelector } from './../../apis/redux/mainStore'
import { Fader } from './../../Components/ControlPanel/Fader'
import { DatabaseFader } from './../../../database/repository/fader'

export const PresetFaders = (props: { faders: Array<DatabaseFader> }) => {
	const oscDatastore = useAppSelector(state => (state.oscDatastore ? state.oscDatastore : false))
	if (oscDatastore) {
		console.log(oscDatastore)
	}
	return (
		<>
			{props.faders.map(fader => (
				<>
					<Title order={4} key={'title' + fader.id}>
						{fader.name}
					</Title>
					<Fader
						disabled={!fader.enabled}
						key={'fader' + fader.id}
						meterValue={Math.floor(Math.random() * 100)}
						value={Math.floor(Math.random() * 100)}
						onChange={val => {
							console.log(val)
						}}
					/>
				</>
			))}
		</>
	)
}
