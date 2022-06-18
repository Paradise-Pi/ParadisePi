import React from 'react'
import { GetInputProps } from '@mantine/form/lib/types'
import { JsonInput, Tabs } from '@mantine/core'

export const OSCPresetEditModal = (props: GetInputProps<'input'>) => {
	return (
		<Tabs>
			<Tabs.Tab label="Edit">Coming soon</Tabs.Tab>
			<Tabs.Tab label="JSON Mode">
				<JsonInput formatOnBlur={true} autosize maxRows={20} value={props.value} onChange={props.onChange} />
			</Tabs.Tab>
		</Tabs>
	)
}
