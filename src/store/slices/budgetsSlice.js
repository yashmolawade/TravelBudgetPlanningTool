import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  budgets: {},
  loading: false,
  error: null,
}

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    // Update budget for a specific category
    updateBudget: (state, action) => {
      const { category, amount } = action.payload
      state.budgets[category] = parseFloat(amount) || 0
    },
    
    // Update multiple budgets at once
    updateMultipleBudgets: (state, action) => {
      state.budgets = { ...state.budgets, ...action.payload }
    },
    
    // Load budgets from localStorage
    loadBudgets: (state, action) => {
      state.budgets = action.payload || {}
    },
    
    // Reset budget for a category
    resetBudget: (state, action) => {
      const category = action.payload
      delete state.budgets[category]
    },
    
    // Clear all budgets
    clearBudgets: (state) => {
      state.budgets = {}
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    
    // Set error state
    setError: (state, action) => {
      state.error = action.payload
    }
  },
})

export const {
  updateBudget,
  updateMultipleBudgets,
  loadBudgets,
  resetBudget,
  clearBudgets,
  setLoading,
  setError
} = budgetsSlice.actions

export default budgetsSlice.reducer

// Selectors
export const selectAllBudgets = (state) => state.budgets.budgets
export const selectBudgetsLoading = (state) => state.budgets.loading
export const selectBudgetsError = (state) => state.budgets.error
export const selectBudgetByCategory = (state, category) => 
  state.budgets.budgets[category] || 0
export const selectTotalBudget = (state) => 
  Object.values(state.budgets.budgets).reduce((sum, amount) => sum + amount, 0)