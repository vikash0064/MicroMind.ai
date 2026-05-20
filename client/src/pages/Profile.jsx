import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore, useNutritionStore } from '../store'
import API from '../api/axios'
import {
  User,
  Shield,
  Dumbbell,
  Droplet,
  Flame,
  Wheat,
  Activity,
  Lock,
  Mail,
  Save,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const { dailyGoals, updateGoals } = useNutritionStore()

  // Form states
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  
  // Goals states
  const [calories, setCalories] = useState(user?.goals?.calories || dailyGoals.calories)
  const [protein, setProtein] = useState(user?.goals?.protein || dailyGoals.protein)
  const [carbs, setCarbs] = useState(user?.goals?.carbs || dailyGoals.carbs)
  const [fat, setFat] = useState(user?.goals?.fat || dailyGoals.fat)
  const [water, setWater] = useState(user?.goals?.water || dailyGoals.water)

  const [loading, setLoading] = useState(false)

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        name,
        email,
        goals: {
          calories: Number(calories),
          protein: Number(protein),
          carbs: Number(carbs),
          fat: Number(fat),
          water: Number(water)
        }
      }

      if (password) {
        payload.password = password
      }

      const { data } = await API.put('/users/profile', payload)
      
      // Update both stores
      updateUser(data)
      updateGoals(data.goals)
      
      // Clear password field
      setPassword('')
      
      toast.success('Preferences updated successfully! 🎯')
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error(error.response?.data?.message || 'Could not update preferences')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black pb-20 pt-8 px-6 max-w-6xl mx-auto space-y-6 md:space-y-8 text-on-surface font-sans animate-fade-in">
      <div className="border-b border-white/5 pb-6">
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-on-surface flex items-center gap-2">
          <User size={24} className="text-primary" />
          Settings & Goals
        </h1>
        <p className="text-on-surface-variant text-xs md:text-sm mt-1 font-sans font-medium">Customize your body parameters, daily nutrient limits, and profile details.</p>
      </div>

      <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
        {/* LEFT COLUMN: ACCOUNT SETTINGS */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-5 space-y-5 rounded-2xl border border-white/5 hover:border-primary/10 transition-all duration-300">
            <h3 className="font-semibold text-on-surface text-xs uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5 font-sans">
              <Shield size={14} className="text-primary" />
              Account Settings
            </h3>

            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Display Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-glass pl-10 text-xs py-2.5"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-glass pl-10 text-xs py-2.5"
                  required
                />
              </div>
            </div>

            {/* Change Password */}
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">New Password (optional)</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-glass pl-10 text-xs py-2.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DIETARY METRIC GOALS */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-5 space-y-6 rounded-2xl border border-white/5 hover:border-primary/10 transition-all duration-300">
            <h3 className="font-semibold text-on-surface text-xs uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5 font-sans">
              <Activity size={14} className="text-primary" />
              Daily Caloric & Macro Targets
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Daily Calories */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={13} className="text-primary" />
                  Calorie Goal (kcal)
                </label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="input-glass text-xs py-2.5 font-bold font-mono"
                  required
                />
              </div>

              {/* Water Intake */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet size={13} className="text-secondary" />
                  Water Goal (ml)
                </label>
                <input
                  type="number"
                  value={water}
                  onChange={(e) => setWater(e.target.value)}
                  className="input-glass text-xs py-2.5 font-bold font-mono"
                  required
                />
              </div>

              {/* Protein Target */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                  <Dumbbell size={13} className="text-secondary" />
                  Protein Target (g)
                </label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="input-glass text-xs py-2.5 font-bold font-mono"
                  required
                />
              </div>

              {/* Carbohydrates Target */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                  <Wheat size={13} className="text-tertiary" />
                  Carbohydrates Target (g)
                </label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  className="input-glass text-xs py-2.5 font-bold font-mono"
                  required
                />
              </div>

              {/* Fats Target */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={13} className="text-error" />
                  Fat Target (g)
                </label>
                <input
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  className="input-glass text-xs py-2.5 font-bold font-mono"
                  required
                />
              </div>
            </div>

            {/* Save Action Button */}
            <div className="border-t border-white/5 pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center justify-center gap-2 text-xs px-5 py-2.5 uppercase tracking-wider font-bold shadow-lg hover:scale-[1.02] transition-transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-black" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={13} />
                    Save Preferences
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
