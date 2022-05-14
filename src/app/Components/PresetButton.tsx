import React from 'react'
import { Button } from '@mantine/core'

export const PresetButton = ({ text }: { text: string }) => {
	return (
		<Button variant="default" color="dark" size="xl" mx="xs" my="xs">
			{text}
		</Button>
	)
}
