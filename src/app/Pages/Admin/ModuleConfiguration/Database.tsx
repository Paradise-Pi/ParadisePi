import React from 'react'
import { Blockquote, Button, Text } from '@mantine/core'
import { runningInElectron } from '../../../apis/utilities/version'

export const DatabaseConfigurationPage = () => {
	if (runningInElectron())
		return <Blockquote icon={null}>To backup or reset the database, please use the web interface.</Blockquote>
	return (
		<>
			<a href="/database/download" target="_blank">
				<Button variant="default" color="dark" size="md" mx="xs" my="xs">
					Download Database Backup
				</Button>
			</a>
			<p>
				Caution! Ensure you are uploading a valid backup file from Paradise. This file will not be checked
				before being set as the device config!
			</p>
			<form action="/database/upload" method="post" encType="multipart/form-data">
				<input className="form-control" type="file" name="file" accept=".sqlite,.sqlite3" />
				<button className="btn btn-sm btn-success" style={{ margin: '10px' }} type="submit">
					Upload
				</button>
			</form>
		</>
	)
}
