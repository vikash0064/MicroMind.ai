import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { useAuthStore } from '../store'
import API from '../api/axios'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      return toast.error('Please fill in all fields')
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters')
    }

    setLoading(true)
    try {
      const { data } = await API.post('/users/register', { name, email, password })
      
      // Save authorization token to store & axios defaults
      setAuth(data, data.token)
      API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      
      toast.success(`Account created! Welcome, ${data.name}!`)
      navigate('/dashboard')
    } catch (error) {
      console.error('Signup error:', error)
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Interactive Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-10 bg-emerald-500 animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-10 bg-cyan-500 animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="flex items-center gap-2 mb-2 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <Zap size={20} className="text-white" />
              <div className="absolute inset-0 animate-shimmer" />
            </div>
            <span className="font-display font-bold text-2xl">
              <span className="gradient-text-green">Macro</span>
              <span className="text-white">Mind</span>
            </span>
          </Link>
          <p className="text-white/40 text-sm">Snap Food. Track Macros. Build Better Health.</p>
        </div>

        {/* Signup Card */}
        <div className="glass-card glow-border p-8 relative">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-glass pl-12"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-glass pl-12"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-glass pl-12"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin text-white" />
                  Creating Account...
                </>
              ) : (
                <>
                  Register & Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Login redirection */}
          <div className="text-center mt-6 text-sm text-white/40">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
