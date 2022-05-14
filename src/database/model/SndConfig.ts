import { Entity } from 'typeorm'
import { ConfigType } from './Config'

@Entity('sndConfig')
export class SndConfig extends ConfigType {}
