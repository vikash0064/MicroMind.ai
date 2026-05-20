import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store'
import toast from 'react-hot-toast'

const navLinks = [
  { path: '/', label: 'Home Page', icon: 'home' },
  { path: '/dashboard', label: 'Analytics', icon: 'insights' },
  { path: '/scanner', label: 'Meal Log', icon: 'photo_camera' },
  { path: '/history', label: 'History', icon: 'receipt_long' },
  { path: '/profile', label: 'Profile', icon: 'person' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <>
      {/* SideNavBar (Desktop) */}
      <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-surface-container/85 backdrop-blur-3xl border-r border-white/5 shadow-[10px_0_30px_rgba(0,0,0,0.5)] flex-col p-5 gap-5 z-50">
        <div className="flex flex-col gap-1">
          <Link to="/dashboard" className="text-2xl font-black text-primary tracking-tight font-display hover:opacity-90">
            MacroMind
          </Link>
          <p className="text-[10px] font-bold text-on-surface-variant opacity-50 font-sans tracking-widest uppercase">
            AI Nutrition Platform
          </p>
        </div>

        <nav className="flex flex-col gap-1 mt-2">
          {navLinks.map(({ path, label, icon }) => {
            const active = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 font-sans ${
                  active
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(78,222,163,0.1)]'
                    : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface hover:translate-x-1'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{icon}</span>
                <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Upgrade to Pro Card */}
        <div className="mt-auto rounded-2xl border border-primary/20 overflow-hidden relative group cursor-pointer shadow-2xl transition-all duration-500 hover:border-primary/50 shrink-0">
          <img
            alt="Performance"
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQvXR01Gv30i9wTxHWklS6izVeT1gLaBHvlIyTprg1_AzA3IocpTnZX8L2Pj-B4brnctKdTQY8yhXfHeSBIRC9aNMpNBpjnOQs71E1uXO90adkxd_HBODwTfGO-bpfb6H7GlTkRoCXmhxMx5FKWtuZxpsGrvCVFWrD0HvpnRWCeeMXEi0SpFztHYur5studYD3UJ1in2N_F62gd5iPOct9RczPy5EOONn6DKgcIYqYYHgGIngXtmr7f3qKDaFeio1YUHaEHkGkOPg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="relative p-3 flex flex-col h-full z-10">
            <p className="text-[11px] text-primary font-bold mb-1 flex items-center gap-1 font-sans uppercase tracking-wider">
              <span className="material-symbols-outlined text-xs">workspace_premium</span>
              Upgrade to Pro
            </p>
            <p className="text-[10px] text-on-surface-variant font-medium leading-tight mb-2.5 drop-shadow-md font-sans">
              Unlock advanced neural meal scanning & glucose insights.
            </p>
            <button className="w-full py-1.5 bg-primary text-on-primary font-bold rounded-lg text-[10px] hover:bg-primary-container transition-colors shadow-lg font-sans uppercase tracking-wider">
              Get Started
            </button>
          </div>
        </div>

        {/* User profile + Logout at bottom */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-black font-sans uppercase">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-on-surface font-sans truncate max-w-[100px]">
                {user?.name || 'User'}
              </span>
              <span className="text-[9px] text-on-surface-variant font-sans truncate max-w-[100px]">
                {user?.email || ''}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            title="Logout"
          >
            <span className="material-symbols-outlined text-base">logout</span>
          </button>
        </div>
      </aside>

      {/* Bottom Nav (Mobile) */}
      <footer className="md:hidden fixed bottom-0 left-0 w-full glass-panel border-t border-white/10 px-6 py-4 z-50 flex justify-around items-center">
        {navLinks.map(({ path, label, icon }) => {
          const active = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 font-sans ${
                active ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined">{icon}</span>
              <span className="text-[10px] uppercase font-bold tracking-tight">{label}</span>
            </Link>
          )
        })}
      </footer>
    </>
  )
}
