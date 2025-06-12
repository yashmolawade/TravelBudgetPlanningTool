import { createSlice } from '@reduxjs/toolkit'
import { generateId } from '../../utils/helpers'

const initialState = {
  expenses: [],
  loading: false,
  error: null,
}

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    // Add a new expense
    addExpense: (state, action) => {
      const newExpense = {
        id: generateId(),
        ...action.payload,
        date: action.payload.date || new Date().toISOString().split('T')[0]
      }
      state.expenses.unshift(newExpense) // Add to beginning for newest first
    },
    
    // Update an existing expense
    updateExpense: (state, action) => {
      const { id, updatedData } = action.payload
      const index = state.expenses.findIndex(expense => expense.id === id)
      if (index !== -1) {
        state.expenses[index] = { ...state.expenses[index], ...updatedData }
      }
    },
    
    // Delete an expense
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter(expense => expense.id !== action.payload)
    },
    
    // Load expenses from localStorage
    loadExpenses: (state, action) => {
      state.expenses = action.payload || []
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    
    // Set error state
    setError: (state, action) => {
      state.error = action.payload
    },
    
    // Clear all expenses
    clearExpenses: (state) => {
      state.expenses = []
    }
  },
})

export const {
  addExpense,
  updateExpense,
  deleteExpense,
  loadExpenses,
  setLoading,
  setError,
  clearExpenses
} = expensesSlice.actions

export default expensesSlice.reducer

// Selectors
export const selectAllExpenses = (state) => state.expenses.expenses
export const selectExpensesLoading = (state) => state.expenses.loading
export const selectExpensesError = (state) => state.expenses.error
export const selectExpenseById = (state, expenseId) => 
  state.expenses.expenses.find(expense => expense.id === expenseId)