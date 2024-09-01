import {
	ActionIcon,
	Box,
	Button,
	Center,
	Divider,
	Group,
	LoadingOverlay,
	Modal,
	Table,
	Text,
	Textarea,
	TextInput,
	Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { FaCheck } from '@react-icons/all-files/fa/FaCheck'
import { FaGripVertical } from '@react-icons/all-files/fa/FaGripVertical'
import { FaPencilAlt } from '@react-icons/all-files/fa/FaPencilAlt'
import { FaPlus } from '@react-icons/all-files/fa/FaPlus'
import { FaSave } from '@react-icons/all-files/fa/FaSave'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { DatabaseDevice } from '../../../shared/sharedTypes'
import { useAppSelector } from '../../apis/redux/mainStore'
import { usePrompt } from '../../apis/utilities/usePrompt'
import { ApiCall } from '../../apis/wrapper'
interface FormValues {
	devices: Array<DatabaseDevice>
}
export const DevicesConfigurationPage = () => {
	const [modalVisible, setModalVisible] = useState<number | false>(false)
	const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
	const ipAddress = useAppSelector(state => (state.database ? state.database.about.ipAddress : null))
	const port = useAppSelector(state => (state.database ? state.database.about.port : false))
	const [formOriginalValues, setFormOriginalValues] = useState<string>('') // Values used to detect unsaved changes
	const devices = useAppSelector(state => (state.database ? state.database.devices : false))
	// Setup the form
	const form = useForm<FormValues>({
		initialValues: {
			devices: [],
		},
		clearInputErrorOnChange: true,
		validateInputOnBlur: true,
		validate: {
			devices: {
				name: value => (value.length < 2 ? 'Name should have at least 2 letters' : null),
				ip: (value, values, path) => {
					if (value == null || value.length < 1) return null

					// Check if the same device has an endpoint set
					if (values.devices[path.split('.')[1]].endpoint.length > 0)
						return 'Cannot have both an IP address and an endpoint'

					// Check for duplicates
					const duplicate = values.devices.findIndex(
						(item, index) => item.ip === value && index !== parseInt(path.split('.')[1])
					)
					if (duplicate !== -1) return 'IP address used by another device'

					if (
						/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
							value
						)
					)
						return null
					else return 'IPv4 address not valid'
				},
				endpoint: (value, values, path) => {
					if (value == null || value.length < 1) return null

					// Check if the same device has an IP set
					if (values.devices[path.split('.')[1]].ip.length > 0)
						return 'Cannot have both an IP address and an endpoint'

					return value.startsWith('https://') || value.startsWith('http://') ? null : 'Endpoint not valid'
				},
			},
		},
	})
	useEffect(() => {
		// Normally called when the database is populated and ready, so we can populate the form
		if (devices !== false) {
			const formValues = { devices: devices.map(item => ({ ...item })) } // Make a copy of the object using map because the object is not extensible
			form.setValues(formValues)
			setFormOriginalValues(JSON.stringify(formValues))
			setLoadingOverlayVisible(false)
		} else if (!loadingOverlayVisible) setLoadingOverlayVisible(true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [devices])
	const saveByUserNeeded = formOriginalValues !== JSON.stringify(form.values) // Does the user have unsaved changes
	usePrompt(saveByUserNeeded ? 'You have unsaved changes, are you sure you want to leave this page?' : false)

	// Handle the submit button
	const handleSubmit = (values: FormValues) => {
		setLoadingOverlayVisible(true)
		ApiCall.put('/devices', values.devices).then(() => {
			showNotification({
				message: 'Your changes have been saved',
				autoClose: 2000,
				disallowClose: true,
				color: 'green',
				icon: <FaCheck />,
			})
		})
	}

	const fields = form.values.devices.map((_, index) => (
		<Draggable key={index} index={index} draggableId={index.toString()}>
			{provided => (
				<tr ref={provided.innerRef} {...provided.draggableProps}>
					<td>
						<Center {...provided.dragHandleProps}>
							<FaGripVertical />
						</Center>
					</td>
					<td>
						<TextInput placeholder="Name" {...form.getInputProps(`devices.${index}.name`)} />
					</td>
					<td>
						<TextInput placeholder="192.168.1.30" {...form.getInputProps(`devices.${index}.ip`)} />
					</td>
					<td>
						<TextInput
							placeholder="https://api.sendgrid.com/v3/"
							{...form.getInputProps(`devices.${index}.endpoint`)}
						/>
					</td>
					<td>
						<Modal
							opened={modalVisible === index}
							onClose={() => {
								setModalVisible(false)
							}}
							size="xl"
							title={`Edit Device ${form.values.devices[index].name}`}
							overflow="inside"
						>
							<Textarea label="Device Notes" {...form.getInputProps(`devices.${index}.notes`)} />
							<Divider labelPosition="center" label="Status Check" my="lg" />
							<TextInput
								label="Path to Check"
								placeholder="/v3/ping"
								description="The path to make a HTTP GET request to to check for the status of the device."
								{...form.getInputProps(`devices.${index}.statusCheckPath`)}
							/>
							<TextInput
								label="String to Match"
								placeholder="pong"
								description="The string to match in the response to determine if the device is online. If the response does not contain this string then the device will be marked as offline."
								{...form.getInputProps(`devices.${index}.statusCheckString`)}
							/>
							{form.values.devices[index].id ? (
								<TextInput
									label="Status Check API URL"
									description="Page returns OK or OFFLINE based on the status check"
									readOnly={true}
									value={
										'http://' +
										ipAddress +
										':' +
										port +
										'/monitoring/device/' +
										form.values.devices[index].id
									}
								/>
							) : null}
						</Modal>
						<ActionIcon variant="transparent" onClick={() => setModalVisible(index)}>
							<FaPencilAlt />
						</ActionIcon>
					</td>
					<td>
						<ActionIcon
							color="red"
							variant="transparent"
							onClick={() => form.removeListItem('devices', index)}
						>
							<FaTrash />
						</ActionIcon>
					</td>
				</tr>
			)}
		</Draggable>
	))

	return (
		<Box mx="lg">
			<div style={{ position: 'relative' }}>
				<LoadingOverlay visible={loadingOverlayVisible} transitionDuration={0} />
				{devices !== false ? (
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<Group position="left" mt="md">
							<Title>Devices</Title>
							{saveByUserNeeded ? (
								<Button variant="outline" type="submit" leftIcon={<FaSave />}>
									Save
								</Button>
							) : null}
						</Group>
						<Text>
							Devices are used for making HTTP requests in presets, allowing you to store the IP
							address/host of the device in one place. It also allows you to monitor the status of a
							device.
						</Text>
						<Table verticalSpacing="sm" fontSize="md">
							<thead>
								<tr>
									<th>
										<Button
											compact
											variant="default"
											onClick={() => {
												form.insertListItem('devices', {
													id: null,
													name: 'New device',
													ip: '',
													endpoint: '',
													statusCheckPath: '',
													statusCheckString: '',
													notes: '',
												})
											}}
										>
											<FaPlus />
										</Button>
									</th>
									<th>Name</th>
									<th>IP Address</th>
									<th>or, Endpoint</th>
									<th></th>
									<th></th>
								</tr>
							</thead>
							<DragDropContext
								onDragEnd={({ destination, source }) =>
									form.reorderListItem('devices', {
										from: source.index,
										to: destination.index,
									})
								}
							>
								<Droppable droppableId="dnd-list" direction="vertical">
									{provided => (
										<tbody {...provided.droppableProps} ref={provided.innerRef}>
											{fields}
											{provided.placeholder}
										</tbody>
									)}
								</Droppable>
							</DragDropContext>
						</Table>
					</form>
				) : (
					'Loading'
				)}
			</div>
		</Box>
	)
}
