import { useState, useEffect } from "react";
import { RefreshCw, ArrowRightLeft } from "lucide-react";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Common currencies
  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "KRW", name: "South Korean Won", symbol: "₩" },
  ];

  // Mock exchange rates (in a real app, you'd fetch from an API)
  // Note: For real-time and accurate conversions in a production environment, this should be replaced with an actual API call.
  const mockExchangeRates = {
    "USD-EUR": 0.87,
    "USD-GBP": 0.74,
    "USD-JPY": 144.35,
    "USD-CAD": 1.36,
    "USD-AUD": 1.55,
    "USD-CHF": 0.81,
    "USD-CNY": 7.17,
    "USD-INR": 86.13,
    "USD-KRW": 1371.17,
    "EUR-USD": 1 / 0.87,
    "EUR-GBP": 0.85,
    "EUR-JPY": 165.92,
    "GBP-USD": 1 / 0.74,
    "GBP-EUR": 1 / 0.85,
    "JPY-USD": 1 / 144.35,
    "CAD-USD": 1 / 1.36,
    "AUD-USD": 1 / 1.55,
    "CHF-USD": 1 / 0.81,
    "CNY-USD": 1 / 7.17,
    "INR-USD": 1 / 86.13,
    "KRW-USD": 1 / 1371.17,
  };

  const getExchangeRate = async (from, to) => {
    if (from === to) return 1;

    setLoading(true);
    setError("");

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const rateKey = `${from}-${to}`;
      const reverseRateKey = `${to}-${from}`;

      let rate = mockExchangeRates[rateKey];

      if (!rate && mockExchangeRates[reverseRateKey]) {
        rate = 1 / mockExchangeRates[reverseRateKey];
      }

      if (!rate) {
        // If direct rate not available, convert through USD
        const fromToUSD =
          from === "USD" ? 1 : mockExchangeRates[`${from}-USD`] || 1;
        const USDToTo = to === "USD" ? 1 : mockExchangeRates[`USD-${to}`] || 1;
        rate = fromToUSD * USDToTo;
      }

      setExchangeRate(rate || 1);
      return rate || 1;
    } catch (err) {
      setError("Failed to fetch exchange rate");
      return 1;
    } finally {
      setLoading(false);
    }
  };

  const convertCurrency = async () => {
    if (!amount || isNaN(amount)) {
      setConvertedAmount("");
      return;
    }

    const rate = await getExchangeRate(fromCurrency, toCurrency);
    const converted = (parseFloat(amount) * rate).toFixed(2);
    setConvertedAmount(converted);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount(convertedAmount);
    setConvertedAmount(amount);
  };

  useEffect(() => {
    if (amount && !isNaN(amount)) {
      convertCurrency();
    } else {
      setConvertedAmount("");
      setExchangeRate(null);
    }
  }, [amount, fromCurrency, toCurrency]);

  const getCurrencySymbol = (code) => {
    const currency = currencies.find((c) => c.code === code);
    return currency ? currency.symbol : code;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Currency Converter
        </h2>

        <div className="space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter amount"
              step="0.01"
            />
          </div>

          {/* Currency Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                From
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="input-field max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                style={{ scrollbarWidth: "thin" }}
              >
                {currencies.map((currency) => (
                  <option
                    key={currency.code}
                    value={currency.code}
                    className="py-1"
                  >
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <button
                onClick={swapCurrencies}
                className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                title="Swap currencies"
              >
                <ArrowRightLeft className="h-6 w-6" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                To
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="input-field max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                style={{ scrollbarWidth: "thin" }}
              >
                {currencies.map((currency) => (
                  <option
                    key={currency.code}
                    value={currency.code}
                    className="py-1"
                  >
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="text-center">
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <RefreshCw className="h-5 w-5 animate-spin text-primary-600 dark:text-primary-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Converting...
                  </span>
                </div>
              ) : error ? (
                <p className="text-red-600 dark:text-red-400">{error}</p>
              ) : convertedAmount ? (
                <div>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {getCurrencySymbol(toCurrency)} {convertedAmount}
                  </p>
                  {exchangeRate && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Enter an amount to convert
                </p>
              )}
            </div>
          </div>

          {/* Quick Convert Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[10, 50, 100, 500].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="btn-secondary text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-700"
              >
                {getCurrencySymbol(fromCurrency)} {quickAmount}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exchange Rate Info */}
      <div className="card bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
          Currency Tips
        </h3>
        <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
          <li>
            • Exchange rates are updated regularly but may not reflect real-time
            rates
          </li>
          <li>
            • Consider using cards with no foreign transaction fees when
            traveling
          </li>
          <li>• Airport currency exchanges often have less favorable rates</li>
          <li>
            • ATMs typically offer better exchange rates than currency exchange
            counters
          </li>
          <li>
            • Always check current rates before making large currency exchanges
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CurrencyConverter;
