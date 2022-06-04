import { Box, Button, Divider, Loader, LoadingOverlay, NativeSelect, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { StrictMode, useEffect, useState } from 'react'
import { ApiCall } from './../../../apis/wrapper'
import { useAppSelector } from './../../../apis/redux/mainStore'

export const OSCModuleConfigurationPage = () => {
	const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
	const oscConfig = useAppSelector(state => (state.database ? state.database.config.osc : false))
	const form = useForm({
		initialValues: {
			oscTargetIP: '192.168.0.1',
			oscMixerType: 'xair',
		},
	})
	useEffect(() => {
		if (oscConfig !== false) {
			form.setValues({
				oscTargetIP: oscConfig.OSCTargetIP,
				oscMixerType: oscConfig.OSCMixerType,
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [oscConfig])
	const handleSubmit = (values: typeof form.values) => {
		setLoadingOverlayVisible(true)
		const payload = values as unknown as { [key: string]: string }
		Object.entries(values).map(async ([key, value]) => {
			if (key === 'deviceLock') {
				if (value) payload['deviceLock'] = 'LOCKED'
				else payload['deviceLock'] = 'UNLOCKED'
			} else if (key === 'adminLinkFromControlPanel') {
				if (value) payload['adminLinkFromControlPanel'] = 'true'
				else payload['adminLinkFromControlPanel'] = 'false'
			}
		})
		ApiCall.post('/config', values).then(() => {
			setLoadingOverlayVisible(false)
		})
	}
	if (!true) return <Loader variant="bars" />
	return (
		<StrictMode>
			<Box sx={{ maxWidth: 400}} mx="auto">
				<LoadingOverlay visible={loadingOverlayVisible} transitionDuration={0} />
				<form onSubmit={form.onSubmit(handleSubmit)} >
					<Button type="submit">Save</Button>
					<Divider my="sm" />
					<TextInput
						required
						label="Console OSC Address"
						placeholder="192.168.0.1"
						{...form.getInputProps('oscTargetIP')}
					/>
					<Divider my="sm" />
					<NativeSelect
						required
						placeholder="Select a Console"
						label="Console Type"
						data={[]}
					/>
				</form>
			</Box>
		</StrictMode>
	)
}
