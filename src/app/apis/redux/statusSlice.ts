import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface Status {
	socketConnected: boolean
}
const initialState: Status = {
	socketConnected: false,
}
export const statusSlice = createSlice({
	name: 'status',
	initialState,
	reducers: {
		storeManually: (state, action: PayloadAction<Status>) => {
			return (state = action.payload)
		},
		setSocketStatusConnection: (state, action: PayloadAction<boolean>) => {
			return { ...state, socketConnected: action.payload }
		},
	},
})

// Action creators are generated for each case reducer function
export const { storeManually, setSocketStatusConnection } = statusSlice.actions

export default statusSlice.reducer
