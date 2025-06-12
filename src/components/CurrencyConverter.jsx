import { useState, useEffect } from 'react'
import { RefreshCw, ArrowRightLeft } from 'lucide-react'

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [convertedAmount, setConvertedAmount] = useState('')
  const [exchangeRate, setExchangeRate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Common currencies
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' }
  ]

  // Mock exchange rates (in a real app, you'd fetch from an API)
  const mockExchangeRates = {
    'USD-EUR': 0.85,
    'USD-GBP': 0.73,
    'USD-JPY': 110.0,
    'USD-CAD': 1.25,
    'USD-AUD': 1.35,
    'USD-CHF': 0.92,
    'USD-CNY': 6.45,
    'USD-INR': 74.5,
    'USD-KRW': 1180.0,
    'EUR-USD': 1.18,
    'EUR-GBP': 0.86,
    'EUR-JPY': 129.4,
    'GBP-USD': 1.37,
    'GBP-EUR': 1.16,
    'JPY-USD': 0.009,
    'CAD-USD': 0.80,
    'AUD-USD': 0.74,
    'CHF-USD': 1.09,
    'CNY-USD': 0.155,
    'INR-USD': 0.0134,
    'KRW-USD': 0.00085
  }

  const getExchangeRate = async (from, to) => {
    if (from === to) return 1

    setLoading(true)
    setError('')

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const rateKey = `${from}-${to}`
      const reverseRateKey = `${to}-${from}`
      
      let rate = mockExchangeRates[rateKey]
      
      if (!rate && mockExchangeRates[reverseRateKey]) {
        rate = 1 / mockExchangeRates[reverseRateKey]
      }
      
      if (!rate) {
        // If direct rate not available, convert through USD
        const fromToUSD = from === 'USD' ? 1 : (mockExchangeRates[`${from}-USD`] || 1)
        const USDToTo = to === 'USD' ? 1 : (mockExchangeRates[`USD-${to}`] || 1)
        rate = fromToUSD * USDToTo
      }
      
      setExchangeRate(rate || 1)
      return rate || 1
    } catch (err) {
      setError('Failed to fetch exchange rate')
      return 1
    } finally {
      setLoading(false)
    }
  }

  const convertCurrency = async () => {
    if (!amount || isNaN(amount)) {
      setConvertedAmount('')
      return
    }

    const rate = await getExchangeRate(fromCurrency, toCurrency)
    const converted = (parseFloat(amount) * rate).toFixed(2)
    setConvertedAmount(converted)
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setAmount(convertedAmount)
    setConvertedAmount(amount)
  }

  useEffect(() => {
    if (amount && !isNaN(amount)) {
      convertCurrency()
    } else {
      setConvertedAmount('')
      setExchangeRate(null)
    }
  }, [amount, fromCurrency, toCurrency])

  const getCurrencySymbol = (code) => {
    const currency = currencies.find(c => c.code === code)
    return currency ? currency.symbol : code
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Currency Converter</h2>
        
        <div className="space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field text-lg"
              placeholder="Enter amount"
              step="0.01"
            />
          </div>

          {/* Currency Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="input-field"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="input-field"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-center">
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <RefreshCw className="h-5 w-5 animate-spin text-primary-600" />
                  <span className="text-gray-600">Converting...</span>
                </div>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : convertedAmount ? (
                <div>
                  <p className="text-3xl font-bold text-primary-600">
                    {getCurrencySymbol(toCurrency)} {convertedAmount}
                  </p>
                  {exchangeRate && (
                    <p className="text-sm text-gray-600 mt-2">
                      1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Enter an amount to convert</p>
              )}
            </div>
          </div>

          {/* Quick Convert Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[10, 50, 100, 500].map(quickAmount => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="btn-secondary text-sm"
              >
                {getCurrencySymbol(fromCurrency)} {quickAmount}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exchange Rate Info */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Currency Tips</h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li>• Exchange rates are updated regularly but may not reflect real-time rates</li>
          <li>• Consider using cards with no foreign transaction fees when traveling</li>
          <li>• Airport currency exchanges often have less favorable rates</li>
          <li>• ATMs typically offer better exchange rates than currency exchange counters</li>
          <li>• Always check current rates before making large currency exchanges</li>
        </ul>
      </div>
    </div>
  )
}

export default CurrencyConverter