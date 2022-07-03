import React, { useEffect, useState, forwardRef } from 'react'
import {
	Group,
	TextInput,
	Box,
	Button,
	Center,
	ActionIcon,
	Select,
	LoadingOverlay,
	SelectItem as MantineSelectItem,
	Avatar,
	Modal,
	Text,
	Table,
	Title,
} from '@mantine/core'
import { useForm, formList } from '@mantine/form'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { FaFolder } from '@react-icons/all-files/fa/FaFolder'
import { FaGripVertical } from '@react-icons/all-files/fa/FaGripVertical'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'
import { FormList } from '@mantine/form/lib/form-list/form-list'
import { useAppSelector } from './../../apis/redux/mainStore'
import { DatabaseFolder } from './../../../database/repository/folder'
import { ApiCall } from './../../apis/wrapper'
import { AvailableIcons, FolderIconReact } from './../../Components/ControlPanel/FolderIcon'
import { FaPencilAlt } from '@react-icons/all-files/fa/FaPencilAlt'
import { RichTextEditor } from '@mantine/rte'
import { FaSave } from '@react-icons/all-files/fa/FaSave'
import { FaPlus } from '@react-icons/all-files/fa/FaPlus'
import { showNotification } from '@mantine/notifications'
import { FaCheck } from '@react-icons/all-files/fa/FaCheck'

interface FormValues {
	folders: FormList<DatabaseFolder>
}
interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
	icon: string
	label: string
}
// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ icon, label, ...others }: ItemProps, ref) => (
	<div ref={ref} {...others}>
		<Group noWrap>
			<Avatar radius={'xs'} size={'md'}>
				<FolderIconReact icon={icon} />
			</Avatar>
			<div>
				<Text size="sm">{label}</Text>
			</div>
		</Group>
	</div>
))
export const FoldersConfigurationPage = () => {
	const [modalVisible, setModalVisible] = useState<number | false>(false)
	const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
	const [formOriginalValues, setFormOriginalValues] = useState<string>('') // Values used to detect unsaved changes
	const folders = useAppSelector(state => (state.database ? state.database.folders : false))
	const parentFoldersForSelect: Array<MantineSelectItem> = [{ value: null, label: 'None', group: 'Parent Folder' }]
	// Prepare folders list for select dropdown
	if (folders !== false) {
		Object.entries(folders)
			.sort(([, folderA], [, folderB]) => folderA.sort - folderB.sort)
			.forEach(([, value]) => {
				parentFoldersForSelect.push({
					value: value.id.toString(),
					label: value.name,
					group: 'Parent Folder',
				})
			})
	}
	// Setup the form
	const form = useForm<FormValues>({
		initialValues: {
			folders: formList([]),
		},
		validate: {
			folders: {
				name: value =>
					value.length < 1
						? 'Name should have at least 1 character'
						: value === 'None'
						? 'Name should not be "None"'
						: undefined,
			},
		},
	})
	useEffect(() => {
		if (folders !== false) {
			const formValues = {
				folders: formList(
					Object.entries(folders)
						.sort(([, folderA], [, folderB]) => folderA.sort - folderB.sort)
						.map(item => ({
							name: item[1].name,
							id: parseInt(item[0]),
							icon: item[1].icon,
							parentFolderId: item[1].parent ? item[1].parent.id.toString() : null,
							infoText: item[1].infoText ?? '',
						}))
				),
			}
			form.setValues(formValues) // Make a copy of the folders using map because the object is not extensible
			setFormOriginalValues(JSON.stringify(formValues))
			setLoadingOverlayVisible(false)
		} else if (!loadingOverlayVisible) setLoadingOverlayVisible(true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [folders])
	const saveByUserNeeded = formOriginalValues !== JSON.stringify(form.values) // Does the user have unsaved changes

	// Handle the submit button
	const handleSubmit = (values: typeof form.values) => {
		setLoadingOverlayVisible(true)
		ApiCall.put('/folders', values.folders).then(() => {
			showNotification({
				message: 'Your changes have been saved',
				autoClose: 2000,
				disallowClose: true,
				color: 'green',
				icon: <FaCheck />,
			})
		})
	}
	const fields = form.values.folders.map((_, index) => (
		<Draggable key={index} index={index} draggableId={index.toString()}>
			{provided => (
				<tr ref={provided.innerRef} {...provided.draggableProps}>
					<td>
						<Center {...provided.dragHandleProps}>
							<FaGripVertical />
						</Center>
					</td>
					<td>
						<TextInput placeholder="Name" {...form.getListInputProps('folders', index, 'name')} />
					</td>
					<td>
						<Select
							placeholder="Parent Folder"
							icon={<FaFolder />}
							// form.values.folders[index].folderId
							{...form.getListInputProps('folders', index, 'parentFolderId')}
							data={parentFoldersForSelect.filter((item: MantineSelectItem) => {
								return typeof form.values.folders[index].id !== undefined &&
									form.values.folders[index].id !== null &&
									item.value !== null
									? form.values.folders[index].id.toString() !== item.value
									: true
							})}
						/>
					</td>
					<td>
						<Select
							placeholder="Folder Icon"
							{...form.getListInputProps('folders', index, 'icon')}
							itemComponent={SelectItem}
							data={Object.entries(AvailableIcons).map(([value, name]) => ({
								value: value,
								icon: value,
								label: name,
							}))}
						/>
					</td>
					<td>
						<Modal
							opened={modalVisible === index}
							onClose={() => {
								setModalVisible(false)
							}}
							size="xl"
							title="Edit Folder Help Text"
							overflow="inside"
						>
							<Text my={'xs'}>
								Help Text is displayed at the top of a folder, and can be used to help explain the
								content of the folder to users
							</Text>
							{
								folders ? (
									<RichTextEditor
										value={form.getListInputProps('folders', index, 'infoText').value}
										onChange={form.getListInputProps('folders', index, 'infoText').onChange}
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
						</Modal>

						<ActionIcon variant="hover" onClick={() => setModalVisible(index)}>
							<FaPencilAlt />
						</ActionIcon>
					</td>
					<td>
						<ActionIcon color="red" variant="hover" onClick={() => form.removeListItem('folders', index)}>
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
				{folders !== false ? (
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<Group position="left" mt="md">
							<Title>Folders</Title>
							{saveByUserNeeded ? (
								<Button variant="outline" type="submit" leftIcon={<FaSave />}>
									Save
								</Button>
							) : null}
						</Group>
						<Table verticalSpacing="sm" fontSize="md">
							<thead>
								<tr>
									<th>
										<Button
											compact
											variant="default"
											onClick={() => {
												form.addListItem('folders', {
													id: null,
													name: '',
													parentFolderId: '',
												})
											}}
										>
											<FaPlus />
										</Button>
									</th>
									<th>Name</th>
									<th>Parent Folder</th>
									<th>Icon</th>
									<th></th>
									<th></th>
								</tr>
							</thead>
							<DragDropContext
								onDragEnd={({ destination, source }) =>
									form.reorderListItem('folders', {
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