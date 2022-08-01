import {
	Avatar,
	Box,
	Button,
	Divider,
	Group,
	Loader,
	LoadingOverlay,
	Select,
	TextInput,
	Text,
	Checkbox,
	ScrollArea,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useEffect, useState, forwardRef } from 'react'
import { ApiCall } from '../../../apis/wrapper'
import { useAppSelector } from '../../../apis/redux/mainStore'
import { BehringerLogo } from './ManufacturerIcons/Behringer'
import { MidasLogo } from './ManufacturerIcons/Midas'
import { FaSave } from '@react-icons/all-files/fa/FaSave'
import { useViewportSize } from '@mantine/hooks'

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
	image: React.ReactNode
	label: string
	description: string
}
// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ image, label, description, ...others }: ItemProps, ref) => (
	<div ref={ref} {...others}>
		<Group noWrap>
			<Avatar radius={'xs'} size={'lg'}>
				{image}
			</Avatar>
			<div>
				<Text size="sm">{label}</Text>
				<Text size="xs" color="dimmed">
					{description}
				</Text>
			</div>
		</Group>
	</div>
))
const validIPV4Regex =
	/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi

export const OSCModuleConfigurationPage = () => {
	const { height } = useViewportSize()
	const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
	const oscConfig = useAppSelector(state => (state.database ? state.database.config.osc : false))
	const form = useForm({
		initialValues: {
			OSCTargetIP: '',
			OSCMixerType: '',
			OSCEnabled: false,
		},
		validate: {
			OSCTargetIP: value => (validIPV4Regex.test(value) ? null : 'Must be a valid IPv4 address'),
		},
	})
	useEffect(() => {
		if (oscConfig !== false) {
			form.setValues({
				OSCTargetIP: oscConfig.OSCTargetIP,
				OSCMixerType: oscConfig.OSCMixerType,
				OSCEnabled: oscConfig.OSCEnabled,
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [oscConfig])
	const handleSubmit = (values: typeof form.values) => {
		setLoadingOverlayVisible(true)
		ApiCall.post('/config', values).then(() => {
			setLoadingOverlayVisible(false)
		})
	}
	if (!oscConfig) return <Loader variant="bars" />
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
						label="OSC Enabled"
						{...form.getInputProps('OSCEnabled', { type: 'checkbox' })}
					/>
					<Divider my="sm" />
					<TextInput
						required
						label="Device OSC Address"
						placeholder="192.168.0.1"
						size="lg"
						{...form.getInputProps('OSCTargetIP')}
					/>
					<Select
						required
						placeholder="Select a Device"
						label="Device Type"
						size="lg"
						{...form.getInputProps('OSCMixerType')}
						dropdownPosition="top"
						itemComponent={SelectItem}
						data={[
							{
								value: 'x32',
								label: 'Behringer X Series',
								image: <BehringerLogo />,
								description: 'X32 / X32 Compact / X32 Producer / X32 Core / X32 Rack',
							},
							{
								value: 'xair',
								label: 'Behringer X AIR Series',
								image: <BehringerLogo />,
								description: 'X18 / XR12 / XR16 / XR18',
							},
							{
								value: 'midas-m32',
								label: 'Midas M Series',
								image: <MidasLogo />,
								description: 'M32 Live / M32R Live / M32C / M32R',
							},
							{
								value: 'midas-xair',
								label: 'Midas MR Series',
								image: <MidasLogo />,
								description: 'MR18 / MR12',
							},
						]}
					/>
				</form>
			</Box>
		</ScrollArea>
	)
}
