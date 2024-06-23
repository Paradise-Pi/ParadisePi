import osc from '../../index'

export default class behringerXAir extends osc {
	constructor(address: string) {
		super(address, 10024, 'xair')
	}
}
