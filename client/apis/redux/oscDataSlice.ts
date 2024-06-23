import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OSCDatastore } from '../../../shared/sharedTypes'
import { ApiCall } from '../wrapper'
import store from './mainStore'

const initialState: OSCDatastore | null = null as OSCDatastore | null
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
			state = action.payload
		},
	},
})

// Action creators are generated for each case reducer function
export const { getOSCFromAPI, updateOSCDatastore } = oscDataSlice.actions

export default oscDataSlice.reducer
