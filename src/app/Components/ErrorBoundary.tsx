import { Button, Title, Text, Container, Accordion, Divider } from '@mantine/core'
import React, { Component, ErrorInfo, ReactNode } from 'react'
import { ApiCall } from '../apis/wrapper'

interface Props {
	children: ReactNode
}

interface State {
	hasError: boolean
	error: Error
	errorInfo: ErrorInfo
}

/**
 * This is a catch-all error boundary wrapped around everything within the MantineProvider.
 * N.B. it's within the MantineProvider for a nicer interface!
 *
 * It's been included as a final catch for the app, as most errors should be caught in their relevant component.
 * Fingers crossed the end user will never see it!
 */
class ErrorBoundary extends Component<Props, State> {
	public state: State = { hasError: false, error: null, errorInfo: null }

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		//update State
		this.setState({
			hasError: true,
			error: error,
			errorInfo: errorInfo,
		})
		//log the error
		// eslint-disable-next-line no-console
		console.error('Uncaught error:', error, errorInfo)
	}

	render() {
		if (this.state.hasError) {
			//Render fallback UI
			return (
				<Container size="sm" px="md">
					<Title my="md">Something went wrong</Title>
					<Button size="lg" my="md" onClick={() => ApiCall.get('/reboot', {})}>
						Restart ParadisePi
					</Button>
					<Text my="md" size="sm">
						If you have seen this before, please submit the information below to the ParadisePi Github
						Repository
					</Text>
					<Accordion>
						<Accordion.Item label="Error Details">
							<Text>{this.state.error && this.state.error.toString()}</Text>
							<Divider my="sm" label="Error Stack" labelPosition="center" />
							<Text>{this.state.errorInfo.componentStack}</Text>
						</Accordion.Item>
					</Accordion>
				</Container>
			)
		}

		return this.props.children
	}
}

export default ErrorBoundary
