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
import { Preset } from './Preset'

@Entity('timeclocktriggers', {
	orderBy: {
		time: 'ASC',
	},
})
export class TimeClockTrigger {
	@PrimaryGeneratedColumn()
	id: number

	@Column('text')
	time: string

	@Column('numeric', {
		default: 0,
	})
	lastTriggered: number

	// Enabled is taken to mean visible - macros can still trigger the preset but it is hidden
	@Column('boolean', {
		default: true,
	})
	enabled: boolean

	@Column('text')
	timeout: number

	@Column('text')
	countdownWarning: number

	@Column('text', { nullable: true })
	countdownWarningText: string | null

	@ManyToOne(() => Preset, Presets => Presets.timeClockTriggers, {
		createForeignKeyConstraints: false,
		eager: true,
	})
	preset: Preset

	@Column('boolean', {
		default: true,
	})
	mon: boolean

	@Column('boolean', {
		default: true,
	})
	tues: boolean

	@Column('boolean', {
		default: true,
	})
	weds: boolean

	@Column('boolean', {
		default: true,
	})
	thurs: boolean

	@Column('boolean', {
		default: true,
	})
	fri: boolean

	@Column('boolean', {
		default: true,
	})
	sat: boolean

	@Column('boolean', {
		default: true,
	})
	sun: boolean

	@CreateDateColumn({ nullable: true })
	createdAt: Date

	@UpdateDateColumn({ nullable: true })
	updatedAt: Date

	@VersionColumn({ nullable: true })
	version: number
}
