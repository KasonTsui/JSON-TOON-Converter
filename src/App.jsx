import { useState, useEffect, useRef, useCallback } from 'react'
import Header from './components/Header'
import ConverterPanel from './components/ConverterPanel'
import TokenStats from './components/TokenStats'
import HistoryPanel from './components/HistoryPanel'
import { jsonToToon, toonToJson, approximateTokens } from './utils/toonConverter'

const HISTORY_KEY = 'toon_history'
const MAX_HISTORY = 20
const DEBOUNCE_MS = 300

const INITIAL_JSON = `{
  "name": "JSON-TOON-Converter",
  "version": "1.0.0",
  "features": ["bidirectional", "token-saving", "dark-mode"],
  "author": {
    "github": "kasontsui",
    "homepage": "https://kasontsui.github.io/JSON-TOON-Converter"
  },
  "compact": true
}`

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch {
    // Storage quota exceeded or unavailable — silently ignore
  }
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('toon_dark_mode')
    if (stored !== null) return JSON.parse(stored)
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const [jsonText, setJsonText] = useState(INITIAL_JSON)
  const [toonText, setToonText] = useState('')
  const [jsonError, setJsonError] = useState('')
  const [toonError, setToonError] = useState('')
  const [history, setHistory] = useState(loadHistory)

  // Track which side triggered the last edit to avoid circular updates
  const lastEdited = useRef(null) // 'json' | 'toon'
  const debounceTimer = useRef(null)

  // Apply dark mode class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem('toon_dark_mode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  const addToHistory = useCallback((json, toon) => {
    if (!json.trim() || !toon.trim()) return
    setHistory(prev => {
      const entry = { id: Date.now(), timestamp: Date.now(), jsonText: json, toonText: toon }
      // Avoid consecutive duplicates
      if (prev.length > 0 && prev[0].toonText === toon) return prev
      const next = [entry, ...prev].slice(0, MAX_HISTORY)
      saveHistory(next)
      return next
    })
  }, [])

  const convertJsonToToon = useCallback((json) => {
    try {
      const result = jsonToToon(json)
      setToonText(result)
      setJsonError('')
      setToonError('')
      if (result) addToHistory(json, result)
    } catch (e) {
      setJsonError(e.message)
      setToonText('')
    }
  }, [addToHistory])

  const convertToonToJson = useCallback((toon) => {
    try {
      const result = toonToJson(toon)
      setJsonText(result)
      setToonError('')
      setJsonError('')
      if (result) addToHistory(result, toon)
    } catch (e) {
      setToonError(e.message)
      setJsonText('')
    }
  }, [addToHistory])

  // Debounced side effects
  const handleJsonChange = useCallback((val) => {
    setJsonText(val)
    setJsonError('')
    lastEdited.current = 'json'
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      if (val.trim()) {
        convertJsonToToon(val)
      } else {
        setToonText('')
        setToonError('')
      }
    }, DEBOUNCE_MS)
  }, [convertJsonToToon])

  const handleToonChange = useCallback((val) => {
    setToonText(val)
    setToonError('')
    lastEdited.current = 'toon'
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      if (val.trim()) {
        convertToonToJson(val)
      } else {
        setJsonText('')
        setJsonError('')
      }
    }, DEBOUNCE_MS)
  }, [convertToonToJson])

  // Initial conversion on mount
  useEffect(() => {
    convertJsonToToon(INITIAL_JSON)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRestore = useCallback((entry) => {
    lastEdited.current = null
    setJsonText(entry.jsonText)
    setToonText(entry.toonText)
    setJsonError('')
    setToonError('')
  }, [])

  const handleClearHistory = useCallback(() => {
    setHistory([])
    saveHistory([])
  }, [])

  const jsonTokens = approximateTokens(jsonText)
  const toonTokens = approximateTokens(toonText)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(d => !d)} />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-5">
        {/* Converter panels */}
        <div className="flex flex-col lg:flex-row gap-4">
          <ConverterPanel
            label="JSON"
            value={jsonText}
            onChange={handleJsonChange}
            placeholder={'Paste or type JSON here...\n\nExample:\n{\n  "name": "Alice",\n  "age": 30\n}'}
            accentColor="indigo"
            error={jsonError}
          />

          {/* Arrow divider */}
          <div className="flex lg:flex-col items-center justify-center gap-1 py-2 lg:py-0">
            <div className="hidden lg:flex flex-col items-center gap-1">
              <div className="text-gray-300 dark:text-gray-600 text-xl">⇅</div>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium writing-mode-vertical">
                auto
              </span>
            </div>
            <div className="lg:hidden flex items-center gap-2 text-gray-400 dark:text-gray-500">
              <div className="h-px w-16 bg-gray-300 dark:bg-gray-600" />
              <span className="text-lg">⇄</span>
              <div className="h-px w-16 bg-gray-300 dark:bg-gray-600" />
            </div>
          </div>

          <ConverterPanel
            label="TOON"
            value={toonText}
            onChange={handleToonChange}
            placeholder={'TOON output appears here...\n\nExample:\n{name:"Alice",age:30}'}
            accentColor="purple"
            error={toonError}
          />
        </div>

        {/* Token stats */}
        <TokenStats jsonTokens={jsonTokens} toonTokens={toonTokens} />

        {/* History */}
        <HistoryPanel
          history={history}
          onRestore={handleRestore}
          onClear={handleClearHistory}
        />

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 dark:text-gray-600 pb-4">
          TOON format · token count approximated as <code className="font-mono">⌈chars / 4⌉</code>
        </footer>
      </main>
    </div>
  )
}
