import React, { useState } from 'react'
import { Alert, Blockquote, Button, Modal, Text } from '@mantine/core'
import { runningInElectron } from '../../../apis/utilities/version'
import { FaExclamationTriangle } from '@react-icons/all-files/fa/FaExclamationTriangle'

export const DatabaseConfigurationPage = () => {
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
					<input className="form-control" type="file" name="file" accept=".sqlite,.sqlite3" />
					<Button type="submit" color="red">
						Upload
					</Button>
				</form>
			</Modal>
		</>
	)
}
