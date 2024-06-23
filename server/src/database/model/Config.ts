/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column, CreateDateColumn, Entity, UpdateDateColumn, VersionColumn } from 'typeorm'

export abstract class ConfigType {
	@Column('text', {
		primary: true,
		unique: true,
	})
	key: string

	@Column('text')
	value: string

	@Column('simple-json', {
		nullable: true,
		default: () => {
			null
		},
	})
	json: {
		[key: string]: any
	}

	@CreateDateColumn({ nullable: true })
	createdAt: Date

	@UpdateDateColumn({ nullable: true })
	updatedAt: Date

	@VersionColumn({ nullable: true })
	version: number
}

@Entity('config')
export class Config extends ConfigType {}
