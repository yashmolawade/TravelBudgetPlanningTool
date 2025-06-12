import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadExpenses } from '../store/slices/expensesSlice'
import { loadBudgets } from '../store/slices/budgetsSlice'
import { loadFromStorage, saveToStorage } from '../utils/helpers'

// Custom hook to handle localStorage synchronization
export const useLocalStorage = (expenses, budgets) => {
  const dispatch = useDispatch()

  // Load data from localStorage on mount
  useEffect(() => {
    const savedExpenses = loadFromStorage('travel-expenses')
    const savedBudgets = loadFromStorage('travel-budgets')
    
    if (savedExpenses) {
      dispatch(loadExpenses(savedExpenses))
    }
    
    if (savedBudgets) {
      dispatch(loadBudgets(savedBudgets))
    }
  }, [dispatch])

  // Save expenses to localStorage when they change
  useEffect(() => {
    if (expenses.length >= 0) { // Check for array existence
      saveToStorage('travel-expenses', expenses)
    }
  }, [expenses])

  // Save budgets to localStorage when they change
  useEffect(() => {
    if (Object.keys(budgets).length >= 0) { // Check for object existence
      saveToStorage('travel-budgets', budgets)
    }
  }, [budgets])
}