/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm'

@Entity('faders')
export class Fader {
	@PrimaryGeneratedColumn()
	id: number

	@Column('text')
	name: string

	@Column('integer', { nullable: true })
	channel: number | null

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

	@CreateDateColumn({ nullable: true })
	createdAt: Date

	@UpdateDateColumn({ nullable: true })
	updatedAt: Date

	@VersionColumn({ nullable: true })
	version: number
}
