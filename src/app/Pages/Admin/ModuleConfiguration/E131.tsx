import {
	Box,
	Button,
	Divider,
	Loader,
	LoadingOverlay,
	TextInput,
	Checkbox,
	NumberInput,
	Text,
	ScrollArea,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useEffect, useState } from 'react'
import { ApiCall } from '../../../apis/wrapper'
import { useAppSelector } from '../../../apis/redux/mainStore'
import { FaIdBadge } from '@react-icons/all-files/fa/FaIdBadge'
import { FaPlay } from '@react-icons/all-files/fa/FaPlay'
import { FaClipboardList } from '@react-icons/all-files/fa/FaClipboardList'
import { FaCrown } from '@react-icons/all-files/fa/FaCrown'
import { FaWaveSquare } from '@react-icons/all-files/fa/FaWaveSquare'
import { FaRegClock } from '@react-icons/all-files/fa/FaRegClock'
import { useModals } from '@mantine/modals'
import { FaSave } from '@react-icons/all-files/fa/FaSave'
import { useViewportSize } from '@mantine/hooks'

export const E131ModuleConfigurationPage = () => {
	const { height } = useViewportSize()
	const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
	const modals = useModals()
	const e131Config = useAppSelector(state => (state.database ? state.database.config.e131 : false))
	const form = useForm({
		initialValues: {
			e131Enabled: false,
			e131FirstUniverse: 0,
			e131Universes: 0,
			e131SourceName: '',
			e131Priority: 0,
			e131Frequency: 0,
			e131FadeTime: 0,
			e131Sampler_time: 0,
			e131Sampler_effectMode: 0,
		},
		validate: {
			e131SourceName: value => (value.length > 5 ? null : 'Must be longer than 5 characters'),
		},
	})
	useEffect(() => {
		if (e131Config !== false) {
			form.setValues({
				e131Enabled: e131Config.e131Enabled,
				e131FirstUniverse: e131Config.e131FirstUniverse,
				e131Universes: e131Config.e131Universes,
				e131SourceName: e131Config.e131SourceName,
				e131Priority: e131Config.e131Priority,
				e131Frequency: e131Config.e131Frequency,
				e131FadeTime: e131Config.e131FadeTime,
				e131Sampler_time: e131Config.e131Sampler_time,
				e131Sampler_effectMode: e131Config.e131Sampler_effectMode,
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [e131Config])
	const handleSubmit = (values: typeof form.values) => {
		modals.openConfirmModal({
			title: 'Are you sure you want to save?',
			centered: true,
			children: (
				<Text size="sm">Saving configuration will restart the sACN output - turning off all lighting</Text>
			),
			labels: { confirm: 'Save', cancel: 'Cancel' },
			confirmProps: { color: 'red' },
			onConfirm: () => {
				setLoadingOverlayVisible(true)
				ApiCall.post('/config', values).then(() => {
					setLoadingOverlayVisible(false)
				})
			},
		})
	}
	if (!e131Config) return <Loader variant="bars" />
	return (
		<ScrollArea style={{ height: height - 80 }} type="auto" offsetScrollbars>
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
						label="sACN (E1.31) Enabled"
						{...form.getInputProps('e131Enabled', { type: 'checkbox' })}
					/>
					<Divider my="sm" />
					<TextInput
						required
						label="Source Name"
						description="Name to give this device for identification purposes"
						size="lg"
						placeholder="Paradise Pi"
						icon={<FaIdBadge />}
						{...form.getInputProps('e131SourceName')}
					/>
					<NumberInput
						required
						label="First Universe"
						description="Paradise transmits in a block of universes from this number"
						size="lg"
						placeholder="1"
						min={1}
						icon={<FaPlay />}
						{...form.getInputProps('e131FirstUniverse')}
					/>
					<NumberInput
						required
						label="Number of universes"
						description="How many universes to transmit, starting with the number above"
						size="lg"
						placeholder="2"
						min={1}
						max={20}
						icon={<FaClipboardList />}
						{...form.getInputProps('e131Universes')}
					/>
					<NumberInput
						required
						label="sACN (E1.31) Priority"
						description="Priorities go from 1 to 200, where 200 is the most important"
						size="lg"
						placeholder="50"
						min={1}
						max={200}
						icon={<FaCrown />}
						{...form.getInputProps('e131Priority')}
					/>
					<NumberInput
						required
						label="sACN (E1.31) Frequency"
						description="Frequency in Hertz"
						size="lg"
						placeholder="5"
						min={1}
						max={8}
						icon={<FaWaveSquare />}
						{...form.getInputProps('e131Frequency')}
					/>
					<Divider my="sm" />
					<NumberInput
						required
						label="Sampler Time"
						description="How long (in seconds) should the sampler run for"
						size="lg"
						placeholder="15"
						min={5}
						max={120}
						icon={<FaRegClock />}
						{...form.getInputProps('e131Sampler_time')}
					/>
				</form>
			</Box>
		</ScrollArea>
	)
}
