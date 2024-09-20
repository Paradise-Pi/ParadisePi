/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	VersionColumn,
} from 'typeorm'
import { Preset } from './Preset'

@Entity('devices', {
	orderBy: {
		sort: 'ASC',
	},
})
export class Device {
	@PrimaryGeneratedColumn()
	id: number

	@Column('text')
	name: string

	@Column('text', { nullable: true })
	ip: string

	@Column('integer', { nullable: true, default: 80 })
	port: number

	@Column('text', { nullable: true })
	endpoint: string

	@Column('text', { nullable: true })
	notes: string

	@Column('integer')
	sort: number

	@OneToMany(() => Preset, Preset => Preset.device)
	presets: Preset[]

	@CreateDateColumn({ nullable: true })
	createdAt: Date

	@UpdateDateColumn({ nullable: true })
	updatedAt: Date

	@VersionColumn({ nullable: true })
	version: number
}
