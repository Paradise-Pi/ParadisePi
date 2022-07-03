export interface MeterLevels {
	[key: string]: number
}
/**
 * Function courtesy of Patrick‐Gilles Maillot (see their X32 Documentation)
 * @param d - the dB float data. d:[-90, +10]
 * @returns - OSC float data. f: [0.0, 1.0]
 */
const dbToPercentage = (d: number) => {
	let f = 0.0
	if (d <= -90) f = 0.0
	else if (d < -60) f = (d + 90) / 480
	else if (d < -30) f = (d + 70) / 160
	else if (d < -10) f = (d + 50) / 80
	else if (d <= 10) f = (d + 30) / 40
	/**
	 * f is now a fudged linear value between 0.0 and 1.0 for decibel values from -90 to 10.
	 * 0.75 = 0dB, so given our highest values are 0 we want to scale it again slightly to give us a 0.0 to 1.0 value for -90dB to +0 dB
	 * e.g: 0.375 should now be 0.5
	 */
	return f / 0.75
}
const xairLevels: MeterLevels = {
	'ch/01': 0.0, // channel 1 - prefade
	'ch/02': 0.0, // channel 2 - prefade
	'ch/03': 0.0, // channel 3 - prefade
	'ch/04': 0.0, // channel 4 - prefade
	'ch/05': 0.0, // channel 5 - prefade
	'ch/06': 0.0, // channel 6 - prefade
	'ch/07': 0.0, // channel 7 - prefade
	'ch/08': 0.0, // channel 8 - prefade
	'ch/09': 0.0, // channel 9 - prefade
	'ch/10': 0.0, // channel 10 - prefade
	'ch/11': 0.0, // channel 11 - prefade
	'ch/12': 0.0, // channel 12 - prefade
	'ch/13': 0.0, // channel 13 - prefade
	'ch/14': 0.0, // channel 14 - prefade
	'ch/15': 0.0, // channel 15 - prefade
	'ch/16': 0.0, // channel 16 - prefade
	'auxInLeft-unused': 0.0, // aux in channel - prefade (left)
	'auxInRight-unused': 0.0, // aux in channel - prefade (right)
	'fx1PreL-unused': 0.0, // FX 1 Prefade (Left)
	'fx1PreR-unused': 0.0, // FX 1 Prefade (Right)
	'fx2PreL-unused': 0.0, // FX 2 Prefade (Left)
	'fx2PreR-unused': 0.0, // FX 2 Prefade (Right)
	'fx3PreL-unused': 0.0, // FX 3 Prefade (Left)
	'fx3PreR-unused': 0.0, // FX 3 Prefade (Right)
	'fx4PreL-unused': 0.0, // FX 4 Prefade (Left)
	'fx4PreR-unused': 0.0, // FX 4 Prefade (Right)
	'bus/01': 0.0, // Bus 1 prefade
	'bus/02': 0.0, // Bus 2 prefade
	'bus/03': 0.0, // Bus 3 prefade
	'bus/04': 0.0, // Bus 4 prefade
	'bus/05': 0.0, // Bus 5 prefade
	'bus/06': 0.0, // Bus 6 prefade
	'fxsend/01': 0.0, // Effect send 1 prefade
	'fxsend/02': 0.0, // Effect send 2 prefade
	'fxsend/03': 0.0, // Effect send 3 prefade
	'fxsend/04': 0.0, // Effect send 4 prefade
	'lr/': 0.0, // Main mix out postfade (left)
	'leftRightRight-unused': 0.0, // Main mix out postfade (right)
	'monLeft-unused': 0.0, // Monitor out (left)
	'monRight-unused': 0.0, // Monitor out (right)
}
const x32Levels: MeterLevels = {
	'ch/01': 0.0,
	'ch/02': 0.0,
	'ch/03': 0.0,
	'ch/04': 0.0,
	'ch/05': 0.0,
	'ch/06': 0.0,
	'ch/07': 0.0,
	'ch/08': 0.0,
	'ch/09': 0.0,
	'ch/10': 0.0,
	'ch/11': 0.0,
	'ch/12': 0.0,
	'ch/13': 0.0,
	'ch/14': 0.0,
	'ch/15': 0.0,
	'ch/16': 0.0,
	'ch/17': 0.0,
	'ch/18': 0.0,
	'ch/19': 0.0,
	'ch/20': 0.0,
	'ch/21': 0.0,
	'ch/22': 0.0,
	'ch/23': 0.0,
	'ch/24': 0.0,
	'ch/25': 0.0,
	'ch/26': 0.0,
	'ch/27': 0.0,
	'ch/28': 0.0,
	'ch/29': 0.0,
	'ch/30': 0.0,
	'ch/31': 0.0,
	'ch/32': 0.0,
	'gateGainReductionChan1-unused': 0.0,
	'gateGainReductionChan2-unused': 0.0,
	'gateGainReductionChan3-unused': 0.0,
	'gateGainReductionChan4-unused': 0.0,
	'gateGainReductionChan5-unused': 0.0,
	'gateGainReductionChan6-unused': 0.0,
	'gateGainReductionChan7-unused': 0.0,
	'gateGainReductionChan8-unused': 0.0,
	'gateGainReductionChan9-unused': 0.0,
	'gateGainReductionChan10-unused': 0.0,
	'gateGainReductionChan11-unused': 0.0,
	'gateGainReductionChan12-unused': 0.0,
	'gateGainReductionChan13-unused': 0.0,
	'gateGainReductionChan14-unused': 0.0,
	'gateGainReductionChan15-unused': 0.0,
	'gateGainReductionChan16-unused': 0.0,
	'gateGainReductionChan17-unused': 0.0,
	'gateGainReductionChan18-unused': 0.0,
	'gateGainReductionChan19-unused': 0.0,
	'gateGainReductionChan20-unused': 0.0,
	'gateGainReductionChan21-unused': 0.0,
	'gateGainReductionChan22-unused': 0.0,
	'gateGainReductionChan23-unused': 0.0,
	'gateGainReductionChan24-unused': 0.0,
	'gateGainReductionChan25-unused': 0.0,
	'gateGainReductionChan26-unused': 0.0,
	'gateGainReductionChan27-unused': 0.0,
	'gateGainReductionChan28-unused': 0.0,
	'gateGainReductionChan29-unused': 0.0,
	'gateGainReductionChan30-unused': 0.0,
	'gateGainReductionChan31-unused': 0.0,
	'gateGainReductionChan32-unused': 0.0,
	'dynamicsGainReductionChan1-unused': 0.0,
	'dynamicsGainReductionChan2-unused': 0.0,
	'dynamicsGainReductionChan3-unused': 0.0,
	'dynamicsGainReductionChan4-unused': 0.0,
	'dynamicsGainReductionChan5-unused': 0.0,
	'dynamicsGainReductionChan6-unused': 0.0,
	'dynamicsGainReductionChan7-unused': 0.0,
	'dynamicsGainReductionChan8-unused': 0.0,
	'dynamicsGainReductionChan9-unused': 0.0,
	'dynamicsGainReductionChan10-unused': 0.0,
	'dynamicsGainReductionChan11-unused': 0.0,
	'dynamicsGainReductionChan12-unused': 0.0,
	'dynamicsGainReductionChan13-unused': 0.0,
	'dynamicsGainReductionChan14-unused': 0.0,
	'dynamicsGainReductionChan15-unused': 0.0,
	'dynamicsGainReductionChan16-unused': 0.0,
	'dynamicsGainReductionChan17-unused': 0.0,
	'dynamicsGainReductionChan18-unused': 0.0,
	'dynamicsGainReductionChan19-unused': 0.0,
	'dynamicsGainReductionChan20-unused': 0.0,
	'dynamicsGainReductionChan21-unused': 0.0,
	'dynamicsGainReductionChan22-unused': 0.0,
	'dynamicsGainReductionChan23-unused': 0.0,
	'dynamicsGainReductionChan24-unused': 0.0,
	'dynamicsGainReductionChan25-unused': 0.0,
	'dynamicsGainReductionChan26-unused': 0.0,
	'dynamicsGainReductionChan27-unused': 0.0,
	'dynamicsGainReductionChan28-unused': 0.0,
	'dynamicsGainReductionChan29-unused': 0.0,
	'dynamicsGainReductionChan30-unused': 0.0,
	'dynamicsGainReductionChan31-unused': 0.0,
	'dynamicsGainReductionChan32-unused': 0.0,
}
/**
 * Covert a Behringer Meter1 packet into a sensible percentage based set of values
 * @param inBuffer - the input buffer
 * @returns - MeterLevels object with the rectified levels from the input buffer
 */
export const meter1PacketParser = (
	inBuffer: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>,
	deviceType: string
) => {
	const thisBuffer = Buffer.from(inBuffer)
	let i = 4
	const levels = deviceType === 'x32' ? x32Levels : xairLevels
	Object.keys(levels).forEach(key => {
		if (thisBuffer.length >= i + 2) {
			let value = thisBuffer.readIntLE(i, 2) // Convert the two bytes into a signed int
			value = value / 256 // Convert to float as decibels
			value = dbToPercentage(value)
			levels[key] = value
		}
		i = i + 2 // Increment by two bytes for the next one
	})
	return levels
}
