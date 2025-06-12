import { doc, getDoc, setDoc, updateDoc, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore'
import { ref, set, get, push, remove } from 'firebase/database'
import { db, realtimeDb } from '../config/firebase'

// Firestore operations
export const firestoreService = {
  // User operations
  async getUserData(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      return userDoc.exists() ? userDoc.data() : null
    } catch (error) {
      console.error('Error getting user data:', error)
      throw error
    }
  },

  async updateUserData(userId, userData) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...userData,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating user data:', error)
      throw error
    }
  },

  // Budget operations
  async getUserBudgets(userId) {
    try {
      const budgetDoc = await getDoc(doc(db, 'users', userId, 'settings', 'budgets'))
      return budgetDoc.exists() ? budgetDoc.data().budgets : {}
    } catch (error) {
      console.error('Error getting user budgets:', error)
      throw error
    }
  },

  async updateUserBudgets(userId, budgets) {
    try {
      await setDoc(doc(db, 'users', userId, 'settings', 'budgets'), {
        budgets,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating user budgets:', error)
      throw error
    }
  },

  // Expense operations
  async getUserExpenses(userId) {
    try {
      const expenseDoc = await getDoc(doc(db, 'users', userId, 'settings', 'expenses'))
      return expenseDoc.exists() ? expenseDoc.data().expenses : []
    } catch (error) {
      console.error('Error getting user expenses:', error)
      throw error
    }
  },

  async updateUserExpenses(userId, expenses) {
    try {
      await setDoc(doc(db, 'users', userId, 'settings', 'expenses'), {
        expenses,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating user expenses:', error)
      throw error
    }
  }
}

// Realtime Database operations
export const realtimeService = {
  // User operations
  async getUserData(userId) {
    try {
      const snapshot = await get(ref(realtimeDb, `users/${userId}`))
      return snapshot.exists() ? snapshot.val() : null
    } catch (error) {
      console.error('Error getting user data from realtime DB:', error)
      throw error
    }
  },

  async updateUserData(userId, userData) {
    try {
      await set(ref(realtimeDb, `users/${userId}`), {
        ...userData,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating user data in realtime DB:', error)
      throw error
    }
  },

  // Budget operations
  async updateUserBudgets(userId, budgets) {
    try {
      await set(ref(realtimeDb, `users/${userId}/budgets`), budgets)
    } catch (error) {
      console.error('Error updating budgets in realtime DB:', error)
      throw error
    }
  },

  // Expense operations
  async updateUserExpenses(userId, expenses) {
    try {
      await set(ref(realtimeDb, `users/${userId}/expenses`), expenses)
    } catch (error) {
      console.error('Error updating expenses in realtime DB:', error)
      throw error
    }
  }
}