/* eslint-disable import/no-unresolved */
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import React from 'react'
import './index.css'

type FeatureItem = {
	title: string
	description: JSX.Element
}

const FeatureList: FeatureItem[] = [
	{
		title: 'Lighting Control',
		description: (
			<>
				Control and program lighting states, including fades, for any fixture supporting sACN (E1.31). Or, add a
				network node and you can control fixtures over DMX.
			</>
		),
	},
	{
		title: 'Sound Control',
		description: <>Control any device over OSC, or add a Behringer or Midas device to add in Fader support</>,
	},
	{
		title: 'HTTP Control',
		description: (
			<>Trigger HTTP requests on your local network, to control devices such as projectors and matrix switches.</>
		),
	},
	{
		title: 'Macros',
		description: (
			<>
				Trigger a combination of presets, to create simple controls such as &quot;turn all off&quot; or a setup
				for &quot;assembly&quot;.
			</>
		),
	},
]

const Feature = ({ title, description }: FeatureItem) => {
	return (
		<div className="col col--6">
			<div className="text--center padding-horiz--md">
				<h3>{title}</h3>
				<p>{description}</p>
			</div>
		</div>
	)
}

const HomepageFeatures = (): JSX.Element => {
	return (
		<section className="features">
			<div className="container">
				<div className="row">
					{FeatureList.map((props, idx) => (
						<Feature key={idx} {...props} />
					))}
				</div>
			</div>
		</section>
	)
}

const HomepageHeader = () => {
	const { siteConfig } = useDocusaurusContext()
	return (
		<header className="hero hero--primary heroBanner">
			<div className="container">
				<h1 className="hero__title">{siteConfig.title}</h1>
				<p className="hero__subtitle">{siteConfig.tagline}</p>
				<div className="buttons">
					<a
						className="button button--secondary button--lg"
						href="https://github.com/Paradise-Pi/ParadisePi/releases/latest"
						target="_blank"
						rel="noreferrer"
					>
						Download
					</a>
				</div>
			</div>
		</header>
	)
}

const HomepageOpenSourceHero = () => {
	return (
		<div className="hero hero--primary heroBanner">
			<div className="container">
				<h2 className="hero__title">Free and Open Source</h2>
				<p className="hero__subtitle">Add your own modules, and contribute to the code.</p>
				<div className="buttons">
					<a
						className="button button--secondary button--lg"
						href="https://github.com/Paradise-Pi/ParadisePi"
						target="_blank"
						rel="noreferrer"
					>
						GitHub
					</a>
				</div>
			</div>
		</div>
	)
}

const Home = (): JSX.Element => {
	const { siteConfig } = useDocusaurusContext()
	return (
		<Layout description={siteConfig.tagline}>
			<HomepageHeader />
			<main>
				<HomepageFeatures />

				<HomepageOpenSourceHero />
			</main>
		</Layout>
	)
}
export default Home
