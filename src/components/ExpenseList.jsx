import React, { useState, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { Edit2, Trash2, Search, Filter } from 'lucide-react'
import { updateExpense, deleteExpense } from '../store/slices/expensesSlice'
import { addNotification } from '../store/slices/uiSlice'
import { formatCurrency } from '../utils/helpers'

const ExpenseList = ({ expenses, categories }) => {
  const dispatch = useDispatch()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || expense.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [expenses, searchTerm, selectedCategory])

  const handleEdit = (expense) => {
    setEditingId(expense.id)
    setEditForm(expense)
  }

  const handleSaveEdit = () => {
    dispatch(updateExpense({
      id: editingId,
      updatedData: {
        ...editForm,
        amount: parseFloat(editForm.amount)
      }
    }))
    
    dispatch(addNotification({
      type: 'success',
      message: 'Expense updated successfully!',
      title: 'Success'
    }))
    
    setEditingId(null)
    setEditForm({})
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      dispatch(deleteExpense(id))
      
      dispatch(addNotification({
        type: 'success',
        message: 'Expense deleted successfully!',
        title: 'Success'
      }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Expense List</h2>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <div className="md:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field pl-10"
              >
                <option value="All">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Expense List */}
        {filteredExpenses.length > 0 ? (
          <div className="space-y-4">
            {filteredExpenses.map(expense => (
              <div key={expense.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {editingId === expense.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        className="input-field"
                        placeholder="Description"
                      />
                      <input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) => setEditForm(prev => ({ ...prev, amount: e.target.value }))}
                        className="input-field"
                        placeholder="Amount"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                        className="input-field"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                        className="input-field"
                      />
                    </div>
                    
                    <textarea
                      value={editForm.notes || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                      className="input-field"
                      placeholder="Notes"
                      rows={2}
                    />
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="btn-primary text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn-secondary text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{expense.description}</h3>
                        <p className="text-xl font-bold text-primary-600">{formatCurrency(expense.amount)}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                        <span className="bg-gray-100 px-2 py-1 rounded">{expense.category}</span>
                        <span>{expense.date}</span>
                      </div>
                      
                      {expense.notes && (
                        <p className="text-gray-600 text-sm">{expense.notes}</p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No expenses found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start by adding your first expense'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExpenseList