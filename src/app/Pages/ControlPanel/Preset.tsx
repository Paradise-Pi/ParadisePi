import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { DatabasePresetFolder } from './../../../database/repository/presetFolder'
import { Button } from '@mantine/core'
import { FaLevelUpAlt } from '@react-icons/all-files/fa/FaLevelUpAlt'
import { FaFolder } from '@react-icons/all-files/fa/FaFolder'
import { pickTextColorBasedOnBgColor } from './../../apis/utilities/pickOppositeTextColor'
import { useAppSelector } from './../../apis/redux/mainStore'
import { ApiCall } from './../../apis/wrapper'
const PresetButton = ({ text, presetId, color }: { text: string; presetId: number; color: string }) => {
	return (
		<Button
			variant="default"
			sx={theme => ({
				backgroundColor: color,
				'&:hover': { backgroundColor: color },
				color: pickTextColorBasedOnBgColor(color),
			})}
			onClick={() => {
				ApiCall.get('/presets/recall/' + presetId, {})
			}}
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
	const { folderId } = useParams<{ folderId?: string }>()
	const presetFolders = useAppSelector(state => (state.database ? state.database.presetFolders : false))
	let presetFolder: DatabasePresetFolder | false = false
	if (presetFolders !== false) {
		presetFolder = presetFolders[parseInt(folderId)]
	}
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
