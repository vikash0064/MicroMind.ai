import express from 'express'
import multer from 'multer'
import fs from 'fs'
import {
  scanMeal,
  saveMeal,
  getMeals,
  deleteMeal,
  getStats
} from '../controllers/mealController.js'
import { protect } from '../middleware/authMiddleware.js'

// Ensure uploads folder exists
const uploadDir = 'uploads/'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'), false)
    }
  }
})

const router = express.Router()

// Apply authentication middleware to all routes
router.use(protect)

router.route('/')
  .get(getMeals)
  .post(saveMeal)

router.post('/scan', upload.single('image'), scanMeal)
router.get('/stats', getStats)
router.delete('/:id', deleteMeal)

export default router
