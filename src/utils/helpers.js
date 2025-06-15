// Generate unique ID for expenses
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Helper function to format currency
export const formatCurrency = (amount) => {
  // Round to 2 decimal places to avoid floating point issues
  const roundedAmount = Math.round(amount * 100) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundedAmount);
};

// Helper function to calculate total expenses
export const calculateTotalExpenses = (expenses) => {
  if (!expenses || expenses.length === 0) return 0;
  // Use reduce with initial value of 0 to handle empty arrays
  const total = expenses.reduce((sum, expense) => {
    // Ensure amount is a number and round to 2 decimal places
    const amount = Math.round(parseFloat(expense.amount) * 100) / 100;
    return Math.round((sum + amount) * 100) / 100;
  }, 0);
  return total;
};

// Helper function to calculate category totals
export const calculateCategoryTotals = (expenses) => {
  if (!expenses || expenses.length === 0) return {};
  
  return expenses.reduce((totals, expense) => {
    const category = expense.category;
    // Ensure amount is a number and round to 2 decimal places
    const amount = Math.round(parseFloat(expense.amount) * 100) / 100;
    
    totals[category] = Math.round((totals[category] || 0 + amount) * 100) / 100;
    return totals;
  }, {});
};

// Helper function to group expenses by date
export const groupExpensesByDate = (expenses) => {
  if (!expenses || expenses.length === 0) return {};
  
  return expenses.reduce((groups, expense) => {
    const date = expense.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    // Ensure amount is a number and round to 2 decimal places
    const amount = Math.round(parseFloat(expense.amount) * 100) / 100;
    groups[date].push({ ...expense, amount });
    return groups;
  }, {});
};

// Save data to localStorage
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

// Load data from localStorage
export const loadFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return null;
  }
};

// Helper function to calculate budget progress
export const calculateBudgetProgress = (totalSpent, totalBudget) => {
  if (!totalBudget || totalBudget <= 0) return 0;
  // Round to 2 decimal places
  const percentage = Math.round((totalSpent / totalBudget) * 10000) / 100;
  return Math.min(percentage, 100); // Cap at 100%
};

// Get budget status (under, near, over)
export const getBudgetStatus = (spent, budget) => {
  if (!budget || budget === 0) return "no-budget";

  const percentage = (spent / budget) * 100;

  if (percentage <= 70) return "under";
  if (percentage <= 100) return "near";
  return "over";
};

// Helper function to format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Calculate days between dates
export const daysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);

  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

// Helper function to validate expense
export const validateExpense = (expense) => {
  const errors = {};

  if (!expense.description?.trim()) {
    errors.description = "Description is required";
  } else if (expense.description.length > 100) {
    errors.description = "Description must be less than 100 characters";
  }

  const amount = parseFloat(expense.amount);
  if (!expense.amount) {
    errors.amount = "Amount is required";
  } else if (isNaN(amount)) {
    errors.amount = "Amount must be a valid number";
  } else if (amount <= 0) {
    errors.amount = "Amount must be greater than 0";
  } else if (amount > 1000000) {
    errors.amount = "Amount must be less than 1,000,000";
  }

  if (!expense.date) {
    errors.date = "Date is required";
  } else {
    const selectedDate = new Date(expense.date);
    const today = new Date();
    if (selectedDate > today) {
      errors.date = "Date cannot be in the future";
    }
  }

  if (expense.notes && expense.notes.length > 500) {
    errors.notes = "Notes must be less than 500 characters";
  }

  return errors;
};

// Sort expenses by date (newest first)
export const sortExpensesByDate = (expenses, ascending = false) => {
  return [...expenses].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// Filter expenses by date range
export const filterExpensesByDateRange = (expenses, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= start && expenseDate <= end;
  });
};

// Helper function to calculate average daily spending
export const calculateAverageDailySpending = (expenses, startDate, endDate) => {
  if (!expenses || expenses.length === 0 || !startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

  const totalSpent = calculateTotalExpenses(expenses);
  // Round to 2 decimal places
  const average = Math.round((totalSpent / days) * 100) / 100;
  return average;
};

// Helper function to calculate remaining budget
export const calculateRemainingBudget = (totalBudget, totalSpent) => {
  // Round to 2 decimal places
  return Math.round((totalBudget - totalSpent) * 100) / 100;
};

// Helper function to calculate percentage of budget spent
export const calculateBudgetPercentage = (totalSpent, totalBudget) => {
  if (!totalBudget || totalBudget <= 0) return 0;
  // Round to 2 decimal places
  return Math.round((totalSpent / totalBudget) * 10000) / 100;
};

// Helper function to check if budget is exceeded
export const isBudgetExceeded = (totalSpent, totalBudget) => {
  return totalSpent > totalBudget;
};

// Helper function to calculate savings
export const calculateSavings = (totalBudget, totalSpent) => {
  // Round to 2 decimal places
  return Math.round((totalBudget - totalSpent) * 100) / 100;
};

// Helper function to calculate daily budget
export const calculateDailyBudget = (totalBudget, startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  
  // Round to 2 decimal places
  return Math.round((totalBudget / days) * 100) / 100;
};
