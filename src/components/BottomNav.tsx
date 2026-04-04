import { NavLink } from 'react-router-dom'
import { PenLine, Clock, BarChart2, Layers, Settings } from 'lucide-react'

const tabs = [
  { to: '/',          label: 'Today',    icon: PenLine   },
  { to: '/history',   label: 'History',  icon: Clock     },
  { to: '/stats',     label: 'Stats',    icon: BarChart2 },
  { to: '/projects',  label: 'Projects', icon: Layers    },
  { to: '/settings',  label: 'Settings', icon: Settings  },
]

export const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-slate-900 border-t border-slate-800 flex h-16 z-50">
    {tabs.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        end={to === '/'}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-0.5 flex-1 text-xs font-medium transition-colors ${
            isActive ? 'text-violet-400' : 'text-slate-500 hover:text-slate-300'
          }`
        }
      >
        <Icon size={18} strokeWidth={1.75} />
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
)
