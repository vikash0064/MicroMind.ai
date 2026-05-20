import mongoose from 'mongoose'

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, default: '1 serving' },
  servingSize: { type: String, default: '100g' },
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 },
  confidence: { type: Number, default: 95 }
})

const mealSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    default: 'Snack'
  },
  image: {
    type: String, // Base64 or URL
    default: ''
  },
  items: [foodItemSchema],
  totalCalories: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFat: { type: Number, default: 0 },
  totalFiber: { type: Number, default: 0 },
  totalSugar: { type: Number, default: 0 }
}, { timestamps: true })

export default mongoose.model('Meal', mealSchema)
