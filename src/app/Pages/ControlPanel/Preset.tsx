import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { DatabasePresetFolder } from './../../../database/repository/presetFolder'
import { Button, Paper } from '@mantine/core'
import { FaLevelUpAlt } from '@react-icons/all-files/fa/FaLevelUpAlt'
import { DangerouslySetHTML } from './../../Components/DangerouslySetHTML'
import { pickTextColorBasedOnBgColor } from './../../apis/utilities/pickOppositeTextColor'
import { useAppSelector } from './../../apis/redux/mainStore'
import { ApiCall } from './../../apis/wrapper'
import { PresetFolderIconReact } from './../../Components/ControlPanel/PresetFolderIcon'
const PresetButton = ({ text, presetId, color }: { text: string; presetId: number; color: string }) => {
	return (
		<Button
			variant="default"
			sx={() => ({
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
	icon,
}: {
	text: string
	folderId: number
	backButton: boolean
	icon: string
}) => (
	<Link to={'/controlPanel/presetFolder/' + folderId.toString()}>
		<Button
			variant="default"
			color="dark"
			size="xl"
			mx="xs"
			my="xs"
			leftIcon={backButton ? <FaLevelUpAlt /> : <PresetFolderIconReact icon={icon} />}
		>
			{text}
		</Button>
	</Link>
)

export const PresetPage = () => {
	const { folderId } = useParams<{ folderId: string }>()
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
					icon={presetFolder.parent.icon}
					backButton={true}
				/>
			) : (
				''
			)}
			{presetFolder && presetFolder.infoText ? (
				<Paper px="md" py="xs">
					<DangerouslySetHTML html={presetFolder.infoText} />
				</Paper>
			) : (
				''
			)}
			{presetFolder
				? presetFolder.children.map(presetFolder => (
						<PresetFolderButton
							folderId={presetFolder.id}
							icon={presetFolder.icon}
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
