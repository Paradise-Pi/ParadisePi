import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface Status {
	socketConnected: boolean
	passwordRequired: boolean
	socketClients: {
		[key: string]: {
			os: string
			ip: string
		}
	}
}
const initialState: Status = {
	socketConnected: false,
	passwordRequired: false,
	socketClients: {},
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
		setSocketClients: (state, action: PayloadAction<{ [key: string]: { os: string; ip: string } }>) => {
			return { ...state, socketClients: action.payload }
		},
		setSocketPasswordRequired: (state, action: PayloadAction<boolean>) => {
			return { ...state, passwordRequired: action.payload }
		},
	},
})

// Action creators are generated for each case reducer function
export const { storeManually, setSocketStatusConnection, setSocketClients, setSocketPasswordRequired } =
	statusSlice.actions

export default statusSlice.reducer
