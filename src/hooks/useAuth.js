import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import { loginSuccess, logout, setLoading } from '../store/slices/authSlice'
import { loadExpenses } from '../store/slices/expensesSlice'
import { loadBudgets } from '../store/slices/budgetsSlice'
import { firestoreService } from '../services/firebaseService'

export const useAuth = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLoading(true))
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user data from Firestore
          const userData = await firestoreService.getUserData(user.uid)
          
          // Get user's expenses and budgets
          const expenses = await firestoreService.getUserExpenses(user.uid)
          const budgets = await firestoreService.getUserBudgets(user.uid)
          
          // Update Redux state
          dispatch(loginSuccess({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            ...userData
          }))
          
          // Load user's data
          dispatch(loadExpenses(expenses))
          dispatch(loadBudgets(budgets))
          
        } catch (error) {
          console.error('Error loading user data:', error)
          dispatch(logout())
        }
      } else {
        dispatch(logout())
      }
      
      dispatch(setLoading(false))
    })

    return () => unsubscribe()
  }, [dispatch])
}