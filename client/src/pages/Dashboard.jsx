import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore, useNutritionStore } from '../store'
import API from '../api/axios'
import {
  Camera,
  Plus,
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  PlusCircle,
  Calendar,
  ChevronRight,
  TrendingUp,
  Activity,
  Trash2,
  PieChart as PieIcon
} from 'lucide-react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import toast from 'react-hot-toast'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Dashboard() {
  const { user } = useAuthStore()
  const {
    todayStats,
    dailyGoals,
    meals,
    setMeals,
    updateWater,
  } = useNutritionStore()

  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState(null)
  
  // Sync token into API headers in case page is refreshed
  const token = useAuthStore.getState().token
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // 1. Fetch today's stats & 7 days history
      const statsRes = await API.get('/meals/stats')
      
      // Update local Zustand store stats (excluding water, which is tracked locally or via DB)
      useNutritionStore.setState({ 
        todayStats: {
          ...useNutritionStore.getState().todayStats,
          ...statsRes.data.todayStats
        }
      })

      // Set up Chart.js data
      const trend = statsRes.data.last7Days || []
      setChartData({
        labels: trend.map(d => d.dayLabel),
        datasets: [
          {
            label: 'Calories (kcal)',
            data: trend.map(d => d.calories),
            backgroundColor: 'rgba(16, 185, 129, 0.45)',
            borderColor: '#10b981',
            borderWidth: 2,
            borderRadius: 8,
            hoverBackgroundColor: '#10b981',
          }
        ]
      })

      // 2. Fetch logged meals
      const mealsRes = await API.get('/meals')
      setMeals(mealsRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load today\'s meal data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleAddWater = (amount) => {
    updateWater(amount)
    toast.success(`Added ${amount}ml of Water! 💧`, { id: 'water-toast' })
  }

  const handleDeleteMeal = async (id) => {
    try {
      await API.delete(`/meals/${id}`)
      toast.success('Meal deleted successfully')
      fetchDashboardData() // Refresh
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Could not delete meal')
    }
  }

  const calPercent = Math.min(Math.round((todayStats.calories / dailyGoals.calories) * 100), 100)
  const proteinPercent = Math.min(Math.round((todayStats.protein / dailyGoals.protein) * 100), 100)
  const carbsPercent = Math.min(Math.round((todayStats.carbs / dailyGoals.carbs) * 100), 100)
  const fatPercent = Math.min(Math.round((todayStats.fat / dailyGoals.fat) * 100), 100)
  const waterPercent = Math.min(Math.round((todayStats.water / dailyGoals.water) * 100), 100)

  const calsRemaining = Math.max(dailyGoals.calories - todayStats.calories, 0)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3 font-sans">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-on-surface-variant text-sm">Computing dashboard intelligence...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen px-margin-mobile md:px-margin-desktop py-8 flex flex-col gap-6 md:gap-8 max-w-container-max mx-auto">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight font-display">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}.
          </h2>
          <p className="text-xs text-on-surface-variant mt-1 font-sans font-medium">
            Real-time computational metabolic tracker & glucose analysis dashboard.
          </p>
        </div>
        {/* Calorie Goals Banner as a Beautiful Glass Capsule */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(78,222,163,0.1)] text-primary font-sans text-xs font-bold uppercase tracking-wider shrink-0 max-w-fit">
          <span className="material-symbols-outlined text-sm">bolt</span>
          <span>
            {calsRemaining > 0
              ? `${calsRemaining} kcal remaining`
              : `Goal Achieved!`}
          </span>
        </div>
      </header>

      {/* Top Bento Grid Section: Progress Rings & Hydration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Daily Progress: Circular Tracker */}
        <section className="lg:col-span-7 glass-panel rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 glow-primary">
          <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
            {/* SVG Rings for Macro Tracking */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background track */}
              <circle cx="50" cy="50" fill="transparent" r="45" stroke="rgba(255,255,255,0.05)" strokeWidth="6"></circle>
              
              {/* Calorie Ring */}
              <motion.circle
                cx="50"
                cy="50"
                fill="transparent"
                r="45"
                stroke="url(#gradient-primary)"
                strokeDasharray="282.7"
                initial={{ strokeDashoffset: 282.7 }}
                animate={{ strokeDashoffset: 282.7 - (282.7 * calPercent) / 100 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeWidth="6"
                strokeLinecap="round"
                className="glow-ring"
              />
              
              {/* Protein Ring */}
              <motion.circle
                cx="50"
                cy="50"
                fill="transparent"
                r="36"
                stroke="#adc6ff"
                strokeDasharray="226.2"
                initial={{ strokeDashoffset: 226.2 }}
                animate={{ strokeDashoffset: 226.2 - (226.2 * proteinPercent) / 100 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeWidth="5"
                strokeLinecap="round"
                className="opacity-70"
              />
              
              {/* Carbs Ring */}
              <motion.circle
                cx="50"
                cy="50"
                fill="transparent"
                r="28"
                stroke="#d0bcff"
                strokeDasharray="175.9"
                initial={{ strokeDashoffset: 175.9 }}
                animate={{ strokeDashoffset: 175.9 - (175.9 * carbsPercent) / 100 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                strokeWidth="4"
                strokeLinecap="round"
                className="opacity-60"
              />
              
              <defs>
                <linearGradient id="gradient-primary" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#4edea3' }}></stop>
                  <stop offset="100%" style={{ stopColor: '#10b981' }}></stop>
                </linearGradient>
              </defs>
            </svg>
            <div className="text-center z-10 font-sans">
              <span className="block text-2xl font-extrabold text-on-surface font-display leading-none">{todayStats.calories}</span>
              <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block mt-1">Kcal Logged</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-col gap-4 w-full sm:w-auto font-sans">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-[11px] text-on-surface font-bold uppercase tracking-wider">Protein</span>
              </div>
              <span className="text-xs text-on-surface-variant font-medium">{todayStats.protein}g / {dailyGoals.protein}g</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                <span className="text-[11px] text-on-surface font-bold uppercase tracking-wider">Carbs</span>
              </div>
              <span className="text-xs text-on-surface-variant font-medium">{todayStats.carbs}g / {dailyGoals.carbs}g</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                <span className="text-[11px] text-on-surface font-bold uppercase tracking-wider">Fats</span>
              </div>
              <span className="text-xs text-on-surface-variant font-medium">{todayStats.fat}g / {dailyGoals.fat}g</span>
            </div>
          </div>
        </section>

        {/* Hydration Tracker */}
        <section className="lg:col-span-5 glass-panel rounded-3xl p-6 flex flex-col justify-between min-h-[260px] relative overflow-hidden glow-primary">
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5 font-display uppercase tracking-wider">
              <span className="material-symbols-outlined text-cyan-400 text-xl">opacity</span>
              Hydration
            </h3>
            <p className="text-[11px] text-on-surface-variant mt-0.5 font-sans font-medium">Keep alert and mathematically hydrated.</p>
          </div>

          <div className="my-2 relative flex items-center justify-center z-10">
            <div className="relative w-28 h-28 rounded-full border-4 border-cyan-400/20 flex items-center justify-center overflow-hidden">
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-cyan-400/25"
                animate={{ height: `${waterPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
              <div className="relative text-center font-sans">
                <span className="text-xl font-black text-white">{todayStats.water}</span>
                <span className="text-white/40 text-[10px] block">/ {dailyGoals.water} ml</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 relative z-10 font-sans">
            {[
              { value: 250, label: '+250ml' },
              { value: 500, label: '+500ml' },
              { value: 1000, label: '+1.0L' }
            ].map(({ value, label }) => (
              <button
                key={label}
                onClick={() => handleAddWater(value)}
                className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl border border-white/5 hover:border-cyan-500/30 bg-white/5 hover:bg-cyan-500/10 text-cyan-400 text-[10px] font-bold transition-all duration-200"
              >
                <span className="material-symbols-outlined text-xs mb-0.5">add</span>
                {label}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Second Bento Row: Weekly Trends & Quick Rec Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Weekly Trends Section */}
        <section className="lg:col-span-8 flex flex-col gap-3">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-sm font-bold text-on-surface font-display uppercase tracking-wider">Weekly Trends</h3>
            <div className="flex gap-1.5 font-sans">
              <button className="px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-on-surface-variant hover:text-on-surface transition-colors uppercase tracking-wider">Daily</button>
              <button className="px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-wider">Weekly</button>
            </div>
          </div>
          <div className="glass-panel rounded-3xl p-6 min-h-[268px] flex flex-col justify-end">
            <div className="h-48 flex items-center justify-center font-sans">
              {chartData ? (
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: '#131313',
                        titleColor: '#fff',
                        bodyColor: '#4edea3',
                        borderColor: 'rgba(78,222,163,0.2)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 12,
                        titleFont: { family: 'Plus Jakarta Sans', weight: 'bold' },
                        bodyFont: { family: 'Geist' }
                      }
                    },
                    scales: {
                      x: {
                        grid: { display: false },
                        ticks: { color: 'rgba(229, 226, 225, 0.4)', font: { family: 'Geist', size: 11 } }
                      },
                      y: {
                        grid: { color: 'rgba(255,255,255,0.03)' },
                        ticks: { color: 'rgba(229, 226, 225, 0.4)', font: { family: 'Geist', size: 11 } }
                      }
                    }
                  }}
                />
              ) : (
                <div className="text-white/30 text-sm">No trend data available yet</div>
              )}
            </div>
          </div>
        </section>

        {/* Quick Recommendation Card */}
        <section className="lg:col-span-4 glass-panel rounded-3xl overflow-hidden relative min-h-[268px] flex flex-col justify-end group">
          <img
            alt="Healthy food"
            className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa4naP7zwwSHswjSNIofE3TX8CvbU5oIG4bkNxvWw43AbwzfR9q1n49w_KO71GFZAEpEHNOvKGKJcyFS77QggOr9WoaLAYrnrBRVIrK8MRLa3HbLre-_U_2kbei9wcwQXr-4dFG0EtOplwkn5YQ-RLwQNc0Dx1vlXPd2ejQr5V3THBESEajh2dDj9aZY3AKi6Cq0fMloDqBfmcP-guL198gufA_sOGYJyN2ReymF-9RtmCEP1_-OQWG1sfaEXwmjbOSyslgcPz9Do"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
          <div className="relative p-6 w-full z-10">
            <div className="flex justify-between items-end">
              <div>
                <span className="bg-primary/20 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block font-sans">Recommended</span>
                <h3 className="text-sm font-bold text-on-surface font-display leading-tight uppercase tracking-wider">High-Fiber Dinner</h3>
                <p className="text-[11px] text-on-surface-variant mt-0.5 font-sans font-medium">Optimal for recovery and deep sleep.</p>
              </div>
              <Link to="/scanner" className="bg-white/10 backdrop-blur-md p-2.5 rounded-full hover:bg-white/20 hover:scale-110 active:scale-95 transition-all text-white shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Third Bento Row: Recent Meals & Micronutrient Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-8">
        {/* Recent Meals Section */}
        <section className="lg:col-span-8 flex flex-col gap-3">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-sm font-bold text-on-surface font-display uppercase tracking-wider">Recent Meals</h3>
            <Link to="/history" className="text-xs font-bold text-primary hover:underline font-sans uppercase tracking-wider">View All</Link>
          </div>

          {meals.length === 0 ? (
            <div className="glass-panel p-8 rounded-3xl text-center text-white/30 space-y-3 font-sans glow-primary">
              <span className="material-symbols-outlined text-3xl text-white/10">restaurant</span>
              <p className="text-xs">You haven't logged any meals today.</p>
              <Link to="/scanner" className="text-primary hover:underline text-xs font-bold block uppercase tracking-wider">Snap a food photo now</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meals.slice(0, 4).map((meal) => {
                // Pick aesthetic diet icons based on category
                let icons = ['restaurant']
                if (meal.mealType === 'Breakfast') icons = ['egg', 'bakery_dining']
                else if (meal.mealType === 'Lunch') icons = ['restaurant', 'grass']
                else if (meal.mealType === 'Dinner') icons = ['kebab_dining', 'opacity']
                else icons = ['cookie', 'apple']

                return (
                  <div key={meal._id} className="glass-panel p-4 rounded-2xl flex items-center gap-4 group cursor-pointer transition-all hover:scale-[1.01] relative">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/5">
                      {meal.image ? (
                        <img
                          src={meal.image}
                          alt={meal.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-emerald-500/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-xl">photo_camera</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5 overflow-hidden font-sans flex-grow pr-8">
                      <h4 className="text-xs font-bold text-on-surface truncate">{meal.name}</h4>
                      <p className="text-[10px] text-on-surface-variant font-medium">
                        {meal.totalCalories} kcal • {meal.mealType}
                      </p>
                      <div className="flex gap-1.5 mt-0.5">
                        {icons.map((ic, i) => (
                          <span key={i} className="material-symbols-outlined text-primary/70 text-sm">{ic}</span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteMeal(meal._id)
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-red-500/0 hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-colors"
                      title="Delete Meal"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Micronutrients Goals Summary */}
        <section className="lg:col-span-4 flex flex-col gap-3 font-sans">
          <div className="px-2">
            <h3 className="text-sm font-bold text-on-surface font-display uppercase tracking-wider">Micronutrients</h3>
          </div>
          <div className="glass-panel p-6 rounded-3xl space-y-4 flex-grow flex flex-col justify-center glow-primary">
            {[
              { name: 'Dietary Fiber', val: `${todayStats.fiber}g`, goal: '30g', percent: Math.min(Math.round((todayStats.fiber / 30) * 100), 100), color: '#4edea3' },
              { name: 'Total Sugar', val: `${todayStats.sugar}g`, goal: '<50g', percent: Math.min(Math.round((todayStats.sugar / 50) * 100), 100), color: '#ffb4ab' }
            ].map(({ name, val, goal, percent, color }) => (
              <div key={name} className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-on-surface-variant">{name}</span>
                  <span className="font-bold text-on-surface">{val} / {goal}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Floating Action Button (FAB) to trigger quick Scanner */}
      <Link
        to="/scanner"
        className="fixed bottom-24 md:bottom-8 right-8 w-16 h-16 bg-primary rounded-full shadow-[0_0_30px_rgba(78,222,163,0.4)] flex items-center justify-center text-on-primary group hover:scale-110 active:scale-95 transition-all z-50 overflow-hidden shrink-0 border border-primary/20"
      >
        <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
      </Link>

      {/* Footer Section */}
      <footer className="w-full py-16 grid grid-cols-1 md:grid-cols-2 lg:flex lg:justify-between items-center bg-surface-container-lowest border-t border-white/5 mt-auto">
        <div className="flex flex-col gap-2">
          <p className="font-headline-md text-headline-md font-bold text-on-surface font-display">MacroMind</p>
          <p className="font-label-md text-label-md text-on-surface-variant font-sans opacity-60">© 2024 MacroMind AI. Computational Nutrition.</p>
        </div>
        <div className="flex flex-wrap gap-8 mt-8 lg:mt-0 font-sans">
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">API Documentation</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Contact</a>
        </div>
      </footer>
    </main>
  )
}
