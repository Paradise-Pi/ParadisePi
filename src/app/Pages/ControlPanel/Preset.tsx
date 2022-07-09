import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DatabaseFolder } from './../../../database/repository/folder'
import { Button, Paper } from '@mantine/core'
import { FaLevelUpAlt } from '@react-icons/all-files/fa/FaLevelUpAlt'
import { DangerouslySetHTML } from './../../Components/DangerouslySetHTML'
import { pickTextColorBasedOnBgColor } from './../../apis/utilities/pickOppositeTextColor'
import { useAppSelector } from './../../apis/redux/mainStore'
import { ApiCall } from './../../apis/wrapper'
import { FolderIconReact } from './../../Components/ControlPanel/FolderIcon'
import { PresetFaders } from './../../Components/ControlPanel/PresetFaders'
const PresetButton = ({ text, presetId, color }: { text: string; presetId: number; color: string }) => {
	const navigate = useNavigate()

	return (
		<Button
			variant="default"
			sx={() => ({
				backgroundColor: color,
				'&:hover': { backgroundColor: color },
				color: pickTextColorBasedOnBgColor(color),
			})}
			onClick={() => {
				ApiCall.get('/presets/recall/' + presetId, {}).then(value => {
					if (value.redirect) {
						navigate(value.redirect)
					}
				})
			}}
			size="xl"
			mx="xs"
			my="xs"
		>
			{text}
		</Button>
	)
}
const FolderButton = ({
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
	<Link to={'/controlPanel/folder/' + folderId.toString()}>
		<Button
			variant="default"
			color="dark"
			size="xl"
			mx="xs"
			my="xs"
			leftIcon={backButton ? <FaLevelUpAlt /> : <FolderIconReact icon={icon} />}
		>
			{text}
		</Button>
	</Link>
)

export const PresetPage = () => {
	const { folderId } = useParams<{ folderId: string }>()
	const folders = useAppSelector(state => (state.database ? state.database.folders : false))
	let folder: DatabaseFolder | false = false
	if (folders !== false) {
		folder = folders[parseInt(folderId)]
	}
	if (folder) {
		return (
			<>
				{folder.infoText ? (
					<Paper px="md">
						<DangerouslySetHTML html={folder.infoText} />
					</Paper>
				) : (
					''
				)}
				<PresetFaders faders={folder.faders} />
				{folder.parent !== null ? (
					<FolderButton
						folderId={folder.parent.id}
						text={folder.parent.name}
						icon={folder.parent.icon}
						backButton={true}
					/>
				) : (
					''
				)}
				{folder.children.map(folder => (
					<FolderButton
						folderId={folder.id}
						icon={folder.icon}
						key={'folder' + folder.id}
						text={folder.name}
						backButton={false}
					/>
				))}
				{folder.presets.map(preset =>
					preset.enabled ? (
						<PresetButton
							presetId={preset.id}
							key={'preset' + preset.id}
							text={preset.name}
							color={preset.color}
						/>
					) : (
						''
					)
				)}
			</>
		)
	} else return <></>
}
