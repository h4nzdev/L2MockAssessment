import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * Drop-in theme toggle button.
 * Shows Sun when dark mode is active (click → light).
 * Shows Moon when light mode is active (click → dark).
 */
export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`
        p-1.5 rounded-lg border transition-all
        ${isDark
          ? 'border-blue-800/60 bg-blue-950/50 hover:bg-blue-900/50 text-amber-300 hover:text-amber-200'
          : 'border-blue-200 bg-white/80 hover:bg-blue-50 text-blue-700 hover:text-blue-900 shadow-sm'
        }
        ${className}
      `}
    >
      {isDark
        ? <Sun className="w-3.5 h-3.5" />
        : <Moon className="w-3.5 h-3.5" />
      }
    </button>
  );
}
