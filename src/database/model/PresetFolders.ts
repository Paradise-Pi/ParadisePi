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

@Entity('presetFolders', {
	orderBy: {
		sort: 'ASC',
		name: 'ASC',
	},
})
export class PresetFolders {
	@PrimaryGeneratedColumn()
	id: number

	@Column('text')
	name: string

	@ManyToOne(() => PresetFolders, PresetFolders => PresetFolders.id, {
		nullable: true,
		createForeignKeyConstraints: false,
	})
	parent: PresetFolders

	@OneToMany(() => PresetFolders, presetFolder => presetFolder.parent)
	childFolders: PresetFolders[]

	@Column('integer', { default: 1 })
	sort: number

	@Column('text', {
		nullable: true,
		default: (): string => {
			return null
		},
	})
	icon: string | null

	@OneToMany(() => Preset, Preset => Preset.folder)
	presets: Preset[]

	@CreateDateColumn({ nullable: true })
	createdAt: Date

	@UpdateDateColumn({ nullable: true })
	updatedAt: Date

	@VersionColumn({ nullable: true })
	version: number
}
