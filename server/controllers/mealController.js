import Meal from '../models/Meal.js'
import { analyzeFoodImage } from '../utils/gemini.js'
import fs from 'fs'

// @desc    Scan meal image & analyze nutrition
// @route   POST /api/meals/scan
// @access  Private
export const scanMeal = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400)
      throw new Error('Please upload an image file')
    }

    const filePath = req.file.path
    const mimeType = req.file.mimetype
    const originalName = req.file.originalname

    // Analyze using Gemini Vision AI (with mock fallback)
    const result = await analyzeFoodImage(filePath, mimeType, originalName)

    // Convert file to base64 so frontend can display it immediately
    const fileBuffer = fs.readFileSync(filePath)
    const base64Image = `data:${mimeType};base64,${fileBuffer.toString('base64')}`

    // Clean up temporary uploaded file asynchronously
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting temp file:', err)
    })

    res.json({
      success: true,
      analysis: result,
      image: base64Image
    })
  } catch (error) {
    // Make sure to clean up file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, () => {})
    }
    next(error)
  }
}

// @desc    Save/Log a meal
// @route   POST /api/meals
// @access  Private
export const saveMeal = async (req, res, next) => {
  try {
    const {
      name,
      mealType,
      image,
      items,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
      totalSugar
    } = req.body

    if (!name || !items || items.length === 0) {
      res.status(400)
      throw new Error('Invalid meal data, name and items are required')
    }

    const meal = await Meal.create({
      user: req.user._id,
      name,
      mealType: mealType || 'Snack',
      image: image || '',
      items,
      totalCalories: totalCalories || 0,
      totalProtein: totalProtein || 0,
      totalCarbs: totalCarbs || 0,
      totalFat: totalFat || 0,
      totalFiber: totalFiber || 0,
      totalSugar: totalSugar || 0
    })

    res.status(201).json(meal)
  } catch (error) {
    next(error)
  }
}

// @desc    Get user's logged meals
// @route   GET /api/meals
// @access  Private
export const getMeals = async (req, res, next) => {
  try {
    const meals = await Meal.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(meals)
  } catch (error) {
    next(error)
  }
}

// @desc    Delete a logged meal
// @route   DELETE /api/meals/:id
// @access  Private
export const deleteMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id)

    if (!meal) {
      res.status(404)
      throw new Error('Meal not found')
    }

    // Check ownership
    if (meal.user.toString() !== req.user._id.toString()) {
      res.status(401)
      throw new Error('User not authorized to delete this meal')
    }

    await Meal.findByIdAndDelete(req.params.id)

    res.json({ message: 'Meal removed successfully', id: req.params.id })
  } catch (error) {
    next(error)
  }
}

// @desc    Get macro stats and 7-day chart history
// @route   GET /api/meals/stats
// @access  Private
export const getStats = async (req, res, next) => {
  try {
    const meals = await Meal.find({ user: req.user._id }).sort({ createdAt: 1 })

    // Calculate today's stats
    const today = new Date().toDateString()
    const todayMeals = meals.filter(m => new Date(m.createdAt).toDateString() === today)
    
    const todayStats = todayMeals.reduce((acc, m) => ({
      calories: acc.calories + m.totalCalories,
      protein: acc.protein + m.totalProtein,
      carbs: acc.carbs + m.totalCarbs,
      fat: acc.fat + m.totalFat,
      fiber: acc.fiber + m.totalFiber,
      sugar: acc.sugar + m.totalSugar
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 })

    // Build 7-day history trend data
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateString = d.toDateString()
      const label = d.toLocaleDateString('en-US', { weekday: 'short' })

      const dayMeals = meals.filter(m => new Date(m.createdAt).toDateString() === dateString)
      const dayTotals = dayMeals.reduce((acc, m) => ({
        calories: acc.calories + m.totalCalories,
        protein: acc.protein + m.totalProtein,
        carbs: acc.carbs + m.totalCarbs,
        fat: acc.fat + m.totalFat
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

      last7Days.push({
        date: d.toISOString().split('T')[0],
        dayLabel: label,
        calories: Math.round(dayTotals.calories),
        protein: Math.round(dayTotals.protein * 10) / 10,
        carbs: Math.round(dayTotals.carbs * 10) / 10,
        fat: Math.round(dayTotals.fat * 10) / 10
      })
    }

    res.json({
      todayStats: {
        calories: Math.round(todayStats.calories),
        protein: Math.round(todayStats.protein * 10) / 10,
        carbs: Math.round(todayStats.carbs * 10) / 10,
        fat: Math.round(todayStats.fat * 10) / 10,
        fiber: Math.round(todayStats.fiber * 10) / 10,
        sugar: Math.round(todayStats.sugar * 10) / 10
      },
      last7Days
    })
  } catch (error) {
    next(error)
  }
}
