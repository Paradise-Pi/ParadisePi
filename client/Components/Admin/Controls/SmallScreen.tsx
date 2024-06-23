import React from 'react'
import { Alert } from '@mantine/core'
import { FaSearchMinus } from '@react-icons/all-files/fa/FaSearchMinus'
import { useViewportSize } from '@mantine/hooks'

export const SmallScreenWarning = () => {
	const { width } = useViewportSize()
	if (width < 1200) {
		return (
			<Alert icon={<FaSearchMinus />} variant={width < 820 ? 'filled' : 'light'}>
				You&apos;re accessing the Administration Menu from a small screen, try a larger screen if things are
				hard to read using the server button below.
			</Alert>
		)
	} else return null
}
