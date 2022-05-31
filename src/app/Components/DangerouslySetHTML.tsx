import { TypographyStylesProvider } from '@mantine/core'
import React from 'react'

export const DangerouslySetHTML = (props: { html: string }) => {
	return (
		<TypographyStylesProvider>
			<div dangerouslySetInnerHTML={{ __html: props.html }} />
		</TypographyStylesProvider>
	)
}
