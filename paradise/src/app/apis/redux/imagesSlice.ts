import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import store from './mainStore'
import { ApiCall } from '../wrapper'
import { Images } from './../../../api/images'

const initialState: Images | null = null
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
			return (state = action.payload)
		},
		storeManually: (state, action: PayloadAction<Images>) => {
			return (state = action.payload)
		},
	},
})

// Action creators are generated for each case reducer function
export const { getImageDatastoreFromAPI, refreshImagesDatastore, storeManually } = imagesSlice.actions

export default imagesSlice.reducer
