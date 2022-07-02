import osc from './../../index'

export default class behringerX32 extends osc {
	constructor(address: string) {
		super(address, 10023, 'x32')
	}
}
