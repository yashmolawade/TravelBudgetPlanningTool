import { configureStore } from '@reduxjs/toolkit'
import expensesReducer from './slices/expensesSlice'
import budgetsReducer from './slices/budgetsSlice'
import uiReducer from './slices/uiSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    budgets: budgetsReducer,
    ui: uiReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

// Note: TypeScript type exports removed for JavaScript compatibility
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch