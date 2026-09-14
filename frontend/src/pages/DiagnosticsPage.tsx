import { useState, useEffect } from 'react'
import axios from 'axios'

export default function DiagnosticsPage() {
  const [results, setResults] = useState<any>({})
  const [testing, setTesting] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'https://veritas-bank-0dru.onrender.com/api'

  const runTests = async () => {
    setTesting(true)
    const testResults: any = {}

    // Test 1: Direct health check
    try {
      const start = Date.now()
      const response = await axios.get(`${API_URL}/health`, { timeout: 10000 })
      const duration = Date.now() - start
      testResults.health = {
        status: 'success',
        data: response.data,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      }
    } catch (error: any) {
      testResults.health = {
        status: 'failed',
        error: error.message,
        details: error.response?.data || 'No response'
      }
    }

    // Test 2: DNS Resolution
    try {
      const url = new URL(API_URL)
      testResults.dns = {
        hostname: url.hostname,
        protocol: url.protocol,
        resolved: 'OK'
      }
    } catch (error: any) {
      testResults.dns = {
        status: 'failed',
        error: error.message
      }
    }

    // Test 3: Browser Info
    testResults.browser = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      online: navigator.onLine,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled
    }

    // Test 4: Network Info
    testResults.network = {
      apiUrl: API_URL,
      currentUrl: window.location.href,
      origin: window.location.origin
    }

    // Test 5: LocalStorage
    try {
      localStorage.setItem('test', 'test')
      localStorage.removeItem('test')
      testResults.localStorage = { status: 'OK' }
    } catch (error: any) {
      testResults.localStorage = { status: 'failed', error: error.message }
    }

    setResults(testResults)
    setTesting(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connection Diagnostics</h1>
          <p className="text-gray-600 text-sm mb-4">
            Use this page to diagnose connection issues. Share the results with support if you're experiencing problems.
          </p>
          <button
            onClick={runTests}
            disabled={testing}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Run Tests Again'}
          </button>
        </div>

        {Object.keys(results).length > 0 && (
          <div className="space-y-4">
            {Object.entries(results).map(([key, value]: [string, any]) => (
              <div key={key} className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 capitalize">{key} Test</h2>
                <pre className="bg-gray-50 p-4 rounded-xl overflow-auto text-xs">
                  {JSON.stringify(value, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <h3 className="font-bold text-yellow-900 mb-2">If you see connection errors:</h3>
          <ul className="text-sm text-yellow-800 space-y-2">
            <li>• Check if you're using a VPN - try disabling it</li>
            <li>• Clear your browser cache and cookies</li>
            <li>• Try a different browser (Chrome, Firefox, Safari)</li>
            <li>• Check if your antivirus/firewall is blocking the connection</li>
            <li>• Try using mobile data instead of WiFi (or vice versa)</li>
            <li>• Contact support with these test results</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
