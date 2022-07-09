import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme, _params, getRef) => {
	const icon = getRef('icon')
	return {
		navbar: {
			backgroundColor: theme.colors.dark[6],
		},

		version: {
			backgroundColor: theme.colors.dark[7],
			color: theme.white,
			fontWeight: 700,
		},

		text: {
			color: theme.white,
			fontWeight: 700,
			fontSize: '2rem',
		},

		header: {
			paddingBottom: theme.spacing.xs,
			marginBottom: theme.spacing.xs,
			borderBottom: `1px solid ${theme.colors.dark[4]}`,
		},

		footer: {
			paddingTop: theme.spacing.md,
			marginTop: theme.spacing.md,
			borderTop: `1px solid ${theme.colors.dark[4]}`,
		},

		link: {
			...theme.fn.focusStyles(),
			display: 'flex',
			alignItems: 'center',
			textDecoration: 'none',
			fontSize: theme.fontSizes.sm,
			color: theme.white,
			padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
			borderRadius: theme.radius.sm,
			fontWeight: 500,

			'&:hover': {
				backgroundColor: theme.colors.dark[5],
			},
		},

		linkIcon: {
			ref: icon,
			color: theme.white,
			opacity: 0.75,
			marginRight: theme.spacing.sm,
			fontSize: '2rem',
		},

		linkActive: {
			'&, &:hover': {
				backgroundColor: theme.colors.dark[7],
				[`& .${icon}`]: {
					opacity: 0.9,
				},
			},
		},
	}
})
