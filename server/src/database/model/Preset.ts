/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	VersionColumn,
} from 'typeorm'
import { Device } from './Device'
import { Folders } from './Folder'
import { TimeClockTrigger } from './TimeClockTrigger'

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

	@Column('text', { nullable: true })
	type: string | null

	@Column('text', { nullable: true })
	universe: string | null

	@Column('text', {
		nullable: true,
		default: (): string => {
			return null
		},
	})
	icon: string | null

	@Column('text', { nullable: true })
	color: string | null

	@Column('integer', {
		default: 0,
		nullable: true,
	})
	fadeTime: number

	@ManyToOne(() => Folders, Folders => Folders.presets, {
		createForeignKeyConstraints: false,
		eager: true,
	})
	folder: Folders

	@ManyToOne(() => Device, Device => Device.presets, {
		createForeignKeyConstraints: false,
		eager: true,
		nullable: true,
	})
	device: Device

	@Column('simple-json', { nullable: true })
	data: {
		[key: string]: any
	}

	@Column('simple-json', { nullable: true })
	variableLogic: {
		[key: string]: any
	}

	@Column('simple-json')
	displayVariableLogic: {
		[key: string]: any
	}

	@OneToMany(() => TimeClockTrigger, TimeClockTrigger => TimeClockTrigger.preset)
	timeClockTriggers: TimeClockTrigger[]

	@Column('boolean', {
		default: false,
	})
	httpTriggerEnabled: boolean

	@Column('integer', { default: 1 })
	sort: number

	@CreateDateColumn({ nullable: true })
	createdAt: Date

	@UpdateDateColumn({ nullable: true })
	updatedAt: Date

	@VersionColumn({ nullable: true })
	version: number
}
