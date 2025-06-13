import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, TrendingUp, AlertTriangle, Target, X } from "lucide-react";
import { calculateCategoryTotals, formatCurrency } from "../utils/helpers";

// Dashboard component displays financial insights, charts, and recent expenses.
// It consumes expense and budget data, providing visual summaries for the user.
const Dashboard = ({ expenses, budgets, categories }) => {
  // State to control the visibility of budget alerts.
  const [showAlerts, setShowAlerts] = useState(true);
  // Access the current theme (light/dark) from the Redux store to adjust chart colors.
  const theme = useSelector((state) => state.ui.theme);

  // Memoized calculation for total spending per category.
  // Recalculates only when 'expenses' prop changes, optimizing performance.
  const categoryTotals = useMemo(
    () => calculateCategoryTotals(expenses),
    [expenses]
  );

  // Memoized calculation for overall total amount spent.
  // Depends on 'categoryTotals' and updates when it changes.
  const totalSpent = useMemo(
    () =>
      Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0),
    [categoryTotals]
  );

  // Memoized calculation for the sum of all budget limits.
  // Updates only when 'budgets' prop changes.
  const totalBudget = useMemo(
    () => Object.values(budgets).reduce((sum, amount) => sum + amount, 0),
    [budgets]
  );

  // Prepares data for the Pie Chart.
  // Maps categories to their spent values and filters out categories with no spending.
  const pieChartData = categories
    .map((category) => ({
      name: category,
      value: categoryTotals[category] || 0,
      budget: budgets[category] || 0,
    }))
    .filter((item) => item.value > 0);

  // Prepares data for the Bar Chart.
  // Includes spent, budget, and remaining amounts for each category.
  // Replaces " & " with a newline for better category label display on the chart.
  const barChartData = categories.map((category) => ({
    category: category.replace(" & ", "\n& "),
    spent: categoryTotals[category] || 0,
    budget: budgets[category] || 0,
    remaining: Math.max(
      0,
      (budgets[category] || 0) - (categoryTotals[category] || 0)
    ),
  }));

  // Defines a set of colors for chart segments/bars to ensure visual distinction.
  const COLORS = [
    "#3b82f6", // blue-500
    "#ef4444", // red-500
    "#10b981", // green-500
    "#f59e0b", // yellow-500
    "#8b5cf6", // violet-500
    "#06b6d4", // cyan-500
    "#84cc16", // lime-500
    "#f97316", // orange-500
  ];

  // Identifies categories where spending is approaching or exceeding 80% of the budget.
  const budgetAlerts = categories.filter((category) => {
    const spent = categoryTotals[category] || 0;
    const budget = budgets[category] || 0;
    return budget > 0 && spent > budget * 0.8;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards Section */}
      {/* Displays key financial metrics like Total Spent, Total Budget, Remaining, and Budget Usage. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Spent Card */}
        <div className="card bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Spent
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        {/* Total Budget Card */}
        <div className="card bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Budget
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalBudget)}
              </p>
            </div>
            <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Remaining Budget Card */}
        <div className="card bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Remaining
              </p>
              <p
                className={`text-2xl font-bold ${
                  totalBudget - totalSpent >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {formatCurrency(totalBudget - totalSpent)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Budget Usage Card */}
        <div className="card bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Budget Usage
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalBudget > 0
                  ? Math.round((totalSpent / totalBudget) * 100)
                  : 0}
                %
              </p>
            </div>
            <AlertTriangle
              className={`h-8 w-8 ${
                totalSpent > totalBudget
                  ? "text-red-600 dark:text-red-400"
                  : "text-yellow-600 dark:text-yellow-400"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Budget Alerts Section */}
      {/* Displays alerts for categories nearing or exceeding their budget. */}
      {/* Only shown if there are alerts and 'showAlerts' state is true. */}
      {budgetAlerts.length > 0 && showAlerts && (
        <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                Budget Alerts
              </h3>
            </div>
            {/* Close button for budget alerts */}
            <button
              onClick={() => setShowAlerts(false)}
              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2">
            {budgetAlerts.map((category) => {
              const spent = categoryTotals[category] || 0;
              const budget = budgets[category] || 0;
              const percentage = Math.round((spent / budget) * 100);

              return (
                <div
                  key={category}
                  className="flex justify-between items-center"
                >
                  <span className="text-yellow-800 dark:text-yellow-200">
                    {category}
                  </span>
                  <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                    {percentage}% used ({formatCurrency(spent)} /{" "}
                    {formatCurrency(budget)})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Charts Section */}
      {/* Displays visual representations of spending data (Pie Chart and Bar Chart). */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart: Spending by Category */}
        <div className="card bg-white dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Spending by Category
          </h3>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                {/* Tooltip for Pie Chart: Displays category name and percentage on hover. */}
                {/* Styles adjusted for dark mode readability. */}
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1F2937" : "#F3F4F6",
                    border: "none",
                    borderRadius: "0.375rem",
                  }}
                  labelStyle={{
                    color: theme === "dark" ? "#F3F4F6" : "#1F2937",
                  }}
                  itemStyle={{
                    color: theme === "dark" ? "#F3F4F6" : "#1F2937",
                  }}
                  cursor={{ fill: theme === "dark" ? "#374151" : "#E5E7EB" }}
                  className="dark:fill-gray-700"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              No expenses to display
            </div>
          )}
        </div>

        {/* Bar Chart: Budget vs Spending */}
        <div className="card bg-white dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Budget vs Spending
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              {/* Grid lines for the chart */}
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              {/* X-Axis for categories, with rotation for readability of long labels */}
              <XAxis
                dataKey="category"
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              {/* Y-Axis for currency values */}
              <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} />
              {/* Tooltip for Bar Chart: Displays budget and spent amounts on hover. */}
              {/* Styles adjusted for dark mode readability. */}
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1F2937" : "#F3F4F6",
                  border: "none",
                  borderRadius: "0.375rem",
                }}
                labelStyle={{ color: theme === "dark" ? "#F3F4F6" : "#1F2937" }}
                itemStyle={{
                  color: theme === "dark" ? "#F3F4F6" : "#1F2937",
                }}
                cursor={{ fill: theme === "dark" ? "#374151" : "#E5E7EB" }}
                className="dark:fill-gray-700"
              />
              {/* Bar for Budget */}
              <Bar dataKey="budget" fill="#10b981" name="Budget" />
              {/* Bar for Spent */}
              <Bar dataKey="spent" fill="#ef4444" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Expenses Section */}
      {/* Displays a limited list of the most recent expenses. */}
      <div className="card bg-white dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Expenses
        </h3>
        {expenses.length > 0 ? (
          <div className="space-y-3">
            {expenses.slice(0, 5).map((expense) => (
              <div
                key={expense.id}
                className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {expense.description}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {expense.category} • {expense.date}
                  </p>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(expense.amount)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No expenses recorded yet
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
