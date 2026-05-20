import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        localStorage.removeItem('macromind-auth')
      },
      updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
    }),
    {
      name: 'macromind-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)

// Nutrition Store
export const useNutritionStore = create((set, get) => ({
  scanResult: null,
  isScanning: false,
  scanError: null,
  meals: [],
  dailyGoals: {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
    water: 2500,
  },
  todayStats: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0,
  },

  setScanResult: (result) => set({ scanResult: result, scanError: null }),
  setScanning: (isScanning) => set({ isScanning }),
  setScanError: (error) => set({ scanError: error, isScanning: false }),
  clearScan: () => set({ scanResult: null, scanError: null }),

  setMeals: (meals) => {
    const today = new Date().toDateString()
    const todayMeals = meals.filter(m => new Date(m.createdAt).toDateString() === today)
    const stats = todayMeals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.totalCalories || 0),
      protein: acc.protein + (meal.totalProtein || 0),
      carbs: acc.carbs + (meal.totalCarbs || 0),
      fat: acc.fat + (meal.totalFat || 0),
      water: acc.water,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0 })
    set({ meals, todayStats: stats })
  },

  addMeal: (meal) => {
    set((state) => {
      const meals = [meal, ...state.meals]
      const today = new Date().toDateString()
      const todayMeals = meals.filter(m => new Date(m.createdAt).toDateString() === today)
      const stats = todayMeals.reduce((acc, m) => ({
        calories: acc.calories + (m.totalCalories || 0),
        protein: acc.protein + (m.totalProtein || 0),
        carbs: acc.carbs + (m.totalCarbs || 0),
        fat: acc.fat + (m.totalFat || 0),
        water: acc.water,
      }), { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0 })
      return { meals, todayStats: stats }
    })
  },

  updateWater: (amount) => set((state) => ({
    todayStats: { ...state.todayStats, water: state.todayStats.water + amount }
  })),

  updateGoals: (goals) => set((state) => ({ dailyGoals: { ...state.dailyGoals, ...goals } })),
}))

// UI Store
export const useUIStore = create((set) => ({
  theme: 'dark',
  sidebarOpen: false,
  activeNav: 'home',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActiveNav: (nav) => set({ activeNav: nav }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}))
