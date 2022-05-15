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
import { Preset } from './Preset'

@Entity('presetFolders')
export class PresetFolders {
	@PrimaryGeneratedColumn()
	id: number

	@Column('text')
	name: string

	@ManyToOne(() => PresetFolders, PresetFolders => PresetFolders.id, {
		nullable: true,
	})
	parent: PresetFolders

	@Column('integer', { default: 1 })
	sort: number

	@OneToMany(() => Preset, Preset => Preset.folder)
	presets: Preset[]

	@CreateDateColumn({ nullable: true })
	createdAt: Date

	@UpdateDateColumn({ nullable: true })
	updatedAt: Date

	@VersionColumn({ nullable: true })
	version: number
}
