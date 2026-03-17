function formatTime(ts) {
  const d = new Date(ts)
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function truncate(str, max = 60) {
  if (!str) return '—'
  const single = str.replace(/\s+/g, ' ').trim()
  return single.length > max ? single.slice(0, max) + '…' : single
}

export default function HistoryPanel({ history, onRestore, onClear }) {
  if (history.length === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2">
            Conversion History
          </span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        </div>
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-6">
          No history yet — start converting to see entries here.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2">
          Conversion History
        </span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 
                      bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        {/* Header row */}
        <div className="flex items-center justify-between px-4 py-2 
                        bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {history.length} entr{history.length === 1 ? 'y' : 'ies'} · click to restore
          </span>
          <button
            onClick={onClear}
            className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 
                       font-medium transition-colors duration-150"
          >
            Clear all
          </button>
        </div>

        {/* History list */}
        <ul className="divide-y divide-gray-100 dark:divide-gray-700 max-h-64 overflow-y-auto">
          {history.map((entry, idx) => (
            <li key={entry.id}>
              <button
                onClick={() => onRestore(entry)}
                className="w-full text-left px-4 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20
                           transition-colors duration-100 group animate-fade-in"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex-shrink-0 text-xs font-mono font-semibold 
                                     text-gray-400 dark:text-gray-500 w-5 text-right">
                      {idx + 1}.
                    </span>
                    <span className="truncate text-sm font-mono text-gray-700 dark:text-gray-300 
                                     group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                      {truncate(entry.toonText)}
                    </span>
                  </div>
                  <span className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500">
                    {formatTime(entry.timestamp)}
                  </span>
                </div>
                <div className="ml-7 mt-0.5 text-xs text-gray-400 dark:text-gray-500 truncate">
                  JSON: {truncate(entry.jsonText, 80)}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
