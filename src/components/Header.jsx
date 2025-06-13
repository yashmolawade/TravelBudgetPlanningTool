import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import {
  LayoutDashboard,
  Plus,
  List,
  Settings,
  FileText,
  Calculator,
  Plane,
  Menu,
  X,
  LogOut,
  User,
  Sun,
  Moon,
} from "lucide-react";
import { auth } from "../config/firebase";
import {
  setActiveTab,
  selectActiveTab,
  setTheme,
} from "../store/slices/uiSlice";
import { logout, selectUser } from "../store/slices/authSlice";

const Header = ({ onLogoClick }) => {
  const dispatch = useDispatch();
  const activeTab = useSelector(selectActiveTab);
  const user = useSelector(selectUser);
  const theme = useSelector((state) => state.ui.theme);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "add-expense", label: "Add Expense", icon: Plus },
    { id: "expenses", label: "Expenses", icon: List },
    { id: "budget", label: "Budget", icon: Settings },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "converter", label: "Currency", icon: Calculator },
  ];

  const handleTabChange = (tabId) => {
    dispatch(setActiveTab(tabId));
    setIsMobileMenuOpen(false); // Close mobile menu when tab is selected
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleTheme = () => {
    dispatch(setTheme(theme === "light" ? "dark" : "light"));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={onLogoClick}
          >
            <Plane className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Travel Buddy
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={
                theme === "light"
                  ? "Switch to Dark Mode"
                  : "Switch to Light Mode"
              }
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="hidden md:block text-sm font-medium">
                  {user?.displayName || user?.email}
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.displayName}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
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
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1 overflow-x-auto pb-4">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === id
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-96 opacity-100 pb-4"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <nav className="flex flex-col space-y-1 pt-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  activeTab === id
                    ? "bg-primary-600 text-white"
                    : "text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
