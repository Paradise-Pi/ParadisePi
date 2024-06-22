import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import store from './mainStore'
import { ApiCall } from '../wrapper'
import { OSCDatastore } from './../../../output/osc'

const initialState: OSCDatastore | null = null
const getFromAPIFatActionCreator = (): void => {
	// https://redux.js.org/faq/code-structure/#how-should-i-split-my-logic-between-reducers-and-action-creators-where-should-my-business-logic-go
	ApiCall.get('/outputModules/osc/getDatastore', {}).then(response => {
		store.dispatch(updateOSCDatastore(response as OSCDatastore))
	})
}
export const oscDataSlice = createSlice({
	name: 'OSCDatastore',
	initialState,
	reducers: {
		getOSCFromAPI: () => {
			getFromAPIFatActionCreator()
		},
		updateOSCDatastore: (state, action: PayloadAction<OSCDatastore>) => {
			return (state = action.payload)
		},
	},
})

// Action creators are generated for each case reducer function
export const { getOSCFromAPI, updateOSCDatastore } = oscDataSlice.actions

export default oscDataSlice.reducer
