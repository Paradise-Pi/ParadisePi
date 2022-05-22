import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiCall } from './../../Apis/wrapper'
import { DatabasePresetFolder } from './../../../database/repository/presetFolder'
import { Button } from '@mantine/core'
import { FaLevelUpAlt, FaFolder } from 'react-icons/fa'
import { pickTextColorBasedOnBgColor } from './../../Apis/pickOppositeTextColor'
const PresetButton = ({ text, presetId, color }: { text: string; presetId: number; color: string }) => {
	return (
		<Button
			variant="default"
			sx={theme => ({
				backgroundColor: color,
				'&:hover': { backgroundColor: color },
				color: pickTextColorBasedOnBgColor(color),
			})}
			size="xl"
			mx="xs"
			my="xs"
		>
			{text}
		</Button>
	)
}
const PresetFolderButton = ({
	text,
	folderId,
	backButton,
}: {
	text: string
	folderId: number
	backButton: boolean
}) => {
	return (
		<Link to={'/controlPanel/presetFolder/' + folderId.toString()}>
			<Button
				variant="default"
				color="dark"
				size="xl"
				mx="xs"
				my="xs"
				leftIcon={backButton ? <FaLevelUpAlt /> : <FaFolder />}
			>
				{text}
			</Button>
		</Link>
	)
}
export const PresetPage = () => {
	const { folderId } = useParams()
	const [presetFolder, setPresetFolder] = useState<DatabasePresetFolder | false>(false)
	useEffect(() => {
		ApiCall.get(`/presetFolders`, { presetFolderId: folderId }).then(response => {
			setPresetFolder(response.data)
		})
	}, [folderId])
	return (
		<>
			{presetFolder && presetFolder.parent !== null ? (
				<PresetFolderButton
					folderId={presetFolder.parent.id}
					text={presetFolder.parent.name}
					backButton={true}
				/>
			) : (
				''
			)}
			{presetFolder
				? presetFolder.children.map(presetFolder => (
						<PresetFolderButton
							folderId={presetFolder.id}
							key={presetFolder.id}
							text={presetFolder.name}
							backButton={false}
						/>
				  ))
				: ''}
			{presetFolder
				? presetFolder.presets.map(preset =>
						preset.enabled ? (
							<PresetButton
								presetId={preset.id}
								key={preset.id}
								text={preset.name}
								color={preset.color}
							/>
						) : (
							''
						)
				  )
				: ''}
		</>
	)
}
