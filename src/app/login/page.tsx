'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@/store/features/userSlice';
import { useLoginUserMutation } from '@/store/features/apiSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Eye, EyeOff, Loader2, Shield, ClipboardList, GraduationCap,
  User, LogIn, Mail, Lock, ArrowLeft, Zap, BookOpen
} from 'lucide-react';

const demoAccounts = [
  {
    role: 'Admin',
    email: 'admin@gmail.com',
    password: 'admin1234',
    icon: Shield,
    accent: 'red',
  },
  {
    role: 'Committee',
    email: 'fatema@cse.green.edu.bd',
    password: 'committee',
    icon: ClipboardList,
    accent: 'orange',
  },
  {
    role: 'Supervisor',
    email: 'tanpia@cse.green.edu.bd',
    password: 'supervisor',
    icon: GraduationCap,
    accent: 'emerald',
  },
  {
    role: 'Student',
    email: '221902234@student.green.edu.bd',
    password: 'uttam1234',
    icon: User,
    accent: 'blue',
  },
];

const accentStyles: Record<string, { border: string; text: string; iconBg: string; hover: string; ring: string }> = {
  red: {
    border: 'border-red-200 dark:border-red-800/30',
    text: 'text-red-700 dark:text-red-400',
    iconBg: 'bg-red-100 dark:bg-red-900/40',
    hover: 'hover:bg-red-50 dark:hover:bg-red-950/40',
    ring: 'focus-visible:ring-red-400',
  },
  orange: {
    border: 'border-orange-200 dark:border-orange-800/30',
    text: 'text-orange-700 dark:text-orange-400',
    iconBg: 'bg-orange-100 dark:bg-orange-900/40',
    hover: 'hover:bg-orange-50 dark:hover:bg-orange-950/40',
    ring: 'focus-visible:ring-orange-400',
  },
  emerald: {
    border: 'border-emerald-200 dark:border-emerald-800/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    hover: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/40',
    ring: 'focus-visible:ring-emerald-400',
  },
  blue: {
    border: 'border-blue-200 dark:border-blue-800/30',
    text: 'text-blue-700 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    hover: 'hover:bg-blue-50 dark:hover:bg-blue-950/40',
    ring: 'focus-visible:ring-blue-400',
  },
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleDemoFill = (demo: typeof demoAccounts[0]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    toast.success(`${demo.role} credentials loaded`, {
      duration: 2000,
      style: { borderRadius: '10px', fontWeight: 600, fontSize: '13px' },
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password }).unwrap();
      if (typeof window !== 'undefined') {
        localStorage.setItem('userInfo', JSON.stringify(data));
      }
      dispatch(login(data));
      const userRole = data.role ? data.role.toLowerCase() : '';
      switch (userRole) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'committee':
          router.push('/committee/dashboard');
          break;
        case 'supervisor':
          router.push('/supervisor/dashboard');
          break;
        case 'student':
          router.push('/student/dashboard');
          break;
        default:
          router.push('/');
      }
    } catch (error: any) {
      toast.error(error.data?.message || 'Login failed. Please check your credentials.', {
        style: { borderRadius: '10px', fontWeight: 600, fontSize: '13px' },
      });
    }
  };

  const demoSection = (
    <>
      <div className="flex items-center gap-2 mb-1">
        <Zap className="w-4 h-4 text-amber-500" />
        <span className="text-sm font-extrabold text-gray-800 dark:text-gray-200">Quick Demo Access</span>
      </div>
      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-4">
        Try the platform instantly with different roles.
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {demoAccounts.map((demo) => {
          const Icon = demo.icon;
          const accent = accentStyles[demo.accent];
          return (
            <button
              key={demo.role}
              type="button"
              onClick={() => handleDemoFill(demo)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border ${accent.border} ${accent.hover} transition-all duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 ${accent.ring} cursor-pointer`}
            >
              <div className={`p-1.5 rounded-lg ${accent.iconBg}`}>
                <Icon className={`w-3.5 h-3.5 ${accent.text}`} />
              </div>
              <span className={`text-xs font-extrabold ${accent.text}`}>{demo.role}</span>
            </button>
          );
        })}
      </div>
      <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 text-center mt-3">
        Click any role to auto-fill credentials instantly.
      </p>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
        {/* Top bar */}
        <div className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-10">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <ThemeToggle />
        </div>

        {/* Centered layout */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="flex items-start gap-6 xl:gap-8">
            {/* Left card - Login */}
            <div className="w-[400px] xl:w-[420px] bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
              <div className="p-8">
                {/* Logo */}
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-10 h-10 bg-violet-600 dark:bg-violet-500 rounded-xl flex items-center justify-center shadow-sm">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                      Thes<span className="text-violet-600 dark:text-violet-400">Pro</span>
                    </span>
                    <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 tracking-wider uppercase leading-tight">
                      Thesis &amp; Project Management
                    </p>
                  </div>
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  Welcome back
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 mb-6">
                  Sign in to your account
                </p>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5" htmlFor="email">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                      <input
                        id="email"
                        type="email"
                        placeholder="your.email@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/60 dark:bg-gray-950/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none hover:border-gray-300 dark:hover:border-gray-600 focus:bg-white dark:focus:bg-gray-900 focus:border-violet-500 focus:ring-3 focus:ring-violet-500/10 transition-all text-sm font-semibold text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5" htmlFor="password">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a secure password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50/60 dark:bg-gray-950/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none hover:border-gray-300 dark:hover:border-gray-600 focus:bg-white dark:focus:bg-gray-900 focus:border-violet-500 focus:ring-3 focus:ring-violet-500/10 transition-all text-sm font-semibold text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-violet-500 focus:ring-offset-0 cursor-pointer accent-violet-600"
                      />
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                        Remember me
                      </span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white font-bold rounded-xl shadow-sm transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100 dark:border-gray-800" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-white dark:bg-gray-900">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Button */}
                <button
                  onClick={() => {
                    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
                    window.location.href = `${backendUrl}/api/auth/google`;
                  }}
                  type="button"
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-150 active:scale-[0.98] cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Create account */}
                <p className="mt-5 text-center text-xs font-semibold text-gray-400 dark:text-gray-500">
                  New to ThesPro?{' '}
                  <Link href="/register" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors font-bold">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>

            {/* Right card - Demo */}
            <div className="w-[300px] xl:w-[320px] bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
              {demoSection}
            </div>
          </div>
        </div>
      </div>

      {/* Tablet / Mobile */}
      <div className="lg:hidden min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <ThemeToggle />
        </div>

        <div className="px-4 pb-8">
          <div className="max-w-md mx-auto space-y-5">
            {/* Login card (mobile) */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
              <div className="p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-9 h-9 bg-violet-600 dark:bg-violet-500 rounded-xl flex items-center justify-center shadow-sm">
                    <BookOpen className="w-[18px] h-[18px] text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
                      Thes<span className="text-violet-600 dark:text-violet-400">Pro</span>
                    </span>
                    <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 tracking-wider uppercase leading-tight">
                      Thesis &amp; Project Management
                    </p>
                  </div>
                </div>

                <h1 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1">Welcome back</h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">Sign in to your account</p>

                <form onSubmit={handleLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5" htmlFor="mob-email">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                      <input
                        id="mob-email"
                        type="email"
                        placeholder="your.email@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/60 dark:bg-gray-950/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none hover:border-gray-300 dark:hover:border-gray-600 focus:bg-white dark:focus:bg-gray-900 focus:border-violet-500 focus:ring-3 focus:ring-violet-500/10 transition-all text-sm font-semibold text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5" htmlFor="mob-password">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                      <input
                        id="mob-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a secure password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50/60 dark:bg-gray-950/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none hover:border-gray-300 dark:hover:border-gray-600 focus:bg-white dark:focus:bg-gray-900 focus:border-violet-500 focus:ring-3 focus:ring-violet-500/10 transition-all text-sm font-semibold text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-violet-500 focus:ring-offset-0 cursor-pointer accent-violet-600"
                      />
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                        Remember me
                      </span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white font-bold rounded-xl shadow-sm transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100 dark:border-gray-800" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-white dark:bg-gray-900">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
                    window.location.href = `${backendUrl}/api/auth/google`;
                  }}
                  type="button"
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-150 active:scale-[0.98] cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <p className="mt-4 text-center text-xs font-semibold text-gray-400 dark:text-gray-500">
                  New to ThesPro?{' '}
                  <Link href="/register" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors font-bold">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>

            {/* Mobile demo card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
              {demoSection}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
