import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Database } from './../../../api/database'
import store from './mainStore'
import { ApiCall } from './../wrapper'

const initialState: Database | null = null
const getFromAPIFatActionCreator = (): void => {
	// https://redux.js.org/faq/code-structure/#how-should-i-split-my-logic-between-reducers-and-action-creators-where-should-my-business-logic-go
	ApiCall.get('/database', {}).then(response => {
		store.dispatch(storeManually(response as Database))
	})
}
export const databaseSlice = createSlice({
	name: 'database',
	initialState,
	reducers: {
		getFromAPI: () => {
			getFromAPIFatActionCreator()
		},
		storeManually: (state, action: PayloadAction<Database>) => {
			return (state = action.payload)
		},
		setFromNode: (state, action: PayloadAction<Database>) => {
			return (state = action.payload)
		},
	},
})

// Action creators are generated for each case reducer function
export const { getFromAPI, setFromNode, storeManually } = databaseSlice.actions

export default databaseSlice.reducer
