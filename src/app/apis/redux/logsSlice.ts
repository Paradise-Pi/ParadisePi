import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface Logs {
	logs: Array<string>
}
const initialState: Logs = {
	logs: ['{"message":"Logs will appear as they are received"}'],
}
export const logsSlice = createSlice({
	name: 'logs',
	initialState,
	reducers: {
		appendLogline: (state, action: PayloadAction<string>) => {
			const newLogs = state.logs
			if (state.logs.length > 19) newLogs.pop() //Don't let the logs grow too big to keep the UI responsive and the memory usage low
			newLogs.unshift(action.payload)

			state.logs = newLogs
			return state
		},
	},
})

export const { appendLogline } = logsSlice.actions
export default logsSlice.reducer
