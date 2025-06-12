import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Plane,
  MapPin,
  Calendar,
} from "lucide-react";
import { auth, db, realtimeDb } from "../../config/firebase";
import {
  setLoading,
  setError,
  loginSuccess,
  clearError,
  selectAuthLoading,
  selectAuthError,
} from "../../store/slices/authSlice";

const Signup = ({ onToggleMode }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    country: "",
    currency: "USD",
    travelPreferences: [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const travelPreferenceOptions = [
    "Budget Travel",
    "Luxury Travel",
    "Adventure Travel",
    "Cultural Tourism",
    "Business Travel",
    "Family Travel",
    "Solo Travel",
    "Group Travel",
  ];

  const currencyOptions = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CHF", name: "Swiss Franc" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "INR", name: "Indian Rupee" },
    { code: "KRW", name: "South Korean Won" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        travelPreferences: checked
          ? [...prev.travelPreferences, value]
          : prev.travelPreferences.filter((pref) => pref !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear global error
    if (error) {
      dispatch(clearError());
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
    }

    if (!formData.country.trim()) {
      errors.country = "Country is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      });

      // Prepare user data
      const userData = {
        uid: user.uid,
        email: user.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: `${formData.firstName} ${formData.lastName}`,
        dateOfBirth: formData.dateOfBirth,
        country: formData.country,
        currency: formData.currency,
        travelPreferences: formData.travelPreferences,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to Firestore
      await setDoc(doc(db, "users", user.uid), userData);

      // Save to Realtime Database
      await set(ref(realtimeDb, `users/${user.uid}`), userData);

      // Initialize user's budget and expense collections
      await setDoc(doc(db, "users", user.uid, "settings", "budgets"), {
        budgets: {},
        createdAt: new Date().toISOString(),
      });

      await setDoc(doc(db, "users", user.uid, "settings", "expenses"), {
        expenses: [],
        createdAt: new Date().toISOString(),
      });

      // Update Redux state
      dispatch(
        loginSuccess({
          uid: user.uid,
          email: user.email,
          displayName: userData.displayName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          country: formData.country,
          currency: formData.currency,
          travelPreferences: formData.travelPreferences,
        })
      );
    } catch (error) {
      let errorMessage = "Account creation failed. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/weak-password":
          errorMessage =
            "Password is too weak. Please choose a stronger password.";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Email/password accounts are not enabled.";
          break;
        default:
          errorMessage = error.message;
      }

      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-600 p-3 rounded-full">
              <Plane className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Join us to start planning your travel budget
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`input-field pl-10 ${
                    formErrors.firstName ? "border-red-500" : ""
                  }`}
                  placeholder="First name"
                  disabled={loading}
                />
              </div>
              {formErrors.firstName && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.firstName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`input-field pl-10 ${
                    formErrors.lastName ? "border-red-500" : ""
                  }`}
                  placeholder="Last name"
                  disabled={loading}
                />
              </div>
              {formErrors.lastName && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input-field pl-10 ${
                  formErrors.email ? "border-red-500" : ""
                }`}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field pl-10 pr-10 ${
                    formErrors.password ? "border-red-500" : ""
                  }`}
                  placeholder="Password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input-field pl-10 pr-10 ${
                    formErrors.confirmPassword ? "border-red-500" : ""
                  }`}
                  placeholder="Confirm password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`input-field pl-10 ${
                    formErrors.dateOfBirth ? "border-red-500" : ""
                  }`}
                  disabled={loading}
                />
              </div>
              {formErrors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.dateOfBirth}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Country
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`input-field pl-10 ${
                    formErrors.country ? "border-red-500" : ""
                  }`}
                  placeholder="Your country"
                  disabled={loading}
                />
              </div>
              {formErrors.country && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.country}
                </p>
              )}
            </div>
          </div>

          {/* Currency Preference */}
          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Preferred Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              {currencyOptions.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          {/* Travel Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Travel Preferences (Optional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {travelPreferenceOptions.map((preference) => (
                <label
                  key={preference}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={preference}
                    checked={formData.travelPreferences.includes(preference)}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700">{preference}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full btn-primary py-3 text-base font-medium ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Toggle to Login */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={onToggleMode}
              className="text-primary-600 hover:text-primary-700 font-medium"
              disabled={loading}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
