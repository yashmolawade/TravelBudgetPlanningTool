// Generate unique ID for expenses
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Format currency with proper symbol and decimals
export const formatCurrency = (amount, currency = 'USD') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  
  return formatter.format(amount || 0)
}

// Calculate total spending by category
export const calculateCategoryTotals = (expenses) => {
  return expenses.reduce((totals, expense) => {
    const category = expense.category
    totals[category] = (totals[category] || 0) + expense.amount
    return totals
  }, {})
}

// Group expenses by date for charts
export const groupExpensesByDate = (expenses) => {
  return expenses.reduce((groups, expense) => {
    const date = expense.date
    groups[date] = (groups[date] || 0) + expense.amount
    return groups
  }, {})
}

// Save data to localStorage
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Load data from localStorage
export const loadFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return null
  }
}

// Calculate budget progress percentage
export const calculateBudgetProgress = (spent, budget) => {
  if (!budget || budget === 0) return 0
  return Math.min((spent / budget) * 100, 100)
}

// Get budget status (under, near, over)
export const getBudgetStatus = (spent, budget) => {
  if (!budget || budget === 0) return 'no-budget'
  
  const percentage = (spent / budget) * 100
  
  if (percentage <= 70) return 'under'
  if (percentage <= 100) return 'near'
  return 'over'
}

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Calculate days between dates
export const daysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000
  const firstDate = new Date(date1)
  const secondDate = new Date(date2)
  
  return Math.round(Math.abs((firstDate - secondDate) / oneDay))
}

// Validate expense data
export const validateExpense = (expense) => {
  const errors = {}
  
  if (!expense.description || expense.description.trim() === '') {
    errors.description = 'Description is required'
  }
  
  if (!expense.amount || expense.amount <= 0) {
    errors.amount = 'Amount must be greater than 0'
  }
  
  if (!expense.category) {
    errors.category = 'Category is required'
  }
  
  if (!expense.date) {
    errors.date = 'Date is required'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Sort expenses by date (newest first)
export const sortExpensesByDate = (expenses, ascending = false) => {
  return [...expenses].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    
    return ascending ? dateA - dateB : dateB - dateA
  })
}

// Filter expenses by date range
export const filterExpensesByDateRange = (expenses, startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    return expenseDate >= start && expenseDate <= end
  })
}

// Calculate average daily spending
export const calculateAverageDailySpending = (expenses) => {
  if (expenses.length === 0) return 0
  
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const uniqueDates = [...new Set(expenses.map(expense => expense.date))]
  
  return uniqueDates.length > 0 ? totalSpent / uniqueDates.length : 0
}