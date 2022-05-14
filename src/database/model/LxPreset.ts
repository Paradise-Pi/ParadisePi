import { Column, Entity, ManyToOne } from 'typeorm'
import { PresetType } from './Preset'
import { LxPresetFolders } from './LxPresetFolders'
@Entity('lxPreset')
export class LxPreset extends PresetType {
	@Column('text')
	universe: string

	@Column('text', { nullable: true })
	setArguments: string | null

	@Column('integer', {
		default: 0,
		nullable: true,
	})
	fadeTime: number

	@ManyToOne(
		() => LxPresetFolders,
		lxPresetFolders => lxPresetFolders.presets,
		{
			nullable: true,
		}
	)
	folder: LxPresetFolders
}
