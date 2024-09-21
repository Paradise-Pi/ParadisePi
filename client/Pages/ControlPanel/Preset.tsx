import { Button, Paper } from '@mantine/core'
import { FaLevelUpAlt } from '@react-icons/all-files/fa/FaLevelUpAlt'
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DatabaseFolder } from '../../../shared/database'
import { useAppSelector } from '../../apis/redux/mainStore'
import { pickTextColorBasedOnBgColor } from '../../apis/utilities/pickOppositeTextColor'
import { ApiCall } from '../../apis/wrapper'
import { displayBasedOnVariablesParser } from '../../Components/Admin/Controls/DisplayBasedOnVariablesEditor'
import { ButtonIcon } from '../../Components/ControlPanel/ButtonIcon'
import { PresetFaders } from '../../Components/ControlPanel/PresetFaders'
import { DangerouslySetHTML } from '../../Components/DangerouslySetHTML'
const PresetButton = ({
	text,
	presetId,
	color,
	icon,
}: {
	text: string
	presetId: number
	color: string
	icon: string
}) => {
	const navigate = useNavigate()
	const [loading, setLoading] = React.useState<boolean>(false)
	return (
		<Button
			variant="default"
			sx={() => ({
				backgroundColor: color,
				'&:hover': { backgroundColor: color },
				color: pickTextColorBasedOnBgColor(color),
			})}
			loading={loading}
			onClick={() => {
				setLoading(true)
				ApiCall.get('/presets/recall-user/' + presetId, {}).then(value => {
					setLoading(false)
					if (value.redirect) {
						navigate(value.redirect)
					}
				})
			}}
			size="xl"
			mx="xs"
			my="xs"
			rightIcon={icon ? <ButtonIcon icon={icon} /> : null}
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
			leftIcon={backButton ? <FaLevelUpAlt /> : <ButtonIcon icon={icon ? icon : 'FaFolder'} />}
		>
			{text}
		</Button>
	</Link>
)

export const PresetPage = () => {
	const { folderId } = useParams<{ folderId: string }>()
	const folders = useAppSelector(state => (state.database ? state.database.folders : false))
	const variables = useAppSelector(state => (state.database ? state.database.variables : false))
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
				<PresetFaders
					faders={folder.faders.filter(fader =>
						displayBasedOnVariablesParser(fader.displayVariableLogic, variables) ? fader : false
					)}
				/>
				{folder.parent !== null &&
				displayBasedOnVariablesParser(folder.parent.displayVariableLogic, variables) ? (
					<FolderButton
						folderId={folder.parent.id}
						text={folder.parent.name}
						icon={folder.parent.icon}
						backButton={true}
					/>
				) : (
					''
				)}
				{folder.children.map(folder =>
					displayBasedOnVariablesParser(folder.displayVariableLogic, variables) ? (
						<FolderButton
							folderId={folder.id}
							icon={folder.icon}
							key={'folder' + folder.id}
							text={folder.name}
							backButton={false}
						/>
					) : null
				)}
				{folder.presets.map(preset =>
					displayBasedOnVariablesParser(preset.displayVariableLogic, variables) ? (
						<PresetButton
							presetId={preset.id}
							key={'preset' + preset.id}
							text={preset.name}
							color={preset.color}
							icon={preset.icon}
						/>
					) : (
						''
					)
				)}
			</>
		)
	} else return <></>
}
