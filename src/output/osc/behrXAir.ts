import osc from ".";

export default class behrXAir extends osc {

    constructor(address:string) {
        super(address, 10024, '/lr');
    }
}