import React, { useCallback, useState } from 'react'
import { DangerouslySetHTML } from '../../Components/DangerouslySetHTML'
import { useAppSelector } from '../../apis/redux/mainStore'
import { Button, Text, Group } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { FaCogs } from '@react-icons/all-files/fa/FaCogs'
import { useModals } from '@mantine/modals'
import { useEventListener, useViewportSize } from '@mantine/hooks'
import { QRCodeSVG } from 'qrcode.react'
import { OSCConnectionStatus } from '../../Components/ControlPanel/OSCConnectionStatus'

const ShowAccessDetails = () => {
	const [count, setCount] = useState(0)
	const { width } = useViewportSize()
	const increment = useCallback(() => setCount(c => c + 1), [])
	const ref = useEventListener('click', increment)
	const ipAddress = useAppSelector(state => (state.database ? state.database.about.ipAddress : null))
	const port = useAppSelector(state => (state.database ? state.database.about.port : false))
	if (count >= 5) {
		return (
			<>
				<Text size="sm" my={'lg'}>
					To access the setup and administration area, ensure you are on the same network as this device and
					then navigate to http://{ipAddress + ':' + port ?? ''} with a web browser
				</Text>
				<QRCodeSVG
					value={'http://' + ipAddress + ':' + port ?? ''}
					bgColor="#000000"
					fgColor="#FFFFFF"
					level={'M'}
					size={width / 4}
					includeMargin={false}
				/>
			</>
		)
	} else {
		return (
			<Text
				size="sm"
				ref={ref}
				style={{ userSelect: 'none', MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
			>
				The setup and administration area has been disabled by your administrator
			</Text>
		)
	}
}
export const HelpPage = () => {
	const helpText = useAppSelector(state => (state.database ? state.database.config.general.helpText : ''))
	const showButton = useAppSelector(state =>
		state.database ? state.database.config.general.adminLinkFromControlPanel : false
	)
	const modals = useModals()
	const navigate = useNavigate()
	const navigateToAdmin = () => {
		if (showButton) {
			modals.openConfirmModal({
				title: 'Setup & Administration Menu',
				children: (
					<Text size="sm">Are you sure you wish to continue into the administration and setup area?</Text>
				),
				labels: { confirm: 'Proceed', cancel: 'Cancel' },
				onConfirm: () => navigate('/admin/controls'),
			})
		} else {
			modals.openModal({
				title: 'Setup & Administration Menu',
				children: <ShowAccessDetails />,
			})
		}
	}
	return (
		<>
			<DangerouslySetHTML html={helpText} />
			<Group position="left" mt="md">
				<Button variant="default" my={'md'} leftIcon={<FaCogs />} onClick={() => navigateToAdmin()}>
					Setup and Administration Menu
				</Button>
				<OSCConnectionStatus />
			</Group>
		</>
	)
}
