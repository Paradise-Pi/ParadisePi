import React from 'react'
import { DangerouslySetHTML } from './../../Components/DangerouslySetHTML'
import { useAppSelector } from './../../apis/redux/mainStore'

export const HelpPage = () => {
	const helpText = useAppSelector(state => (state.database ? state.database.config.general.helpText : ''))
	return (
		<>
			<DangerouslySetHTML html={helpText} />
		</>
	)
}
