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

@Entity('faders')
export class Fader {
	@PrimaryGeneratedColumn()
	id: number

	@Column('text')
	name: string

	@Column('integer') // Channel number means say channel 02 OR (see type) could be Matrix 01 or Bus 02
	channel: number

	@Column('boolean')
	enabled: boolean

	@Column('simple-json', { nullable: true })
	data: {
		[key: string]: any
	}

	@Column('text')
	type: string

	@Column('integer')
	sort: number

	@ManyToOne(() => PresetFolders, PresetFolders => PresetFolders.presets, {
		createForeignKeyConstraints: false,
		eager: true,
	})
	folder: PresetFolders

	@CreateDateColumn({ nullable: true })
	createdAt: Date

	@UpdateDateColumn({ nullable: true })
	updatedAt: Date

	@VersionColumn({ nullable: true })
	version: number
}
