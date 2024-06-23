import { Alert, Box, Button, Card, Group, Image, Loader, LoadingOverlay, Modal, NumberInput, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { FaFileImage } from '@react-icons/all-files/fa/FaFileImage'
import { FaRegClock } from '@react-icons/all-files/fa/FaRegClock'
import { FaSave } from '@react-icons/all-files/fa/FaSave'
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../../apis/redux/mainStore'
import { ApiCall } from '../../../apis/wrapper'

const ScreenSaverSettings = () => {
	const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
	const generalConfig = useAppSelector(state => (state.database ? state.database.config.general : false))
	const form = useForm({
		initialValues: {
			timeoutTime: 0,
		},
		validate: {
			timeoutTime: value => (value > 3 ? null : 'Must be more than 3 seconds'),
		},
	})
	useEffect(() => {
		if (generalConfig !== false) {
			form.setValues({
				timeoutTime: generalConfig.timeoutTime / 1000,
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalConfig])
	const handleSubmit = (values: typeof form.values) => {
		setLoadingOverlayVisible(true)
		const payload = values as unknown as { [key: string]: string }
		ApiCall.post('/config', payload).then(() => {
			setLoadingOverlayVisible(false)
		})
	}
	if (!generalConfig) return <Loader variant="bars" />
	return (
		<Box my="md">
			<LoadingOverlay visible={loadingOverlayVisible} transitionDuration={0} />
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<NumberInput
					required
					label="Screensaver Time"
					description="How long to wait in seconds before showing the screensaver"
					size="lg"
					placeholder="120 seconds"
					min={4}
					icon={<FaRegClock />}
					{...form.getInputProps('timeoutTime')}
				/>
				<Button type="submit" leftIcon={<FaSave />} my="md">
					Save
				</Button>
			</form>
		</Box>
	)
}
const UploadLogo = () => {
	const logo = useAppSelector(state => (state.images ? state.images.logo : false))
	const [showModal, setShowModal] = useState(false)
	return (
		<>
			<Card>
				<Card.Section
					style={{
						padding: 10,
					}}
				>
					<Image src={logo || null} fit="contain" height={200} withPlaceholder alt="Logo" />
				</Card.Section>
				<Group
					position="apart"
					sx={theme => ({
						marginTop: theme.spacing.sm,
					})}
				>
					<Text weight={500}>Logo</Text>
				</Group>

				<Text size="sm" style={{ lineHeight: 1.5 }}>
					Upload a logo to be shown in the screensaver
				</Text>
				<Button variant="default" color="dark" size="md" fullWidth my="xs" onClick={() => setShowModal(true)}>
					Upload logo
				</Button>
			</Card>

			<Modal onClose={() => setShowModal(false)} opened={showModal} title="Logo upload">
				<Alert icon={<FaFileImage />} color="gray" my="sm">
					Max file size 2MB
					<br /> Only JPEG and PNG can be uploaded
					<br /> Transparent images with light backgrounds work best
				</Alert>
				<form action="/logo/upload" method="post" encType="multipart/form-data">
					<input type="file" name="logo" accept=".jpg,.jpeg,.png" />
					<Button type="submit" color="red">
						Upload
					</Button>
				</form>
			</Modal>
		</>
	)
}
export const ScreensaverConfigurationPage = () => (
	<Box sx={{ maxWidth: 400 }} mx="auto">
		<UploadLogo />
		<ScreenSaverSettings />
	</Box>
)
