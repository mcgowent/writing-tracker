import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PenLine } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export const AuthScreen = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signIn, signUp, loading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const err = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password)

    if (err) {
      setError(err)
    } else if (mode === 'signup') {
      setSuccess('Account created! Check your email to confirm, then sign in.')
      setMode('signin')
    } else {
      navigate('/')
    }
  }

  const handleGuest = () => navigate('/')

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <div className="flex flex-col items-center gap-3 mb-10">
        <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center">
          <PenLine size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Writing Tracker</h1>
        <p className="text-sm text-slate-400 text-center">
          Track every word. Build the habit.
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-slate-900 rounded-3xl p-6 space-y-5">
        {/* Mode toggle */}
        <div className="flex bg-slate-800 rounded-xl p-1">
          {(['signin', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); setSuccess('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                mode === m
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-slate-800 text-slate-100 rounded-xl px-4 py-3 text-sm border border-slate-700 focus:outline-none focus:border-violet-500 placeholder:text-slate-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full bg-slate-800 text-slate-100 rounded-xl px-4 py-3 text-sm border border-slate-700 focus:outline-none focus:border-violet-500 placeholder:text-slate-600 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
          )}
          {success && (
            <p className="text-green-400 text-xs bg-green-400/10 rounded-lg px-3 py-2">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3.5 text-sm transition-colors"
          >
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-xs text-slate-600">or</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        <button
          onClick={handleGuest}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl py-3 text-sm transition-colors"
        >
          Continue as Guest
        </button>
        <p className="text-xs text-slate-600 text-center">
          Guest mode saves data locally only — no sync across devices.
        </p>
      </div>
    </div>
  )
}
