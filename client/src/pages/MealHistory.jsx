import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useNutritionStore } from '../store'
import API from '../api/axios'
import {
  History,
  Search,
  Filter,
  Trash2,
  Calendar,
  Flame,
  ChevronRight,
  TrendingUp,
  Activity,
  Plus,
  PieChart as PieIcon,
  Smile
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function MealHistory() {
  const { meals, setMeals } = useNutritionStore()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All')

  const fetchMealsHistory = async () => {
    try {
      setLoading(true)
      const { data } = await API.get('/meals')
      setMeals(data)
    } catch (error) {
      console.error('Error fetching meals:', error)
      toast.error('Could not load meal history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMealsHistory()
  }, [])

  const handleDeleteMeal = async (id) => {
    try {
      await API.delete(`/meals/${id}`)
      toast.success('Meal deleted')
      fetchMealsHistory() // Refresh data
    } catch (error) {
      console.error('Delete meal error:', error)
      toast.error('Could not delete meal')
    }
  }

  // Filter & Search Logic
  const filteredMeals = meals.filter((meal) => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      meal.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = filterType === 'All' || meal.mealType === filterType

    return matchesSearch && matchesFilter
  })

  // Group meals by local calendar date string
  const getGroupedMeals = () => {
    const groups = {}
    filteredMeals.forEach((meal) => {
      const dateKey = new Date(meal.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      if (!groups[dateKey]) {
        groups[dateKey] = {
          meals: [],
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0
        }
      }
      groups[dateKey].meals.push(meal)
      groups[dateKey].totalCalories += meal.totalCalories
      groups[dateKey].totalProtein += meal.totalProtein
      groups[dateKey].totalCarbs += meal.totalCarbs
      groups[dateKey].totalFat += meal.totalFat
    })
    return groups
  }

  const groupedMeals = getGroupedMeals()

  return (
    <div className="min-h-screen bg-black pb-20 pt-8 px-6 max-w-6xl mx-auto space-y-6 md:space-y-8 text-on-surface font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-on-surface flex items-center gap-2">
            <History size={24} className="text-primary" />
            Meal History Logs
          </h1>
          <p className="text-on-surface-variant text-xs md:text-sm mt-1 font-sans font-medium">Review and manage your logged food logs and nutrition archives.</p>
        </div>
        <Link
          to="/scanner"
          className="btn-primary flex items-center justify-center gap-2 self-start sm:self-auto text-xs px-5 py-2.5 uppercase tracking-wider font-bold"
        >
          <Plus size={14} />
          Log New Meal
        </Link>
      </div>

      {/* FILTER & SEARCH UTILITY BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="sm:col-span-2 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60" />
          <input
            type="text"
            placeholder="Search meals or ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-glass pl-11 py-2.5 text-sm"
          />
        </div>

        {/* Filter Selection */}
        <div className="relative">
          <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60 pointer-events-none" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-glass pl-11 py-2.5 text-sm appearance-none cursor-pointer text-on-surface-variant"
          >
            <option value="All">All Categories</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>
        </div>
      </div>

      {/* MAIN LOG ARCHIVE VIEW */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant/60 text-xs">Accessing nutrition archives...</p>
        </div>
      ) : Object.keys(groupedMeals).length === 0 ? (
        <div className="glass-card p-12 text-center text-on-surface-variant/40 space-y-4 rounded-2xl border border-white/5">
          <PieIcon size={40} className="mx-auto text-on-surface-variant/20" />
          <h3 className="font-semibold text-on-surface text-sm">No Logged Meals Found</h3>
          <p className="text-[11px] text-on-surface-variant max-w-sm mx-auto leading-relaxed">
            We couldn't find any meal logs matching your search parameters. Try scanning a food photo to initiate daily tracking!
          </p>
          <Link to="/scanner" className="btn-secondary inline-flex items-center gap-2 text-xs py-2 px-4 mt-2">
            Scan First Meal
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedMeals).map(([dateKey, group]) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              key={dateKey}
              className="space-y-3"
            >
              {/* Date Header & Aggregate totals */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2 gap-2">
                <h3 className="font-display font-bold text-on-surface text-xs sm:text-sm flex items-center gap-2">
                  <Calendar size={13} className="text-primary" />
                  {dateKey}
                </h3>
                <div className="flex gap-4 text-xs font-semibold text-on-surface-variant/80">
                  <span className="text-primary font-bold">{Math.round(group.totalCalories)} kcal</span>
                  <span>P: {Math.round(group.totalProtein)}g</span>
                  <span>C: {Math.round(group.totalCarbs)}g</span>
                  <span>F: {Math.round(group.totalFat)}g</span>
                </div>
              </div>

              {/* Meals logged under this date */}
              <div className="space-y-2.5">
                {group.meals.map((meal) => (
                  <div
                    key={meal._id}
                    className="glass-card p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/5 hover:border-primary/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3.5">
                      {meal.image ? (
                        <img
                          src={meal.image}
                          alt={meal.name}
                          className="w-14 h-14 rounded-xl object-cover border border-white/10"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <History size={20} className="text-primary" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-on-surface text-sm leading-tight">{meal.name}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-on-surface-variant/60">
                          <span className="badge-green">{meal.mealType}</span>
                          <span>•</span>
                          <span>{new Date(meal.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span>•</span>
                          <span className="text-primary font-semibold">{meal.totalCalories} kcal</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                      {/* Macro Breakdown */}
                      <div className="grid grid-cols-3 gap-4 text-center sm:text-right text-xs text-on-surface-variant/80">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-cyan-400">{meal.totalProtein}g</div>
                          <div className="text-[10px] text-on-surface-variant/40 uppercase">Protein</div>
                        </div>
                        <div className="space-y-0.5">
                          <div className="font-semibold text-purple-400">{meal.totalCarbs}g</div>
                          <div className="text-[10px] text-on-surface-variant/40 uppercase">Carbs</div>
                        </div>
                        <div className="space-y-0.5">
                          <div className="font-semibold text-yellow-400">{meal.totalFat}g</div>
                          <div className="text-[10px] text-on-surface-variant/40 uppercase">Fat</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <button
                        onClick={() => handleDeleteMeal(meal._id)}
                        className="p-2 rounded-xl bg-red-500/0 hover:bg-red-500/10 text-on-surface-variant/40 hover:text-red-400 transition-colors self-center"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
