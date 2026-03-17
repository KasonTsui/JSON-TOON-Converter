import { useState } from 'react'

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function ConverterPanel({ label, value, onChange, placeholder, readOnly, accentColor, error }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = value
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const accentMap = {
    indigo: {
      label: 'text-indigo-600 dark:text-indigo-400',
      badge: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700',
      border: 'border-indigo-200 dark:border-indigo-700',
      focus: 'focus:ring-indigo-500 focus:border-indigo-500',
      header: 'bg-indigo-50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-800',
    },
    purple: {
      label: 'text-purple-600 dark:text-purple-400',
      badge: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
      border: 'border-purple-200 dark:border-purple-700',
      focus: 'focus:ring-purple-500 focus:border-purple-500',
      header: 'bg-purple-50 dark:bg-purple-950/30 border-b border-purple-100 dark:border-purple-800',
    },
  }

  const accent = accentMap[accentColor] || accentMap.indigo

  return (
    <div className={`flex flex-col rounded-xl border ${accent.border} shadow-sm overflow-hidden 
                     bg-white dark:bg-gray-800 flex-1 min-w-0`}>
      {/* Panel header */}
      <div className={`flex items-center justify-between px-4 py-2.5 ${accent.header}`}>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${accent.label}`}>{label}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${accent.badge}`}>
            {label === 'JSON' ? 'Input / Output' : 'Compact Format'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          disabled={!value}
          title="Copy to clipboard"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                     transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed
                     ${copied
                       ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                       : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                     }`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800
                        text-red-600 dark:text-red-400 text-xs font-medium animate-fade-in">
          ⚠ {error}
        </div>
      )}

      {/* Textarea */}
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={e => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          spellCheck={false}
          className={`w-full h-full min-h-[320px] p-4 text-sm font-mono
                     bg-transparent text-gray-800 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     outline-none resize-none leading-relaxed
                     ${accent.focus}
                     ${readOnly ? 'cursor-default' : ''}`}
        />
      </div>
    </div>
  )
}
