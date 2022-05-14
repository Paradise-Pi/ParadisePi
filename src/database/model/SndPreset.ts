import { Column, Entity } from 'typeorm'
import { PresetType } from './Preset'

@Entity('sndPreset')
export class SndPreset extends PresetType {
	@Column('text', { nullable: true })
	data: string | null
}
