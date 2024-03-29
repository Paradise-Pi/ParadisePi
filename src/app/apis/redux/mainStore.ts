import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import databaseSliceReducer from './databaseSlice'
import statusSliceReducer from './statusSlice'
import e131SamplingModeReducer from './e131SamplingModeSlice'
import oscDataSliceReducer from './oscDataSlice'
import logsSliceReducer from './logsSlice'
import imagesSliceReducer from './imagesSlice'

const store = configureStore({
	reducer: {
		database: databaseSliceReducer, // Master database
		status: statusSliceReducer, // Status of whether we are connected to the server or not, and which clients are connected
		e131SamplingMode: e131SamplingModeReducer, // Whether we are currently in e131 sampling mode or not
		logs: logsSliceReducer, // Logging sent from node.js
		oscDatastore: oscDataSliceReducer, // The OSC datastore
		images: imagesSliceReducer, // The images datastore - full of base64 images (ouch! Thanks webpack)
	},
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
