import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface OSCMeters {
	valueTODO: number
}
const initialState: OSCMeters = {
	valueTODO: 0,
}
export const oscMetersSlice = createSlice({
	name: 'oscMeters',
	initialState,
	reducers: {
		storeManually: (state, action: PayloadAction<OSCMeters>) => {
			return (state = action.payload)
		},
	},
})

// Action creators are generated for each case reducer function
export const { storeManually } = oscMetersSlice.actions

export default oscMetersSlice.reducer
