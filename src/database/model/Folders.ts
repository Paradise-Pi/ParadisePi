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

@Entity('folders', {
	orderBy: {
		sort: 'ASC',
		name: 'ASC',
	},
})
export class Folders {
	@PrimaryGeneratedColumn()
	id: number

	@Column('text')
	name: string

	@ManyToOne(() => Folders, Folders => Folders.id, {
		nullable: true,
		createForeignKeyConstraints: false,
	})
	parent: Folders

	@OneToMany(() => Folders, folder => folder.parent)
	childFolders: Folders[]

	@Column('integer', { default: 1 })
	sort: number

	@Column('text', {
		nullable: true,
		default: (): string => {
			return null
		},
	})
	icon: string | null

	@Column('text', {
		nullable: true,
		default: (): string => {
			return null
		},
	})
	infoText: string | null

	@OneToMany(() => Preset, Preset => Preset.folder)
	presets: Preset[]

	@CreateDateColumn({ nullable: true })
	createdAt: Date

	@UpdateDateColumn({ nullable: true })
	updatedAt: Date

	@VersionColumn({ nullable: true })
	version: number
}
