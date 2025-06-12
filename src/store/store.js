import { configureStore } from "@reduxjs/toolkit";
import expensesReducer from "./slices/expensesSlice";
import budgetsReducer from "./slices/budgetsSlice";
import uiReducer from "./slices/uiSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    budgets: budgetsReducer,
    ui: uiReducer,
    auth: authReducer,
  },
});

// Export store types for use in other files
export const getRootState = () => store.getState();
export const getAppDispatch = () => store.dispatch;
