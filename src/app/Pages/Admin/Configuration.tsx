import { Alert, Tabs } from '@mantine/core'
import React from 'react'
import { FaDrum } from '@react-icons/all-files/fa/FaDrum'
import { FaLightbulb } from '@react-icons/all-files/fa/FaLightbulb'
import { FaNetworkWired } from '@react-icons/all-files/fa/FaNetworkWired'
import { FaTools } from '@react-icons/all-files/fa/FaTools'
import { E131ModuleConfigurationPage } from './ModuleConfiguration/E131'
import { GeneralConfigurationPage } from './ModuleConfiguration/General'
import { HTTPModuleConfigurationPage } from './ModuleConfiguration/HTTP'
import { OSCModuleConfigurationPage } from './ModuleConfiguration/OSC'
import { FaExclamationTriangle } from '@react-icons/all-files/fa/FaExclamationTriangle'

export const ConfigurationPage = () => {
	return (
		<>
			<Alert icon={<FaExclamationTriangle />} title="Warning" color="gray" my="sm">
				Saving configuration will restart the sACN output - turning off all lighting
			</Alert>
			<Tabs grow>
				<Tabs.Tab label="General" icon={<FaTools />}>
					<GeneralConfigurationPage />
				</Tabs.Tab>
				<Tabs.Tab label="sACN (E1.31)" icon={<FaLightbulb />}>
					<E131ModuleConfigurationPage />
				</Tabs.Tab>
				<Tabs.Tab label="HTTP" icon={<FaNetworkWired />} disabled>
					<HTTPModuleConfigurationPage />
				</Tabs.Tab>
				<Tabs.Tab label="OSC" icon={<FaDrum />}>
					<OSCModuleConfigurationPage />
				</Tabs.Tab>
			</Tabs>
		</>
	)
}
