import React, { useEffect, useState } from 'react'
import { useForm } from '@mantine/form'
import { Checkbox, Button, Box, Divider, Loader, LoadingOverlay, Title, Text, PasswordInput } from '@mantine/core'
import { useAppSelector } from '../../../apis/redux/mainStore'
import { ApiCall } from '../../../apis/wrapper'
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
			adminPin: '',
			remotePassword: '',
			fullscreen: false,
		},
		validate: {
			adminPin: value => (value == '' ? null : /^\d+$/.test(value) ? null : 'Invalid pin'),
		},
	})
	useEffect(() => {
		if (generalConfig !== false) {
			form.setValues({
				deviceLock: generalConfig.deviceLock,
				helpText: generalConfig.helpText, // This is ignored - see below
				adminLinkFromControlPanel: generalConfig.adminLinkFromControlPanel,
				adminPin: generalConfig.adminPin,
				remotePassword: generalConfig.remotePassword,
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
		<Box sx={{ maxWidth: 380 }} mx="auto">
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
					disabled={!form.values.deviceLock}
				/>
				{/* You can't set the lock or hide the admin button whilst in electron as it would cause a condition where you can lock yourself out but never get in again */}
				<Checkbox
					mt="md"
					my="md"
					size="lg"
					label="Fullscreen mode (requires restart)"
					{...form.getInputProps('fullscreen', { type: 'checkbox' })}
				/>
				<Divider my="sm" />
				<PasswordInput
					mt="md"
					size="lg"
					label="Remote access password"
					description="Leave the box empty to not require a password when accessing Paradise from another device on the same network."
					autoComplete="off"
					{...form.getInputProps('remotePassword')}
				/>
				<PasswordInput
					mt="md"
					size="lg"
					label="Setup & Administration Menu Pin"
					description="Leave the box empty to not require a pin when accessing the Administration Menu."
					autoComplete="off"
					{...form.getInputProps('adminPin')}
				/>
				<Checkbox
					mt="md"
					my="md"
					size="lg"
					label="Allow access from Control Panel to Admin"
					{...form.getInputProps('adminLinkFromControlPanel', { type: 'checkbox' })}
				/>
				<Divider my="sm" />
				<Title order={5}>Help Page</Title>
				<Text my="md">Text to display on the help page</Text>
				<RichTextEditor
					value={form.values.helpText}
					id="rte"
					onChange={(value: string) => form.setFieldValue('helpText', value)}
					controls={[
						['bold', 'italic', 'underline', 'strike'],
						['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
						['unorderedList', 'orderedList'],
						['sup', 'sub', 'blockquote', 'clean'],
						['alignLeft', 'alignCenter', 'alignRight'],
					]}
					sticky={true}
				/>
			</form>
		</Box>
	)
}
