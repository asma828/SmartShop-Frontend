import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import clientReducer from './slices/clientSlice'
import productReducer from './slices/productSlice'
import orderReducer from './slices/orderSlice'
import paymentReducer from './slices/paymentSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientReducer,
    products: productReducer,
    orders: orderReducer,
    payments: paymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})