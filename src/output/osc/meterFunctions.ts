export interface iLevels {
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
/**
 * Covert a Behringer Meter1 packet into a sensible percentage based set of values
 * @param inBuffer - the input buffer
 * @returns - iLevels object with the rectified levels from the input buffer
 */
export const meter1PacketParser = (inBuffer: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) => {
	const thisBuffer = Buffer.from(inBuffer)
	const levels: iLevels = {
		// Output structure
		'1': 0.0, // channel 1 - prefade
		'2': 0.0, // channel 2 - prefade
		'3': 0.0, // channel 3 - prefade
		'4': 0.0, // channel 4 - prefade
		'5': 0.0, // channel 5 - prefade
		'6': 0.0, // channel 6 - prefade
		'7': 0.0, // channel 7 - prefade
		'8': 0.0, // channel 8 - prefade
		'9': 0.0, // channel 9 - prefade
		'10': 0.0, // channel 10 - prefade
		'11': 0.0, // channel 11 - prefade
		'12': 0.0, // channel 12 - prefade
		'13': 0.0, // channel 13 - prefade
		'14': 0.0, // channel 14 - prefade
		'15': 0.0, // channel 15 - prefade
		'16': 0.0, // channel 16 - prefade
		auxL: 0.0, // aux in channel - prefade (left)
		auxR: 0.0, // aux in channel - prefade (right)
		fx1PreL: 0.0, // Effect prefade
		fx1PreR: 0.0,
		fx2PreL: 0.0,
		fx2PreR: 0.0,
		fx3PreL: 0.0,
		fx3PreR: 0.0,
		fx4PreL: 0.0,
		fx4PreR: 0.0,
		bus1Pre: 0.0, // Bus prefade
		bus2Pre: 0.0,
		bus3Pre: 0.0,
		bus4Pre: 0.0,
		bus5Pre: 0.0,
		bus6Pre: 0.0,
		fx1SendPre: 0.0, // Effect send prefade
		fx2SendPre: 0.0,
		fx3SendPre: 0.0,
		fx4SendPre: 0.0,
		mainPostL: 0.0, // Main mix out postfade (left)
		mainPostR: 0.0, // Main mix out postfade (right)
		monL: 0.0, // Monitor out (left)
		monR: 0.0, // Monitor out (right)
	}
	let i = 4
	Object.keys(levels).forEach(function (key) {
		let value = thisBuffer.readIntLE(i, 2) // Convert the two bytes into a signed int
		value = value / 256 // Convert to float as decibels
		value = dbToPercentage(value)
		levels[key] = value
		i = i + 2 // Increment by two bytes for the next one
	})
	return levels
}
