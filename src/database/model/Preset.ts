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

@Entity('presets', {
	orderBy: {
		sort: 'ASC',
	},
})
export class Preset {
	@PrimaryGeneratedColumn()
	id: number

	@Column('text')
	name: string

	// Enabled is taken to mean visible - macros can still trigger the preset but it is hidden
	@Column('boolean', {
		default: true,
	})
	enabled: boolean

	@Column('text', { nullable: true })
	type: string | null

	@Column('text', { nullable: true })
	universe: string | null

	@Column('text', { nullable: true })
	color: string | null

	@Column('integer', {
		default: 0,
		nullable: true,
	})
	fadeTime: number

	@ManyToOne(() => PresetFolders, PresetFolders => PresetFolders.presets, {
		createForeignKeyConstraints: false,
		eager: true,
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
