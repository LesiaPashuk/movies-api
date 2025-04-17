import { Action, combineReducers, configureStore, createStore, Reducer } from '@reduxjs/toolkit';
import {reducerForCard} from '../state/reducer-for-card';
export const rootReducer=combineReducers({
    cards:reducerForCard,
})
export const store = configureStore({
    reducer:rootReducer,
})
export type RootStateType = ReturnType<typeof rootReducer>;