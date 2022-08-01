import React, { useState } from 'react'
import { Alert, Blockquote, Button, Divider, Modal, Container, ScrollArea } from '@mantine/core'
import { runningInElectron } from '../../../apis/utilities/version'
import { FaExclamationTriangle } from '@react-icons/all-files/fa/FaExclamationTriangle'
import { useAppSelector } from './../../../apis/redux/mainStore'
import { Prism } from '@mantine/prism'
import { useViewportSize } from '@mantine/hooks'

const Logs = () => {
	const { width } = useViewportSize()
	const logs = useAppSelector(state => state.logs.logs)
	return (
		<Container size={width}>
			<Prism
				withLineNumbers
				language="json"
				copyLabel="Copy code to clipboard"
				copiedLabel="Code copied to clipboard"
				noCopy={runningInElectron()}
			>
				{logs.map(logLine => JSON.stringify(JSON.parse(logLine), null, 2)).join('\n')}
			</Prism>
		</Container>
	)
}
const Database = () => {
	const [showModal, setShowModal] = useState(false)
	if (runningInElectron())
		return <Blockquote icon={null}>To backup or reset the database, please use the web interface.</Blockquote>
	return (
		<>
			<a href="/database/download" target="_blank">
				<Button variant="default" color="dark" size="md" mx="xs" my="xs">
					Download Database Backup
				</Button>
			</a>
			<Button variant="default" color="dark" size="md" mx="xs" my="xs" onClick={() => setShowModal(true)}>
				Upload new Database
			</Button>
			<Modal onClose={() => setShowModal(false)} opened={showModal} title="Upload new Database">
				<Alert icon={<FaExclamationTriangle />} title="Danger" color="gray" my="sm">
					Ensure you are uploading a valid backup file from Paradise as this file will not be checked to
					ensure it is a valid backup file - if this is not a backup file, you will lose all data and will
					have to uninstall Paradise and install it again. Please also ensure no other users are currently
					using the system, as all lighting and sound will be lost.
				</Alert>
				<form action="/database/upload" method="post" encType="multipart/form-data">
					<input type="file" name="fileupload" accept=".sqlite,.sqlite3" />
					<Button type="submit" color="red">
						Upload
					</Button>
				</form>
			</Modal>
			<a href="/logs" target="_blank">
				<Button variant="default" color="dark" size="md" mx="xs" my="xs">
					Download Logs
				</Button>
			</a>
		</>
	)
}
export const DatabaseAndLogsConfigurationPage = () => {
	const { height } = useViewportSize()
	return (
		<ScrollArea style={{ height: height - 80 }} type="auto" offsetScrollbars>
			<Database />
			<Divider my={'sm'} label="Live Logging" labelPosition="center" />
			<Logs />
		</ScrollArea>
	)
}
