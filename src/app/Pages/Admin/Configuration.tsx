import { Tabs } from '@mantine/core'
import React from 'react'
import { FaDrum, FaLightbulb, FaNetworkWired, FaTools } from 'react-icons/fa'
import { E131ModuleConfigurationPage } from './ModuleConfiguration/e131'
import { GeneralConfigurationPage } from './ModuleConfiguration/general'
import { HTTPModuleConfigurationPage } from './ModuleConfiguration/http'
import { OSCModuleConfigurationPage } from './ModuleConfiguration/osc'

export const ConfigurationPage = () => {
	return (
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
	)
}
