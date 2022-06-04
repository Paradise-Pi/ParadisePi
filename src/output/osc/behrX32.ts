import osc from ".";

export default class behrX32 extends osc {

    constructor(address:string) {
        super(address, 10023, '/main/st')
    }
}