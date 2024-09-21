import { Box, Button, Checkbox, Loader, LoadingOverlay, MultiSelect } from '@mantine/core'
import { useForm } from '@mantine/form'
import { FaSave } from '@react-icons/all-files/fa/FaSave'
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../../apis/redux/mainStore'
import { ApiCall } from '../../../apis/wrapper'

export const HistoryConfigurationPage = () => {
	const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
	const historyConfig = useAppSelector(state => (state.database ? state.database.config.history : false))
	const form = useForm({
		initialValues: {
			historyEnabled: false,
			historyLogParameters: [] as string[],
		},
		validate: {
			historyLogParameters: value => (true ? null : 'Must be a valid IPv4 address'),
		},
	})
	useEffect(() => {
		if (historyConfig !== false) {
			form.setValues({
				historyEnabled: historyConfig.historyEnabled,
				historyLogParameters: historyConfig.historyLogParameters,
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [historyConfig])
	const handleSubmit = (values: typeof form.values) => {
		setLoadingOverlayVisible(true)
		const valuesForApi = {
			historyEnabled: values.historyEnabled,
			historyLogParameters: values.historyLogParameters.join(','),
		}
		ApiCall.post('/config', valuesForApi).then(() => {
			setLoadingOverlayVisible(false)
		})
	}
	if (!historyConfig) return <Loader variant="bars" />
	return (
		<Box sx={{ maxWidth: 400 }} mx="auto">
			<LoadingOverlay visible={loadingOverlayVisible} transitionDuration={0} />
			<a
				href={`http://${sessionStorage.getItem('paradiseServerAddress') || window.location.host}/history-logs`}
				
			>
				<Button variant="default" color="dark" my="xs">
					Download History
				</Button>
			</a>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Button type="submit" leftIcon={<FaSave />}>
					Save
				</Button>
				<Checkbox
					mt="md"
					my="md"
					size="lg"
					label="History recording enabled"
					description="This will enable the history feature, which user events selected below. This will increase the load on the system storage, and changing this option will restart Paradise."
					{...form.getInputProps('historyEnabled', { type: 'checkbox' })}
				/>
				<MultiSelect
					mt="md"
					my="md"
					size="lg"
					label="Events to record"
					description="Select the types of event to record. This does not have any effect on events already recorded."
					data={[
						{ value: 'preset', label: 'Preset - triggered by user', group: 'Preset' },
						{ value: 'osc-fader', label: 'Fader' },
						{ value: 'e131-value', label: 'Manual sACN Value Change' },
						{ value: 'http-trigger-preset', label: 'HTTP Trigger Preset' },
						{ value: 'http-trigger-preset-fail', label: 'HTTP Trigger Preset - Failures' },
						{ value: 'preset-internal', label: 'Preset - triggered internally', group: 'Preset' },
						{ value: 'preset-timeclocktrigger', label: 'Preset - triggered on schedule', group: 'Preset' },
					]}
					{...form.getInputProps('historyLogParameters')}
				/>
			</form>
		</Box>
	)
}
