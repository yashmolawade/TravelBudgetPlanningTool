import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  LayoutDashboard, 
  Plus, 
  List, 
  Settings, 
  FileText, 
  Calculator,
  Plane
} from 'lucide-react'
import { setActiveTab, selectActiveTab } from '../store/slices/uiSlice'

const Header = () => {
  const dispatch = useDispatch()
  const activeTab = useSelector(selectActiveTab)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add-expense', label: 'Add Expense', icon: Plus },
    { id: 'expenses', label: 'Expenses', icon: List },
    { id: 'budget', label: 'Budget', icon: Settings },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'converter', label: 'Currency', icon: Calculator },
  ]

  const handleTabChange = (tabId) => {
    dispatch(setActiveTab(tabId))
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <Plane className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">Travel Budget Planner</h1>
          </div>
        </div>
        
        <nav className="flex space-x-1 overflow-x-auto pb-4">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors duration-200 ${
                activeTab === id
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header