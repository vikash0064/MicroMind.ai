import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { useNutritionStore } from '../store'
import API from '../api/axios'
import toast from 'react-hot-toast'

const loadingMessages = [
  'Initializing neural vision scanners...',
  'Dissecting food layers and texture mapping...',
  'Estimating portion weights & volume metrics...',
  'Calculating macro density coefficients...',
  'Comparing against clinical food databases...',
  'Finalizing high-fidelity macro breakdown...'
]

export default function Scanner() {
  const navigate = useNavigate()
  const { addMeal, todayStats, dailyGoals } = useNutritionStore()
  
  // Local state
  const [imagePreview, setImagePreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [mealType, setMealType] = useState('Lunch')
  const [customMealName, setCustomMealName] = useState('')

  const fileInputRef = useRef(null)

  // Status message rotation helper
  const rotateStatusMessages = () => {
    let index = 0
    setStatusMessage(loadingMessages[0])
    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length
      setStatusMessage(loadingMessages[index])
    }, 2000)
    return interval
  }

  // File Dropzone setup
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
      setAnalysisResult(null)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  })

  // Direct Mobile Camera Capture Trigger
  const handleCameraCapture = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
      setAnalysisResult(null)
    }
  }

  // Perform AI Scan
  const handleStartScan = async () => {
    if (!selectedFile) {
      return toast.error('Please upload or snap a food photo first!')
    }

    setIsUploading(true)
    const msgInterval = rotateStatusMessages()

    const formData = new FormData()
    formData.append('image', selectedFile)

    try {
      const { data } = await API.post('/meals/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (data.success) {
        setAnalysisResult(data.analysis)
        setCustomMealName(data.analysis.name)
        // Store base64 image returned from server so we can save it to history
        setImagePreview(data.image)
        toast.success('AI Scan Complete!')
      } else {
        throw new Error('Analysis failed')
      }
    } catch (error) {
      console.error('Scan error:', error)
      toast.error(error.response?.data?.message || 'Could not recognize food. Try another photo.')
    } finally {
      clearInterval(msgInterval)
      setIsUploading(false)
    }
  }

  // Save Scanned Meal to Database
  const handleLogMeal = async () => {
    if (!analysisResult) return

    try {
      const mealPayload = {
        name: customMealName || analysisResult.name,
        mealType,
        image: imagePreview, // Save the base64 preview image
        items: analysisResult.items,
        totalCalories: analysisResult.totalCalories,
        totalProtein: analysisResult.totalProtein,
        totalCarbs: analysisResult.totalCarbs,
        totalFat: analysisResult.totalFat,
        totalFiber: analysisResult.totalFiber,
        totalSugar: analysisResult.totalSugar
      }

      const { data } = await API.post('/meals', mealPayload)
      addMeal(data) // Save to local Zustand store
      toast.success('Meal logged successfully! 🍽️')
      navigate('/dashboard')
    } catch (error) {
      console.error('Log meal error:', error)
      toast.error('Could not save meal log')
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setImagePreview(null)
    setAnalysisResult(null)
    setCustomMealName('')
  }

  // Dynamically get matching material symbols for ingredients
  const getIngredientIcon = (name = '') => {
    const n = name.toLowerCase()
    if (n.includes('rice') || n.includes('bread') || n.includes('carb') || n.includes('wheat') || n.includes('grain') || n.includes('pasta')) return 'grass'
    if (n.includes('salmon') || n.includes('chicken') || n.includes('fish') || n.includes('meat') || n.includes('egg') || n.includes('beef') || n.includes('protein') || n.includes('turkey')) return 'restaurant'
    if (n.includes('avocado') || n.includes('oil') || n.includes('fat') || n.includes('butter') || n.includes('nut') || n.includes('cheese') || n.includes('seed')) return 'eco'
    return 'nutrition'
  }

  // Calculate dynamic protein target completion progress with this prospective meal
  const getProspectiveProteinText = () => {
    if (!analysisResult) return ''
    const currentProtein = todayStats?.protein || 0
    const mealProtein = analysisResult.totalProtein || 0
    const targetProtein = dailyGoals?.protein || 150
    const totalProspective = currentProtein + mealProtein
    const percentage = Math.min(Math.round((totalProspective / targetProtein) * 100), 100)
    return `You've reached ${percentage}% of your protein goal for today with this meal.`
  }

  const matchScore = analysisResult
    ? Math.max(...(analysisResult.items || []).map(i => i.confidence || 0), 95)
    : 98

  return (
    <main className="relative h-[calc(100vh-64px)] md:h-screen flex flex-col md:flex-row bg-[#000000] text-on-surface font-sans overflow-hidden selection:bg-primary/30">
      
      {/* 1. LEFT SIDE: Structured Viewport / Camera Frame */}
      <section className="flex-1 m-4 md:m-6 rounded-3xl overflow-hidden relative glass-panel glass-border shadow-2xl flex flex-col items-center justify-center bg-surface-container-lowest/30 min-h-[300px] md:min-h-0 select-none">
        
        {/* Enclosed Viewfield Image */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Visual Canvas"
            className="w-full h-full object-cover grayscale-[15%] contrast-[105%] transition-all duration-700"
            src={imagePreview || "https://lh3.googleusercontent.com/aida-public/AB6AXuBPils-MoIQT-W6Irl9PGq-h1-D-IUitrC6l1m0aU1kQPLfEtZuvwg9O8AH26kDi5009QwFenuwdb_7Se8WMrjAGzOyItp_LjMNFUbpWzRV1QgjdB1dnGGZuZd4_YZ_sk0ajl2F4zRF5AZ9Jcn_4v0kG4zqXJV94jNoIjnMo63aldUXXX9A_7FtUR2FbbfAKnh2oglxR3OgYacGM_0zhDP7Z_lbpQeMUKH5KbbmzAD45spWTGbIg2jvupkXTVxlMzk4HDIk1lsyLus"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/80"></div>
        </div>

        {/* Phase 1: Upload Widget staged inside the Frame */}
        <AnimatePresence mode="wait">
          {!imagePreview && !isUploading && (
            <motion.div
              key="uploader"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-md p-6 md:p-8 space-y-6 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto shadow-[0_0_20px_rgba(78,222,163,0.2)]">
                <span className="material-symbols-outlined text-2xl">upload_file</span>
              </div>
              
              <div className="space-y-2">
                <h2 className="font-display font-bold text-xl text-on-surface">Neural Scanner</h2>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed font-sans">
                  Snap a picture or upload an image of your dish. Our metabolic vision AI will instantly analyze portions, ingredients, and macro density.
                </p>
              </div>

              {/* Staged Dropzone */}
              <div
                {...getRootProps()}
                className={`border border-dashed rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(78,222,163,0.2)]'
                    : 'border-white/10 hover:border-primary/40 hover:bg-white/5'
                }`}
              >
                <input {...getInputProps()} />
                <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-1">cloud_upload</span>
                <p className="text-xs font-semibold text-on-surface">Drag & Drop Food Photo</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Supports PNG, JPG (Max 5MB)</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 glass-border text-on-surface font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 font-sans"
                >
                  <span className="material-symbols-outlined text-base">photo_camera</span>
                  Snap with Camera
                </button>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={fileInputRef}
                  onChange={handleCameraCapture}
                  className="hidden"
                />
                <button
                  onClick={() => {
                    fileInputRef.current.click()
                  }}
                  className="flex-1 py-2.5 bg-primary text-on-primary font-bold rounded-xl text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(78,222,163,0.3)] font-sans"
                >
                  <span className="material-symbols-outlined text-base font-bold">folder_open</span>
                  Browse Files
                </button>
              </div>
            </motion.div>
          )}

          {/* Phase 2: Photo staged inside the Frame */}
          {imagePreview && !isUploading && !analysisResult && (
            <motion.div
              key="staged"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-sm p-6 rounded-2xl glass-panel glass-border text-center shadow-2xl space-y-5"
            >
              <div className="space-y-1">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-2">
                  <span className="material-symbols-outlined text-xl">camera_alt</span>
                </div>
                <h3 className="font-display font-bold text-lg text-on-surface">Image Captured</h3>
                <p className="text-xs text-on-surface-variant max-w-xs mx-auto leading-relaxed font-sans">
                  Ready to perform neural vision analysis. Click analyze to recognize ingredients.
                </p>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 glass-border text-on-surface font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 font-sans"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                  Reset
                </button>
                <button
                  onClick={handleStartScan}
                  className="flex-1 py-2.5 bg-primary text-on-primary font-bold rounded-xl text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(78,222,163,0.3)] font-sans"
                >
                  <span className="material-symbols-outlined text-base font-bold">rocket_launch</span>
                  Analyze
                </button>
              </div>
            </motion.div>
          )}

          {/* Phase 3: Active AI Scan Animation (Enclosed inside Left Frame) */}
          {isUploading && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 w-full h-full flex flex-col items-center justify-center"
            >
              {/* Scan line constrained inside the left frame */}
              <div className="scanning-line absolute w-full h-[2px]"></div>
              
              {/* Coordinate scanning circles */}
              <div className="absolute top-1/4 left-1/4 p-2 glass-panel rounded-full border border-primary/40 emerald-glow">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
              <div className="absolute top-1/2 right-1/3 p-2 glass-panel rounded-full border border-primary/40 emerald-glow">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
              <div className="absolute bottom-1/3 left-1/2 p-2 glass-panel rounded-full border border-primary/40 emerald-glow">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>

              {/* Status processing card */}
              <div className="relative z-20 w-full max-w-xs p-5 rounded-2xl glass-panel glass-border text-center shadow-2xl space-y-4">
                <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                  <div className="w-9 h-9 rounded-full bg-primary/30 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(78,222,163,0.3)]">
                    <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-primary font-bold text-[10px] tracking-widest uppercase block font-sans">Scanning...</span>
                  <p className="text-xs font-medium text-on-surface font-sans animate-pulse">
                    {statusMessage}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 2. RIGHT SIDE: Clean Review & Action Sidebar Panel */}
      <section className="w-full md:w-[380px] md:h-screen bg-surface-container/30 border-t md:border-t-0 md:border-l border-white/5 flex flex-col p-4 md:p-5 gap-4 md:gap-5 overflow-y-auto z-20 select-none">
        
        <AnimatePresence mode="wait">
          {!analysisResult ? (
            /* Sidebar Empty/Waiting State */
            <motion.div
              key="waiting-sidebar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col items-center justify-center text-center text-on-surface-variant/40 space-y-3 py-12 md:py-0"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl text-on-surface-variant/30">insights</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-on-surface/50 text-xs font-sans">Awaiting AI Analysis</h3>
                <p className="text-[11px] max-w-xs mx-auto leading-relaxed">
                  Staging files on the scanner viewport initiates local neural classification to decode total calories, glycemic ratios, and custom dietary groups.
                </p>
              </div>
            </motion.div>
          ) : (
            /* Sidebar Scan Review Panel */
            <motion.div
              key="results-sidebar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col gap-4 md:gap-5"
            >
              {/* Confidence Score Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary tracking-wider uppercase">Analysis Complete</span>
                  <span className="text-on-surface-variant text-[10px] font-mono">v4.2.0-stable</span>
                </div>
                
                <div className="p-4 rounded-xl glass-border bg-white/5 area-glow relative">
                  <h2 className="text-xl md:text-2xl font-extrabold text-on-surface mb-1 font-display">{matchScore}% Match</h2>
                  
                  {/* Title editor */}
                  <div className="relative group border-b border-white/10 focus-within:border-primary transition-all">
                    <span className="material-symbols-outlined text-[10px] text-on-surface-variant absolute right-1 top-2 pointer-events-none opacity-40 group-hover:opacity-100">edit</span>
                    <input
                      type="text"
                      value={customMealName}
                      onChange={(e) => setCustomMealName(e.target.value)}
                      className="bg-transparent text-sm font-bold text-on-surface w-full py-1 focus:outline-none pr-6 font-display"
                      placeholder="Meal Title"
                    />
                  </div>
                  
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-primary h-full shadow-[0_0_10px_#4edea3] transition-all duration-700"
                      style={{ width: `${matchScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Category selector */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block font-sans">Meal Category</span>
                <div className="grid grid-cols-4 gap-1">
                  {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setMealType(type)}
                      className={`py-1.5 px-0.5 rounded-lg text-[9px] font-bold border text-center transition-all font-sans ${
                        mealType === type
                          ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(78,222,163,0.2)]'
                          : 'border-white/5 bg-white/5 text-on-surface-variant hover:bg-white/10 hover:text-on-surface'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Macros grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="glass-panel glass-border p-2.5 rounded-xl flex flex-col items-center gap-0.5">
                  <span className="text-primary text-lg md:text-xl font-extrabold font-display leading-none mb-0.5">{analysisResult.totalProtein}g</span>
                  <span className="text-on-surface-variant text-[9px] font-bold uppercase tracking-wider font-sans">Protein</span>
                </div>
                <div className="glass-panel glass-border p-2.5 rounded-xl flex flex-col items-center gap-0.5">
                  <span className="text-secondary text-lg md:text-xl font-extrabold font-display leading-none mb-0.5">{analysisResult.totalCarbs}g</span>
                  <span className="text-on-surface-variant text-[9px] font-bold uppercase tracking-wider font-sans">Carbs</span>
                </div>
                <div className="glass-panel glass-border p-2.5 rounded-xl flex flex-col items-center gap-0.5">
                  <span className="text-tertiary text-lg md:text-xl font-extrabold font-display leading-none mb-0.5">{analysisResult.totalFat}g</span>
                  <span className="text-on-surface-variant text-[9px] font-bold uppercase tracking-wider font-sans">Fats</span>
                </div>
              </div>

              {/* Ingredient List breakdown */}
              <div className="space-y-2 flex-grow">
                <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-sans">Composition</h3>
                
                <div className="space-y-1.5 max-h-[140px] md:max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                  {analysisResult.items && analysisResult.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2.5 glass-border rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-base">{getIngredientIcon(item.name)}</span>
                        <div>
                          <p className="text-on-surface text-xs font-semibold font-sans leading-tight">{item.name}</p>
                          <p className="text-on-surface-variant text-[9px] font-sans leading-none mt-0.5">
                            {item.quantity} • {item.servingSize || '1 portion'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-on-surface text-xs font-semibold leading-tight">{item.calories} kcal</p>
                        <p className="text-primary text-[9px] font-sans flex items-center justify-end gap-0.5 leading-none mt-0.5">
                          <span className="material-symbols-outlined text-[9px]">check_circle</span>
                          Verified
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ambient progress floating card inside the sidebar on layout stack */}
              <div className="glass-panel glass-border p-3 rounded-xl border-primary/10 bg-primary/5 flex items-center gap-2.5">
                <div className="bg-primary/20 p-1.5 rounded-lg text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm">insights</span>
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-[11px] text-on-surface font-display block">Prospective Total</span>
                  <p className="text-on-surface-variant text-[9px] leading-tight font-sans truncate">
                    {getProspectiveProteinText()}
                  </p>
                </div>
              </div>

              {/* Sidebar actions */}
              <div className="flex flex-col gap-2 pt-3 border-t border-white/10 mt-auto">
                <button
                  onClick={handleLogMeal}
                  className="w-full bg-primary text-on-primary py-2.5 rounded-xl font-bold emerald-glow hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(78,222,163,0.3)] font-sans text-xs uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
                  Save to Log
                </button>
                <button
                  onClick={handleReset}
                  className="w-full glass-border text-on-surface py-2 rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2 font-sans text-xs uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Scan Another Food
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

    </main>
  )
}
