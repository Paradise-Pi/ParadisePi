import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Images } from '../../../shared/sharedTypes'
import { ApiCall } from '../wrapper'
import store from './mainStore'
const initialState: Images | null = null as Images | null
const getFromImageAPIFatActionCreator = (): void => {
	// https://redux.js.org/faq/code-structure/#how-should-i-split-my-logic-between-reducers-and-action-creators-where-should-my-business-logic-go
	ApiCall.get('/images', {}).then(response => {
		store.dispatch(storeManually(response as Images))
	})
}
export const imagesSlice = createSlice({
	name: 'images',
	initialState,
	reducers: {
		getImageDatastoreFromAPI: () => {
			getFromImageAPIFatActionCreator()
		},
		refreshImagesDatastore: (state, action: PayloadAction<Images>) => {
			state = action.payload
		},
		storeManually: (state, action: PayloadAction<Images>) => {
			state = action.payload
		},
	},
})

// Action creators are generated for each case reducer function
export const { getImageDatastoreFromAPI, refreshImagesDatastore, storeManually } = imagesSlice.actions

export default imagesSlice.reducer
