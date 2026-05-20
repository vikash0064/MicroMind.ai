import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectDB } from './config/db.js'
import { errorHandler } from './middleware/errorMiddleware.js'
import userRoutes from './routes/userRoutes.js'
import mealRoutes from './routes/mealRoutes.js'

const app = express()

// Connect DB
connectDB()

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' })) // Increase payload limit for base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(morgan('dev'))

// Routes
app.use('/api/users', userRoutes)
app.use('/api/meals', mealRoutes)
app.get('/api', (req, res) => res.json({ message: 'API is running' }))

// Error Handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))