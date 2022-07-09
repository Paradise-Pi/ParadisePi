import React, { useEffect, useState } from 'react'
import { useForm } from '@mantine/form'
import { Checkbox, Button, Box, Divider, Loader, LoadingOverlay, Title, Text } from '@mantine/core'
import { useAppSelector } from '../../../apis/redux/mainStore'
import { ApiCall } from '../../../apis/wrapper'
import { runningInElectron } from '../../../apis/utilities/version'
import { RichTextEditor } from '@mantine/rte'
import { FaSave } from '@react-icons/all-files/fa/FaSave'

export const GeneralConfigurationPage = () => {
	const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
	const generalConfig = useAppSelector(state => (state.database ? state.database.config.general : false))
	const form = useForm({
		initialValues: {
			deviceLock: false,
			helpText: '', // This will never be shown - see below
			adminLinkFromControlPanel: false,
			fullscreen: false,
		},
	})
	useEffect(() => {
		if (generalConfig !== false) {
			form.setValues({
				deviceLock: generalConfig.deviceLock,
				helpText: generalConfig.helpText, // This is ignored - see below
				adminLinkFromControlPanel: generalConfig.adminLinkFromControlPanel,
				fullscreen: generalConfig.fullscreen,
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalConfig])
	const handleSubmit = (values: typeof form.values) => {
		setLoadingOverlayVisible(true)
		const payload = values as unknown as { [key: string]: string }
		Object.entries(payload).map(([key, value]) => {
			if (key === 'deviceLock') {
				if (value) payload['deviceLock'] = 'LOCKED'
				else payload['deviceLock'] = 'UNLOCKED'
			} else if (key === 'fullscreen' || key === 'adminLinkFromControlPanel') {
				if (value) payload[key] = 'true'
				else payload[key] = 'false'
			}
		})
		ApiCall.post('/config', payload).then(() => {
			setLoadingOverlayVisible(false)
		})
	}
	if (!generalConfig) return <Loader variant="bars" />
	return (
		<Box sx={{ maxWidth: 400 }} mx="auto">
			<LoadingOverlay visible={loadingOverlayVisible} transitionDuration={0} />
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Button type="submit" leftIcon={<FaSave />}>
					Save
				</Button>
				<Divider my="sm" />
				<Checkbox
					mt="md"
					size="lg"
					label="Lock the control panel"
					{...form.getInputProps('deviceLock', { type: 'checkbox' })}
					disabled={runningInElectron() && !form.values.deviceLock}
				/>
				{/* You can't set the lock or hide the admin button whilst in electron as it would cause a condition where you can lock yourself out but never get in again */}
				<Checkbox
					mt="md"
					my="md"
					size="lg"
					label="Allow access from Control Panel to Admin"
					{...form.getInputProps('adminLinkFromControlPanel', { type: 'checkbox' })}
				/>
				<Checkbox
					mt="md"
					my="md"
					size="lg"
					label="Fullscreen mode (requires restart)"
					{...form.getInputProps('fullscreen', { type: 'checkbox' })}
				/>
				<Divider my="sm" />
				<Title order={5}>Help Page</Title>
				<Text my="md">Text to display on the help page</Text>
				{
					generalConfig ? (
						<RichTextEditor
							value={generalConfig.helpText}
							onChange={form.getInputProps('helpText').onChange}
							controls={[
								['bold', 'italic', 'underline', 'strike'],
								['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
								['unorderedList', 'orderedList'],
								['sup', 'sub', 'blockquote', 'clean'],
								['alignLeft', 'alignCenter', 'alignRight'],
							]}
							sticky={true}
						/>
					) : null /* Slight hack because the RichTextEditor doesn't accept value changes - only the one given when rendered, so force a re-render */
				}
			</form>
		</Box>
	)
}
