/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm'

@Entity('variables', {
	orderBy: {
		sort: 'ASC',
	},
})
export class Variable {
	@PrimaryGeneratedColumn()
	id: number

	@Column('text')
	name: string

	@Column('text')
	value: string

	@Column('text', { nullable: true })
	notes: string

	@Column('integer')
	sort: number

	@CreateDateColumn({ nullable: true })
	createdAt: Date

	@UpdateDateColumn({ nullable: true })
	updatedAt: Date

	@VersionColumn({ nullable: true })
	version: number
}
