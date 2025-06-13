import React from "react";
import { Plane } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../store/slices/uiSlice";
import { Moon, Sun } from "lucide-react";

// LandingPage component: This is the first page users see.
// It's designed to introduce Travel Buddy, highlight its features,
// and encourage users to sign up or sign in.
const LandingPage = ({
  isAuthenticated,
  onSignInClick,
  onSignUpClick,
  onDashboardClick,
}) => {
  // Retrieve the current theme from the Redux store.
  // This determines whether the app is in 'light' or 'dark' mode.
  const theme = useSelector((state) => state.ui.theme);
  // Get the dispatch function to send actions to the Redux store.
  const dispatch = useDispatch();

  // Function to toggle between light and dark themes.
  // It dispatches the 'setTheme' action with the opposite of the current theme.
  const handleThemeToggle = () => {
    dispatch(setTheme(theme === "dark" ? "light" : "dark"));
  };

  return (
    // Main container div for the entire landing page.
    // Sets default font, text color (light/dark mode), and background color.
    // `min-h-screen` ensures the background covers the entire viewport height.
    <div className="font-sans text-gray-800 dark:text-gray-200 bg-white dark:bg-black min-h-screen">
      {/* Dark Mode Toggle Button */}
      {/* Positioned absolutely at the top-right, with high z-index to be always visible. */}
      {/* Changes icon based on current theme (Sun for dark, Moon for light). */}
      <button
        onClick={handleThemeToggle}
        className="absolute top-6 right-6 p-2 rounded-full bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-200 shadow-lg hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-300 z-[99]"
        aria-label="Toggle dark mode"
      >
        {theme === "dark" ? (
          <Sun className="h-6 w-6" />
        ) : (
          <Moon className="h-6 w-6" />
        )}
      </button>
      {/* Hero Section: The main banner at the top of the page. */}
      {/* Features a background image, site logo, name, and a compelling tagline. */}
      <section className="bg-blue-600 dark:bg-blue-800 text-white text-center py-20 px-6 relative">
        {/* Background Image Container */}
        {/* This div holds the travel.png image and applies a blur effect. */}
        {/* z-0 ensures it stays behind other content. */}
        <div
          className="absolute inset-0 z-0 filter blur-[10%]"
          style={{
            backgroundImage: `url('/travel.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "rgba(56, 56, 56, 1)",
            backdropFilter: "blur(10%)",
            backgroundBlendMode: "overlay",
          }}
        ></div>

        {/* Content on top of the blurred background (higher z-index for visibility) */}
        <div className="relative z-10">
          {/* Logo and App Name */}
          <div className="flex justify-center items-center mb-6">
            <div className="bg-white p-4 rounded-full shadow-lg mr-4">
              <Plane className="h-12 w-12 text-blue-600 dark:text-blue-800" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold">
              Travel Buddy
            </h1>
          </div>
          {/* Tagline */}
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            From flight bookings to daily expenses, Travel Buddy helps you
            manage every penny so you can focus on making memories.
          </p>
          {/* Call-to-action buttons in the Hero section */}
          <div className="flex justify-center gap-4">
            {isAuthenticated ? (
              // If user is authenticated, show "Go to Dashboard" button
              <button
                onClick={onDashboardClick}
                className="bg-white text-blue-600 dark:text-blue-800 font-semibold py-2 px-6 rounded-full hover:bg-blue-100 dark:hover:bg-blue-700 dark:hover:text-white transition-colors"
              >
                Go to Dashboard
              </button>
            ) : (
              // If user is not authenticated, show "Get Started Free" and "Sign In" buttons
              <>
                <button
                  onClick={onSignUpClick}
                  className="bg-white text-blue-600 dark:text-blue-800 font-semibold py-2 px-6 rounded-full hover:bg-blue-100 dark:hover:bg-blue-700 dark:hover:text-white transition-colors"
                >
                  Get Started Free
                </button>
                <button
                  onClick={onSignInClick}
                  className="border border-white text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-700 dark:hover:bg-blue-900 transition-colors"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section: Explains the user journey in three simple steps. */}
      <section className="py-16 px-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl -mt-10 relative z-10 border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 Card */}
          <div className="text-center p-6 bg-gray-50 dark:bg-black rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <div className="text-blue-600 dark:text-blue-400 text-5xl font-extrabold mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Plan Your Trip
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Set up your travel budget, define categories, and get ready for an
              amazing journey.
            </p>
          </div>
          {/* Step 2 Card */}
          <div className="text-center p-6 bg-gray-50 dark:bg-black rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <div className="text-blue-600 dark:text-blue-400 text-5xl font-extrabold mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Track Expenses Effortlessly
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Log expenses on the go, convert currencies, and see where your
              money goes.
            </p>
          </div>
          {/* Step 3 Card */}
          <div className="text-center p-6 bg-gray-50 dark:bg-black rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <div className="text-blue-600 dark:text-blue-400 text-5xl font-extrabold mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Gain Insights & Enjoy
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Visualize your spending with charts, generate reports, and travel
              without financial stress.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Section: Details the main functionalities of Travel Buddy. */}
      <section className="py-16 px-6 max-w-6xl mx-auto bg-gray-50 dark:bg-gray-900 rounded-lg shadow-inner mt-10">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Empowering Features for Smart Travelers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            // Feature 1: Intuitive Expense Tracking
            {
              title: "Intuitive Expense Tracking",
              desc: "Effortlessly log every travel expense with details like date, amount, category, and personal notes. Stay organized and never miss a transaction.",
            },
            // Feature 2: Flexible Custom Categories
            {
              title: "Flexible Custom Categories",
              desc: "Tailor your budgeting experience by creating and personalizing spending categories. Adapt to any trip, whether it's a backpacking adventure or a luxury getaway.",
            },
            // Feature 3: Dynamic Visual Insights
            {
              title: "Dynamic Visual Insights",
              desc: "Gain instant clarity with interactive pie and bar charts. Understand your spending patterns at a glance and make informed financial decisions.",
            },
            // Feature 4: Proactive Budget Management
            {
              title: "Proactive Budget Management",
              desc: "Set realistic budget limits and track your progress with clear visual indicators. Avoid overspending and keep your travel dreams alive.",
            },
            // Feature 5: Historical Spending Views
            {
              title: "Historical Spending Views",
              desc: "Analyze your financial habits over time with weekly and monthly spending summaries. Learn from past trips to optimize future budgets.",
            },
            // Feature 6: Smart Alerts & Notifications
            {
              title: "Smart Alerts & Notifications",
              desc: "Receive real-time alerts as you approach or exceed your budget limits. Travel with peace of mind, knowing you're always in control.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-black p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white flex items-center">
                <span className="mr-3 text-blue-500 dark:text-blue-400">
                  🚀
                </span>
                {feature.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Smart Tools Section: Highlights specialized tools within Travel Buddy. */}
      <section className="bg-gradient-to-r from-blue-50 dark:from-gray-800 to-blue-100 dark:to-gray-850 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Intelligent Tools Designed For You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            // Tool 1: Global Currency Converter
            {
              title: "Global Currency Converter",
              desc: "Seamlessly enter expenses in any currency, and our real-time converter handles the rest. Travel globally, budget locally.",
            },
            // Tool 2: Comprehensive Exportable Reports
            {
              title: "Comprehensive Exportable Reports",
              desc: "Generate and download detailed trip summaries as PDFs or CSVs. Perfect for record-keeping, sharing, or expense reports.",
            },
            // Tool 3: Collaborative Budget Sharing
            {
              title: "Collaborative Budget Sharing",
              desc: "Invite friends or family to your budget. Share expenses, track contributions, and manage group travel finances with ease.",
            },
            // Tool 4: Seamless Cross-Device Sync
            {
              title: "Seamless Cross-Device Sync",
              desc: "Access Travel Buddy on any device—phone, tablet, or laptop. Your data stays synced, ensuring you're always up-to-date.",
            },
          ].map((tool, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-black p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
            >
              <h4 className="font-semibold text-xl mb-3 text-gray-900 dark:text-white flex items-center">
                <span className="mr-3 text-purple-500 dark:text-purple-400">
                  ⚙️
                </span>
                {tool.title}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {tool.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial Section: Displays positive feedback from users to build trust. */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          What Our Travelers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Testimonial Card 1 */}
          <div className="bg-gray-50 dark:bg-black p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">
              "Travel Buddy transformed how I manage my travel expenses. It's
              incredibly intuitive and the currency converter is a lifesaver!"
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              - Rahul Sharma, Travel Enthusiast
            </p>
          </div>
          {/* Testimonial Card 2 */}
          <div className="bg-gray-50 dark:bg-black p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">
              "Finally, a budgeting tool that understands travelers! The visual
              insights helped me stay on track throughout my European tour."
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              - Priya Patel, Wanderlust Explorer
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section: Final prompt for users to engage with the app. */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 text-white px-6 shadow-inner">
        <h2 className="text-4xl font-bold mb-6">Ready to Travel Smarter?</h2>
        <p className="text-xl mb-8 max-w-xl mx-auto">
          Join thousands of happy travelers who trust Travel Buddy for their
          financial peace of mind.
        </p>
        {isAuthenticated ? (
          // If user is authenticated, show "Go to Dashboard" button
          <button
            onClick={onDashboardClick}
            className="bg-white text-blue-700 dark:text-blue-900 font-bold py-4 px-10 rounded-full hover:bg-blue-100 dark:hover:bg-blue-700 dark:hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Go to Dashboard
          </button>
        ) : (
          // If user is not authenticated, show "Get Started for Free" button
          <button
            onClick={onSignUpClick}
            className="bg-white text-blue-700 dark:text-blue-900 font-bold py-4 px-10 rounded-full hover:bg-blue-100 dark:hover:bg-blue-700 dark:hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Get Started for Free
          </button>
        )}
      </section>

      {/* Footer Section: Contains copyright information and a simple message. */}
      <footer className="bg-gray-950 dark:bg-black text-gray-400 dark:text-gray-600 py-10 text-center text-sm border-t border-gray-800 dark:border-gray-700">
        <p>
          &copy; {new Date().getFullYear()} Travel Buddy. All rights reserved.
        </p>
        <p className="mt-2">Designed with passion for your journeys.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
