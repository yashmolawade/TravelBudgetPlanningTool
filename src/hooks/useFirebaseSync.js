import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../store/slices/authSlice'
import { selectAllExpenses } from '../store/slices/expensesSlice'
import { selectAllBudgets } from '../store/slices/budgetsSlice'
import { firestoreService, realtimeService } from '../services/firebaseService'

// Custom hook to sync data with Firebase
export const useFirebaseSync = () => {
  const user = useSelector(selectUser)
  const expenses = useSelector(selectAllExpenses)
  const budgets = useSelector(selectAllBudgets)

  // Sync expenses to Firebase when they change
  useEffect(() => {
    if (user?.uid && expenses.length >= 0) {
      const syncExpenses = async () => {
        try {
          await firestoreService.updateUserExpenses(user.uid, expenses)
          await realtimeService.updateUserExpenses(user.uid, expenses)
        } catch (error) {
          console.error('Error syncing expenses:', error)
        }
      }
      
      // Debounce the sync to avoid too many writes
      const timeoutId = setTimeout(syncExpenses, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [user?.uid, expenses])

  // Sync budgets to Firebase when they change
  useEffect(() => {
    if (user?.uid && Object.keys(budgets).length >= 0) {
      const syncBudgets = async () => {
        try {
          await firestoreService.updateUserBudgets(user.uid, budgets)
          await realtimeService.updateUserBudgets(user.uid, budgets)
        } catch (error) {
          console.error('Error syncing budgets:', error)
        }
      }
      
      // Debounce the sync to avoid too many writes
      const timeoutId = setTimeout(syncBudgets, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [user?.uid, budgets])
}