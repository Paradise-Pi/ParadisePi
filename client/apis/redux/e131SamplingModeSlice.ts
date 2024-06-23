import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface E131SamplingMode {
	sampling: boolean
	startedTimestamp: number
	finishingTimestamp: number
	messages: Array<string>
}
const initialState: E131SamplingMode = {
	sampling: false,
	startedTimestamp: 0,
	finishingTimestamp: 0,
	messages: [],
}
export const e131SamplingModeSlice = createSlice({
	name: 'e131SamplingMode',
	initialState,
	reducers: {
		storeManually: (state, action: PayloadAction<E131SamplingMode>) => {
			return (state = action.payload)
		},
		setFromAPI: (
			state,
			action: PayloadAction<{ messageType: string; status?: boolean; duration?: number; message: string }>
		) => {
			const returnVar = state
			if (typeof action.payload.status !== 'undefined') {
				returnVar.sampling = action.payload.status
			}
			if (action.payload.messageType === 'START') {
				returnVar.messages = []
				returnVar.startedTimestamp = new Date().getTime()
				returnVar.finishingTimestamp = returnVar.startedTimestamp + action.payload.duration
			} else if (action.payload.messageType === 'STOP') {
				returnVar.startedTimestamp = 0
				returnVar.finishingTimestamp = 0
			}
			returnVar.messages.push(action.payload.message)
		},
	},
})

export const { storeManually, setFromAPI } = e131SamplingModeSlice.actions
export default e131SamplingModeSlice.reducer
