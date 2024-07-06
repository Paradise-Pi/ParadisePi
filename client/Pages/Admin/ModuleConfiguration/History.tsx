import { Box, Button, Checkbox, Loader, LoadingOverlay } from '@mantine/core'
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
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Button type="submit" leftIcon={<FaSave />}>
					Save
				</Button>
				<Checkbox
					mt="md"
					my="md"
					size="lg"
					label="History recording enabled"
					description="This will enable the history feature, which logs all user actions. This will increase the load on the storage device running Paradise. Changing this option will restart Paradise."
					{...form.getInputProps('historyEnabled', { type: 'checkbox' })}
				/>
			</form>
			<a
				href={`http://${sessionStorage.getItem('paradiseServerAddress') || window.location.host}/history-logs`}
				target="_blank"
			>
				<Button variant="default" color="dark" size="md" mx="xs" my="xs">
					Download History
				</Button>
			</a>
		</Box>
	)
}
