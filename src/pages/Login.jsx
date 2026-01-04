import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import { 
  Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle, 
  ArrowRight, HelpCircle, Phone
, Sun, Moon } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate login then redirect
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`} style={{ fontFamily: "'IBM Plex Sans', -apple-system, sans-serif" }}>
      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className={`fixed top-4 right-4 z-50 p-3 rounded-lg transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-amber-400' : 'bg-white hover:bg-gray-100 text-gray-600 shadow-lg'}`}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Pattern */}
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100'}`}>
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full" style={{
              backgroundImage: `
                linear-gradient(rgba(245, 158, 11, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(245, 158, 11, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }} />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          
          {/* Rail track illustration */}
          <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden opacity-20">
            <div className="flex items-end h-full">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-8 h-4 border-t-4 border-slate-500 mx-1" />
              ))}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-xl shadow-amber-500/20">
              <span className="text-slate-900 font-bold text-2xl">M</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">MOW-Tel</h1>
              <p className="text-slate-400 text-sm">Telematics Customer Portal</p>
            </div>
          </div>
          
          {/* Main Message */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                Track, Measure, and<br />
                <span className="text-amber-500">Optimize</span> Your Fleet
              </h2>
              <p className="text-slate-400 text-lg max-w-md">
                Real-time visibility into your maintenance-of-way equipment. 
                Monitor productivity, predict maintenance, and keep your operation running.
              </p>
            </div>
            
            {/* Feature highlights */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-slate-300">Real-time fleet utilization tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-slate-300">LiDAR and camera-assisted safety systems</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-slate-300">Predictive maintenance alerts</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-slate-300">Comprehensive service ticket management</span>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-slate-500">
            <p>© 2026 MOW Equipment Solutions, Inc.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-xl shadow-amber-500/20">
              <span className="text-slate-900 font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">MOW-Tel</h1>
              <p className="text-slate-400 text-xs">Customer Portal</p>
            </div>
          </div>
          
          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Sign in to access your fleet dashboard</p>
          </div>
          
          {/* Demo Notice */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-400 font-medium">Demo Mode</p>
                <p className="text-xs text-amber-400/70 mt-1">
                  This is a demonstration portal. Enter any credentials to explore the interface.
                </p>
              </div>
            </div>
          </div>
          
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>
            
            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <a href="#" className="text-sm text-amber-500 hover:text-amber-400 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-11 pr-12 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500/20"
                />
                <span className="text-sm text-slate-400">Remember me</span>
              </label>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span className="text-sm text-rose-400">{error}</span>
              </div>
            )}
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-900 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          
          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="text-sm text-slate-500">or</span>
            <div className="flex-1 h-px bg-slate-700"></div>
          </div>
          
          {/* SSO Button */}
          <button className="w-full bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sign in with SSO
          </button>
          
          {/* Help */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-center gap-6 text-sm">
              <a href="#" className="flex items-center gap-1 text-slate-400 hover:text-amber-500 transition-colors">
                <HelpCircle className="w-4 h-4" />
                Need help?
              </a>
              <a href="#" className="flex items-center gap-1 text-slate-400 hover:text-amber-500 transition-colors">
                <Phone className="w-4 h-4" />
                855-669-4264
              </a>
            </div>
          </div>
          
          {/* Request Access */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <a href="#" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">
                Request access
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
