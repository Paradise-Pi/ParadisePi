import React, { useEffect, useState } from 'react'
import { useForm } from '@mantine/form'
import { Checkbox, Button, Box, Divider, Loader, NumberInput, LoadingOverlay, Title, Text } from '@mantine/core'
import { useAppSelector } from '../../../apis/redux/mainStore'
import { FaRegClock } from '@react-icons/all-files/fa/FaRegClock'
import { ApiCall } from '../../../apis/wrapper'
import { runningInElectron } from '../../../apis/utilities/version'
import { RichTextEditor } from '@mantine/rte'

export const GeneralConfigurationPage = () => {
	const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
	const generalConfig = useAppSelector(state => (state.database ? state.database.config.general : false))
	const form = useForm({
		initialValues: {
			deviceLock: false,
			timeoutTime: 0,
			helpText: '', // This will never be shown - see below
			adminLinkFromControlPanel: false,
		},

		validate: {
			timeoutTime: value => (value > 3 ? null : 'Must be more than 3 seconds'),
		},
	})
	useEffect(() => {
		if (generalConfig !== false) {
			form.setValues({
				deviceLock: generalConfig.deviceLock,
				timeoutTime: generalConfig.timeoutTime / 1000,
				helpText: generalConfig.helpText, // This is ignored - see below
				adminLinkFromControlPanel: generalConfig.adminLinkFromControlPanel,
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalConfig])
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
	if (!generalConfig) return <Loader variant="bars" />
	return (
		<Box sx={{ maxWidth: 400 }} mx="auto">
			<LoadingOverlay visible={loadingOverlayVisible} transitionDuration={0} />
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Button type="submit">Save</Button>
				<Divider my="sm" />
				<Checkbox
					mt="md"
					size="lg"
					label="Lock the control panel"
					{...form.getInputProps('deviceLock', { type: 'checkbox' })}
					disabled={runningInElectron()}
				/>
				{/* You can't set the lock whilst in electron as it would cause a condition where you can lock yourself out but never get in again */}
				<Divider my="sm" />
				<Checkbox
					mt="md"
					my="md"
					size="lg"
					label="Show admin button in Control Panel"
					{...form.getInputProps('adminLinkFromControlPanel', { type: 'checkbox' })}
				/>
				<NumberInput
					required
					label="Screensaver Time"
					description="How long to wait in seconds before showing the screensaver"
					size="lg"
					placeholder="120 seconds"
					min={3}
					icon={<FaRegClock />}
					{...form.getInputProps('timeoutTime')}
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
					) : null /* Slight hack because the RichTextEditor doesn't accept value changes - only the one given when rendered */
				}
			</form>
		</Box>
	)
}
