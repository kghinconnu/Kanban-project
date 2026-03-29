import useThemeStore from '../../store/ThemeStore'

export default function ThemeToggle() {
  const { dark, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-12 h-6 rounded-full transition-all duration-300
        ${dark ? 'bg-blue-600' : 'bg-slate-200'}
      `}
      title={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      <div className={`
        absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center text-xs
        ${dark ? 'left-6 bg-white' : 'left-0.5 bg-white shadow'}
      `}>
        {dark ? '🌙' : '☀️'}
      </div>
    </button>
  )
}