import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  LayoutDashboard, 
  Plus, 
  List, 
  Settings, 
  FileText, 
  Calculator,
  Plane,
  Menu,
  X
} from 'lucide-react'
import { setActiveTab, selectActiveTab } from '../store/slices/uiSlice'

const Header = () => {
  const dispatch = useDispatch()
  const activeTab = useSelector(selectActiveTab)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    setIsMobileMenuOpen(false) // Close mobile menu when tab is selected
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <Plane className="h-8 w-8 text-primary-600" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Travel Budget Planner</h1>
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1 overflow-x-auto pb-4">
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

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100 pb-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <nav className="flex flex-col space-y-1 pt-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  activeTab === id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header