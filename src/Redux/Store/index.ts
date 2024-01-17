import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../../Redux/Reducer';

export const store = configureStore({
    reducer: rootReducer
});