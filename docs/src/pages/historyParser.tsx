/* eslint-disable import/no-unresolved */
import Link from '@docusaurus/Link'
import Layout from '@theme/Layout'
import React, { useEffect, useMemo, useRef, useState } from 'react'

type LogRow = {
	level?: string
	message?: string
	presetId?: number
	presetName?: string
	presetType?: string
	historyType?: string
	timestamp: string
	type: string
	[key: string]: unknown
}

type TypeOption = { value: string; label: string; group?: string }

const TYPE_OPTIONS: TypeOption[] = [
	{ value: 'preset', label: 'Preset - triggered by user', group: 'Preset' },
	{ value: 'osc-fader', label: 'Fader' },
	{ value: 'e131-value', label: 'Manual sACN Value Change' },
	{ value: 'http-trigger-preset', label: 'HTTP Trigger Preset' },
	{ value: 'http-trigger-preset-fail', label: 'HTTP Trigger Preset - Failures' },
	{ value: 'preset-internal', label: 'Preset - triggered internally', group: 'Preset' },
	{ value: 'preset-timeclocktrigger', label: 'Preset - triggered on schedule', group: 'Preset' },
]

const MAX_BYTES = 25 * 1024 * 1024

const formatDateOnly = (ts: string): string => {
	// Expecting YYYY-MM-DD HH:mm:ss; gracefully handle ISO formats too
	if (!ts) return ''
	const parts = ts.split(' ')
	if (parts.length > 0 && /\d{4}-\d{2}-\d{2}/.test(parts[0])) {
		return parts[0]
	}
	const date = new Date(ts)
	if (Number.isNaN(date.getTime())) return ''
	const y = date.getFullYear()
	const m = String(date.getMonth() + 1).padStart(2, '0')
	const d = String(date.getDate()).padStart(2, '0')
	return `${y}-${m}-${d}`
}

const safeLower = (v: unknown): string => (v == null ? '' : String(v).toLowerCase())

const Page = (): JSX.Element => {
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const [allRows, setAllRows] = useState<LogRow[]>([])
	const [loadInfo, setLoadInfo] = useState<string>('')
	const [error, setError] = useState<string>('')
	const [search, setSearch] = useState<string>('')
	const [selectedTypes, setSelectedTypes] = useState<string[]>([])
	const [displayCount, setDisplayCount] = useState<number>(200)

	const typeLabelMap = useMemo(() => {
		const m = new Map<string, string>()
		TYPE_OPTIONS.forEach(t => m.set(t.value, t.label))
		return m
	}, [])

	const knownTypeValues = useMemo(() => new Set(TYPE_OPTIONS.map(t => t.value)), [])

	const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setError('')
		setLoadInfo('')
		setAllRows([])
		setDisplayCount(200)
		const file = e.target.files?.[0]
		if (!file) return
		if (file.size > MAX_BYTES) {
			setError('File is larger than 25MB. Please choose a smaller file.')
			return
		}
		try {
			const text = await file.text()
			let parsed: unknown
			let rows: LogRow[] = []
			try {
				parsed = JSON.parse(text)
				if (Array.isArray(parsed)) {
					rows = parsed as LogRow[]
				} else if (parsed && typeof parsed === 'object') {
					// Single object; treat as one-row log
					rows = [parsed as LogRow]
				} else {
					rows = []
				}
			} catch (jsonErr) {
				// Try NDJSON (one JSON object per line)
				rows = []
				const lines = text.split(/\r?\n/)
				for (const line of lines) {
					const trimmed = line.trim()
					if (!trimmed) continue
					try {
						rows.push(JSON.parse(trimmed))
					} catch {
						// skip bad lines
					}
				}
			}
			// Basic validation and normalization
			const normalized = rows
				.map(r => {
					const row = r as LogRow
					// Normalize historyType -> type (server writes `historyType` for most events)
					if (!row.type && (row as any).historyType) {
						;(row as any).type = (row as any).historyType as string
					}
					return row
				})
				.filter(row => row && typeof row === 'object' && (row as LogRow).timestamp && (row as LogRow).type)
				.map((row, i) => {
					;(row as any).__key = `${i}-${row.timestamp}-${row.type}-${row.presetId ?? ''}-${row.message ?? ''}`
					return row
				})
			setAllRows(normalized)
			setLoadInfo(`Loaded ${normalized.length} rows`)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to read file')
		}
	}

	const toggleType = (value: string) => {
		setSelectedTypes(prev => {
			if (prev.includes(value)) return prev.filter(v => v !== value)
			return [...prev, value]
		})
	}

	const clearFilters = () => {
		setSelectedTypes([])
		setSearch('')
		setDisplayCount(200)
	}

	const filteredRows = useMemo(() => {
		const hasTypeFilter = selectedTypes.length > 0
		const s = safeLower(search)
		let rows = allRows
		if (hasTypeFilter) {
			rows = rows.filter(r => selectedTypes.includes(r.type))
		}
		if (s) {
			rows = rows.filter(r => JSON.stringify(r).toLowerCase().includes(s))
		}
		// Sort descending by timestamp (best-effort)
		return [...rows].sort((a, b) => safeLower(b.timestamp).localeCompare(safeLower(a.timestamp)))
	}, [allRows, search, selectedTypes])

	const dailyCounts = useMemo(() => {
		const map = new Map<string, number>()
		for (const row of filteredRows) {
			const day = formatDateOnly(row.timestamp)
			if (!day) continue
			map.set(day, (map.get(day) ?? 0) + 1)
		}
		const entries = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
		return entries
	}, [filteredRows])

	const unknownTypes = useMemo(() => {
		const s = new Set<string>()
		for (const r of allRows) if (!knownTypeValues.has(r.type)) s.add(r.type)
		return Array.from(s.values()).sort()
	}, [allRows, knownTypeValues])

	useEffect(() => {
		// Reset show count when filters change
		setDisplayCount(200)
	}, [search, selectedTypes])

	const shownRows = useMemo(() => filteredRows.slice(0, displayCount), [filteredRows, displayCount])

	const totalFiltered = filteredRows.length

	return (
		<Layout title="History Recording Analysis Tool">
			<main style={{ padding: '1rem 1.25rem', maxWidth: 1200, margin: '0 auto' }}>
				<h1 style={{ marginTop: 0 }}>History Recording Analysis Tool</h1>
				<p>
					This page allows you to analyze the history recording file. This is useful for debugging and
					understanding the history recording feature. Learn more about this feature{' '}
					<Link to="/docs/user-guide/admin/config#history-recording">in the documentation</Link>
				</p>
				<p>
					All parsing and analysis is performed entirely in your browser on this device. Your history files
					never leave your computer, are never uploaded, and nothing is stored or transmitted anywhere.
				</p>
				<section style={{ marginBottom: 16 }}>
					<div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
						<input
							ref={fileInputRef}
							type="file"
							accept=".json,application/json,.txt"
							onChange={onFileChange}
							style={{ padding: '6px 10px' }}
						/>
						<button
							onClick={() => {
								if (fileInputRef.current) fileInputRef.current.value = ''
								setAllRows([])
								setLoadInfo('')
								setError('')
							}}
							style={{ padding: '6px 10px' }}
						>
							Clear File
						</button>
						<span style={{ color: '#666' }}>Max size: 25MB</span>
					</div>
					{error ? <div style={{ color: '#b00020', marginTop: 8 }}>{error}</div> : null}
					{loadInfo ? <div style={{ color: '#066e29', marginTop: 8 }}>{loadInfo}</div> : null}
				</section>

				{allRows.length > 0 && (
					<>
						<section style={{ marginBottom: 16 }}>
							<div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
								<input
									type="search"
									placeholder="Search text in rows..."
									value={search}
									onChange={e => setSearch(e.target.value)}
									style={{ padding: 6, minWidth: 260 }}
								/>
								<button onClick={clearFilters} style={{ padding: '6px 10px' }}>
									Clear Filters
								</button>
								<span style={{ color: '#666' }}>
									Showing {Math.min(displayCount, totalFiltered)} of {totalFiltered} filtered rows
									(from {allRows.length} total)
								</span>
							</div>
							<div style={{ marginTop: 10, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
								<div>
									<div style={{ fontWeight: 600, marginBottom: 6 }}>Filter by Type</div>
									<div
										style={{
											display: 'grid',
											gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
											gap: 6,
											alignItems: 'start',
										}}
									>
										{TYPE_OPTIONS.map(opt => (
											<label
												key={opt.value}
												style={{ display: 'flex', alignItems: 'center', gap: 8 }}
											>
												<input
													type="checkbox"
													checked={selectedTypes.includes(opt.value)}
													onChange={() => toggleType(opt.value)}
												/>
												<span>{opt.label}</span>
											</label>
										))}
									</div>
									{unknownTypes.length > 0 && (
										<div style={{ marginTop: 6, color: '#666' }}>
											Unknown types in file: {unknownTypes.join(', ')}
										</div>
									)}
								</div>
							</div>
						</section>

						<section style={{ marginBottom: 16 }}>
							<div style={{ fontWeight: 600, marginBottom: 6 }}>Events by Date (after filters)</div>
							<BarChart data={dailyCounts} height={220} />
						</section>

						<section>
							<div style={{ overflowX: 'auto' }}>
								<table style={{ width: '100%', borderCollapse: 'collapse' }}>
									<thead>
										<tr>
											<th
												style={{
													textAlign: 'left',
													borderBottom: '1px solid #ddd',
													padding: '8px 6px',
												}}
											>
												Timestamp
											</th>
											<th
												style={{
													textAlign: 'left',
													borderBottom: '1px solid #ddd',
													padding: '8px 6px',
												}}
											>
												Type
											</th>
											<th
												style={{
													textAlign: 'left',
													borderBottom: '1px solid #ddd',
													padding: '8px 6px',
												}}
											>
												Message
											</th>
											<th
												style={{
													textAlign: 'left',
													borderBottom: '1px solid #ddd',
													padding: '8px 6px',
												}}
											>
												Preset
											</th>
										</tr>
									</thead>
									<tbody>
										{shownRows.map(r => (
											<tr
												key={
													(r as any).__key ??
													`${r.timestamp}|${r.type}|${r.presetId ?? ''}|${r.message ?? ''}`
												}
											>
												<td style={{ borderBottom: '1px solid #f0f0f0', padding: '6px' }}>
													{r.timestamp}
												</td>
												<td style={{ borderBottom: '1px solid #f0f0f0', padding: '6px' }}>
													{typeLabelMap.get(r.type) ?? r.type}
												</td>
												<td style={{ borderBottom: '1px solid #f0f0f0', padding: '6px' }}>
													{r.message ?? ''}
												</td>
												<td style={{ borderBottom: '1px solid #f0f0f0', padding: '6px' }}>
													{r.presetName ?? ''}
													{r.presetId != null ? ` (ID: ${r.presetId})` : ''}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							{displayCount < totalFiltered && (
								<div style={{ marginTop: 12 }}>
									<button
										onClick={() => setDisplayCount(c => c + 200)}
										style={{ padding: '8px 12px' }}
									>
										Show more
									</button>
								</div>
							)}
						</section>
					</>
				)}
			</main>
		</Layout>
	)
}

const BarChart = ({ data, height = 200 }: { data: [string, number][]; height?: number }) => {
	// data is array of [dateString, count]
	const padding = { top: 10, right: 10, bottom: 40, left: 40 }
	const maxValue = useMemo(() => (data.length ? Math.max(...data.map(d => d[1])) : 0), [data])
	const barColor = '#3f51b5'
	const axisColor = '#666'
	const labelColor = '#444'

	// Simple responsive SVG using viewBox to scale width; compute positions in a normalized width
	const numBars = data.length
	const innerHeight = Math.max(0, height - padding.top - padding.bottom)
	const innerWidth = Math.max(0, 800 - padding.left - padding.right) // base logical width
	const barGap = 6
	const barWidth = numBars > 0 ? Math.max(2, (innerWidth - barGap * (numBars - 1)) / numBars) : 0

	const yScale = (v: number) => (maxValue === 0 ? 0 : (v / maxValue) * innerHeight)

	return (
		<div style={{ width: '100%', overflowX: 'auto' }}>
			<svg
				width={Math.max(840, padding.left + padding.right + (barWidth + barGap) * numBars)}
				height={height}
				viewBox={`0 0 ${padding.left + padding.right + (barWidth + barGap) * numBars} ${height}`}
				role="img"
				aria-label="Bar chart of events by date"
			>
				{/* Axes */}
				<line
					x1={padding.left}
					y1={height - padding.bottom}
					x2={padding.left + (barWidth + barGap) * numBars}
					y2={height - padding.bottom}
					stroke={axisColor}
					strokeWidth={1}
				/>
				<line
					x1={padding.left}
					y1={padding.top}
					x2={padding.left}
					y2={height - padding.bottom}
					stroke={axisColor}
					strokeWidth={1}
				/>

				{/* Bars */}
				{data.map(([date, count], i) => {
					const barHeight = yScale(count)
					const x = padding.left + i * (barWidth + barGap)
					const y = height - padding.bottom - barHeight
					return (
						<g key={date}>
							<rect x={x} y={y} width={barWidth} height={barHeight} fill={barColor} />
							{/* Value label (only if enough space) */}
							{barHeight > 18 && (
								<text x={x + barWidth / 2} y={y + 14} textAnchor="middle" fontSize={12} fill="#fff">
									{count}
								</text>
							)}
							{/* Date label */}
							<text
								x={x + barWidth / 2}
								y={height - padding.bottom + 14}
								textAnchor="middle"
								fontSize={11}
								fill={labelColor}
							>
								{date}
							</text>
						</g>
					)
				})}

				{/* Y max label */}
				{textLabel(10, padding.top + 12, `Max: ${maxValue}`, { fill: labelColor })}
			</svg>
		</div>
	)
}

const textLabel = (x: number, y: number, value: string, style: { fill?: string } = {}) => (
	<text x={x} y={y} fontSize={12} fill={style.fill ?? '#333'}>
		{value}
	</text>
)

export default Page
