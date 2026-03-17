export default function TokenStats({ jsonTokens, toonTokens }) {
  const saved = Math.max(0, jsonTokens - toonTokens)
  const pctSaved = jsonTokens > 0 ? Math.round((saved / jsonTokens) * 100) : 0

  const stats = [
    {
      label: 'JSON Tokens',
      value: jsonTokens.toLocaleString(),
      icon: '{ }',
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-900/30',
      border: 'border-indigo-200 dark:border-indigo-800',
      iconBg: 'bg-indigo-100 dark:bg-indigo-800',
    },
    {
      label: 'TOON Tokens',
      value: toonTokens.toLocaleString(),
      icon: '⚡',
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/30',
      border: 'border-purple-200 dark:border-purple-800',
      iconBg: 'bg-purple-100 dark:bg-purple-800',
    },
    {
      label: 'Tokens Saved',
      value: saved.toLocaleString(),
      icon: '✂',
      color: saved > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400',
      bg: saved > 0 ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-gray-50 dark:bg-gray-800',
      border: saved > 0 ? 'border-emerald-200 dark:border-emerald-800' : 'border-gray-200 dark:border-gray-700',
      iconBg: saved > 0 ? 'bg-emerald-100 dark:bg-emerald-800' : 'bg-gray-100 dark:bg-gray-700',
    },
    {
      label: '% Saved',
      value: `${pctSaved}%`,
      icon: '📉',
      color: pctSaved > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-500 dark:text-gray-400',
      bg: pctSaved > 0 ? 'bg-rose-50 dark:bg-rose-900/30' : 'bg-gray-50 dark:bg-gray-800',
      border: pctSaved > 0 ? 'border-rose-200 dark:border-rose-800' : 'border-gray-200 dark:border-gray-700',
      iconBg: pctSaved > 0 ? 'bg-rose-100 dark:bg-rose-800' : 'bg-gray-100 dark:bg-gray-700',
    },
  ]

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2">
          Token Stats
        </span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(stat => (
          <div
            key={stat.label}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${stat.bg} ${stat.border} shadow-sm`}
          >
            <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${stat.iconBg} text-base flex-shrink-0`}>
              <span>{stat.icon}</span>
            </div>
            <div className="min-w-0">
              <div className={`text-lg font-bold leading-none ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 whitespace-nowrap">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {pctSaved > 0 && (
        <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 rounded-full transition-all duration-500"
            style={{ width: `${100 - pctSaved}%` }}
            title={`TOON uses ${100 - pctSaved}% of the original tokens`}
          />
        </div>
      )}
    </div>
  )
}
