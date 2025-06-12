import { useSelector, useDispatch } from 'react-redux'

// Custom hooks for common Redux operations
export const useAppSelector = useSelector
export const useAppDispatch = () => useDispatch()

// Expense-related hooks
export const useExpenses = () => {
  return useSelector(state => state.expenses.expenses)
}

export const useExpensesLoading = () => {
  return useSelector(state => state.expenses.loading)
}

export const useExpensesError = () => {
  return useSelector(state => state.expenses.error)
}

// Budget-related hooks
export const useBudgets = () => {
  return useSelector(state => state.budgets.budgets)
}

export const useBudgetsLoading = () => {
  return useSelector(state => state.budgets.loading)
}

export const useBudgetsError = () => {
  return useSelector(state => state.budgets.error)
}

// UI-related hooks
export const useActiveTab = () => {
  return useSelector(state => state.ui.activeTab)
}

export const useTheme = () => {
  return useSelector(state => state.ui.theme)
}

export const useNotifications = () => {
  return useSelector(state => state.ui.notifications)
}