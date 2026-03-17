export default function Header({ isDarkMode, onToggleDarkMode }) {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />

      <div className="relative px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg">
            <span className="text-xl">⚡</span>
          </div>
          <div>
            <h1 className="text-white text-xl font-bold tracking-tight leading-none">
              JSON-TOON-Converter
            </h1>
            <p className="text-white/70 text-xs mt-0.5">
              Compact JSON format · Save LLM tokens
            </p>
          </div>
        </div>

        <button
          onClick={onToggleDarkMode}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 
                     text-white text-sm font-medium rounded-xl backdrop-blur-sm 
                     transition-all duration-200 active:scale-95 border border-white/20"
        >
          <span className="text-base">{isDarkMode ? '☀️' : '🌙'}</span>
          <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </header>
  )
}
