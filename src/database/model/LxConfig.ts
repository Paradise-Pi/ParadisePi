import { Entity } from 'typeorm'
import { ConfigType } from './Config'

@Entity('lxConfig')
export class LxConfig extends ConfigType {}
