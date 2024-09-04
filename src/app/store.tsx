import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from '../features/api/apiSlice';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    
    // This middleware is required when we use RTK query and slice together
    // The getDefaultMiddleware function returns the default middleware that is used by the store.
    // It is a list and we concat the apiSlice.middleware to it.
    // The apiSlice.middleware manages the cache lifetimes and expiration
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

export type RootState = ReturnType<typeof store.getState>