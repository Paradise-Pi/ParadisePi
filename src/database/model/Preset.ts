/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	VersionColumn,
} from 'typeorm'
import { PresetFolders } from './PresetFolders'

@Entity('presets')
export class Preset {
	@PrimaryGeneratedColumn()
	id: number

	@Column('text')
	name: string

	@Column('boolean', {
		default: true,
	})
	enabled: boolean

	@Column('text', { nullable: true })
	type: string | null

	@Column('text', { nullable: true })
	universe: string | null

	@Column('integer', {
		default: 0,
		nullable: true,
	})
	fadeTime: number

	@ManyToOne(() => PresetFolders, PresetFolders => PresetFolders.presets, {
		nullable: true,
	})
	folder: PresetFolders

	@Column('simple-json', { nullable: true })
	data: {
		[key: string]: any
	}

	@Column('integer', { default: 1 })
	sort: number

	@CreateDateColumn({ nullable: true })
	createdAt: Date

	@UpdateDateColumn({ nullable: true })
	updatedAt: Date

	@VersionColumn({ nullable: true })
	version: number
}
