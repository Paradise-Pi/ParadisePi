import React from 'react'
import { FaCheck } from '@react-icons/all-files/fa/FaCheck'
import { FaTimes } from '@react-icons/all-files/fa/FaTimes'
import { useAppSelector } from './../../apis/redux/mainStore'
import { Button, Tooltip } from '@mantine/core'

export const OSCConnectionStatus = () => {
	const oscEnabled = useAppSelector(state => (state.database ? state.database.config.osc.OSCEnabled : false))
	const oscMixerName = useAppSelector(state => (state.oscDatastore ? state.oscDatastore.mixerName : false))
	const oscConnected = useAppSelector(state => (state.oscDatastore ? state.oscDatastore.status : false))
	if (oscEnabled)
		return (
			<Tooltip label={'Connected to ' + oscMixerName} disabled={!oscConnected} withArrow radius={'xs'}>
				<Button variant="default" my={'md'} leftIcon={oscConnected ? <FaCheck /> : <FaTimes />}>
					{oscConnected ? 'Sound System is connected' : 'Sound System is not connected'}
				</Button>
			</Tooltip>
		)
	else return <></>
}
