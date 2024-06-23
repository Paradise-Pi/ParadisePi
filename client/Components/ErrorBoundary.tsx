import { Accordion, Box, Button, Code, Container, Divider, Text, Title } from '@mantine/core'
import { QRCodeSVG } from 'qrcode.react'
import React, { Component, ErrorInfo, ReactNode } from 'react'

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

					<a href="/">
						<Button size="lg" my="md">
							Reload
						</Button>
					</a>

					<a href="http://localhost/logs" target="_blank" rel="noreferrer">
						<Button variant="default" color="dark" size="lg" mx="xs">
							Download Logs
						</Button>
					</a>
					<Accordion defaultValue="How to report this problem">
						<Accordion.Item value="How to report this problem">
							<Box
								sx={{
									height: 150,
									float: 'right',
									marginLeft: '1em',
								}}
							>
								<QRCodeSVG
									value={
										'https://github.com/Paradise-Pi/ParadisePi/issues/new?title=[BUG]+React+crash+on+frontend+in+production&body=' +
										encodeURIComponent(this.state.error.toString())
									}
									bgColor="#000000"
									fgColor="#FFFFFF"
									level={'M'}
									size={150}
									includeMargin={false}
								/>
							</Box>
							<Text sx={{ minHeight: 150 }}>
								If you manage this device please submit the information below to the ParadisePi Github
								Repository at https://github.com/paradise-pi/paradisepi. Alternatively please contact
								your IT help desk.
							</Text>
						</Accordion.Item>
						<Accordion.Item value="Error Details">
							<Text>{this.state.error && this.state.error.toString()}</Text>
							<Divider my="sm" label="Error Stack Trace" labelPosition="center" />
							<Code block>{this.state.errorInfo.componentStack}</Code>
						</Accordion.Item>
					</Accordion>
				</Container>
			)
		}

		return this.props.children
	}
}

export default ErrorBoundary
