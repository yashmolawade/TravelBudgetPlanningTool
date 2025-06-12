import { useMemo } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DollarSign, TrendingUp, AlertTriangle, Target } from 'lucide-react'
import { calculateCategoryTotals, formatCurrency } from '../utils/helpers'

const Dashboard = ({ expenses, budgets, categories }) => {
  const categoryTotals = useMemo(() => calculateCategoryTotals(expenses), [expenses])
  const totalSpent = useMemo(() => Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0), [categoryTotals])
  const totalBudget = useMemo(() => Object.values(budgets).reduce((sum, amount) => sum + amount, 0), [budgets])

  const pieChartData = categories
    .map(category => ({
      name: category,
      value: categoryTotals[category] || 0,
      budget: budgets[category] || 0
    }))
    .filter(item => item.value > 0)

  const barChartData = categories.map(category => ({
    category: category.replace(' & ', '\n& '),
    spent: categoryTotals[category] || 0,
    budget: budgets[category] || 0,
    remaining: Math.max(0, (budgets[category] || 0) - (categoryTotals[category] || 0))
  }))

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']

  const budgetAlerts = categories.filter(category => {
    const spent = categoryTotals[category] || 0
    const budget = budgets[category] || 0
    return budget > 0 && spent > budget * 0.8
  })

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
            </div>
            <Target className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className={`text-2xl font-bold ${totalBudget - totalSpent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalBudget - totalSpent)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budget Usage</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
              </p>
            </div>
            <AlertTriangle className={`h-8 w-8 ${totalSpent > totalBudget ? 'text-red-600' : 'text-yellow-600'}`} />
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-800">Budget Alerts</h3>
          </div>
          <div className="space-y-2">
            {budgetAlerts.map(category => {
              const spent = categoryTotals[category] || 0
              const budget = budgets[category] || 0
              const percentage = Math.round((spent / budget) * 100)
              
              return (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-yellow-800">{category}</span>
                  <span className="text-yellow-800 font-medium">
                    {percentage}% used ({formatCurrency(spent)} / {formatCurrency(budget)})
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No expenses to display
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget vs Spending</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="budget" fill="#e5e7eb" name="Budget" />
              <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
        {expenses.length > 0 ? (
          <div className="space-y-3">
            {expenses.slice(0, 5).map(expense => (
              <div key={expense.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{expense.description}</p>
                  <p className="text-sm text-gray-600">{expense.category} • {expense.date}</p>
                </div>
                <p className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No expenses recorded yet</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard