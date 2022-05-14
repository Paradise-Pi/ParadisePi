import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToOne,
} from 'typeorm'
import { LxPreset } from './LxPreset'
@Entity('lxPresetFolders')
export class LxPresetFolders {
	@PrimaryGeneratedColumn()
	id: number

	@Column('text')
	name: string

	@ManyToOne(() => LxPresetFolders, lxPresetFolders => lxPresetFolders.id, {
		nullable: true,
	})
	parent: LxPresetFolders

	@OneToMany(() => LxPreset, lxPreset => lxPreset.folder)
	presets: LxPreset[]
}
