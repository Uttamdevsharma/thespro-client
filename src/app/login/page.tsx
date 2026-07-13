'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@/store/features/userSlice';
import { useLoginUserMutation } from '@/store/features/apiSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import GoogleButton from '@/components/GoogleButton';
import { Eye, EyeOff, Loader2, Shield, ClipboardList, GraduationCap, User, Zap } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const demoAccounts = [
    { role: 'Admin', email: 'admin@gmail.com', password: 'admin1234', icon: Shield, color: 'from-red-500 to-rose-600', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800/50', text: 'text-red-600 dark:text-red-400' },
    { role: 'Committee', email: 'fatema@cse.green.edu.bd', password: 'committee', icon: ClipboardList, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800/50', text: 'text-amber-600 dark:text-amber-400' },
    { role: 'Supervisor', email: 'tanpia@cse.green.edu.bd', password: 'supervisor', icon: GraduationCap, color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800/50', text: 'text-emerald-600 dark:text-emerald-400' },
    { role: 'Student', email: '221902234@student.green.edu.bd', password: 'uttam1234', icon: User, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800/50', text: 'text-blue-600 dark:text-blue-400' },
  ];

  const handleDemoFill = (demo: typeof demoAccounts[0]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    toast.success(`✱ ${demo.role} credentials filled! Click "Sign In" to continue.`, { duration: 2000 });
  };

  const handleDemoLogin = async (demo: typeof demoAccounts[0]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    await new Promise(r => setTimeout(r, 50));
    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
    await handleLogin(syntheticEvent);
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
      toast.error(error.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      <div className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-10 border border-gray-100/80 dark:border-gray-800/80">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-900 dark:text-gray-50 mb-2">Welcome Back</h2>
            <p className="text-gray-400 font-bold">Manage your thesis journey efficiently.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 text-xs font-black uppercase tracking-widest mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50/80 dark:bg-gray-950/80 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-200 text-xs font-black uppercase tracking-widest mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 pr-12 bg-gray-50/80 dark:bg-gray-950/80 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer accent-indigo-600"
                />
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200/50 dark:shadow-indigo-900/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 hover:shadow-2xl hover:shadow-indigo-200/60 dark:hover:shadow-indigo-900/40 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Accounts Section */}
          <div className="mt-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white/80 dark:bg-gray-900/80 flex items-center gap-1.5">
                  <Zap size={12} className="text-amber-500" />
                  Try ThesPro Instantly
                </span>
              </div>
            </div>
            <p className="text-center text-xs font-bold text-gray-400 dark:text-gray-500 mb-4">
              Experience every role in seconds — no registration required.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {demoAccounts.map((demo) => {
                const Icon = demo.icon;
                return (
                  <div key={demo.role} className="group relative">
                    <button
                      type="button"
                      onClick={() => handleDemoFill(demo)}
                      className={`w-full p-3 rounded-xl border-2 ${demo.border} ${demo.bg} hover:bg-white dark:hover:bg-gray-800/80 transition-all duration-200 active:scale-[0.97] cursor-pointer`}
                      title={`Fill ${demo.role} credentials`}
                    >
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`p-2 rounded-lg ${demo.bg} group-hover:scale-110 transition-transform duration-200`}>
                          <Icon className={`w-5 h-5 ${demo.text}`} />
                        </div>
                        <span className={`text-[11px] font-black uppercase tracking-wider ${demo.text}`}>
                          {demo.role}
                        </span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoLogin(demo)}
                      disabled={isLoading}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30 hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      title={`Instant login as ${demo.role}`}
                    >
                      <Zap size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
            <p className="text-center mt-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Click any role to auto-fill credentials
            </p>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white/80 dark:bg-gray-900/80">
                  Or continue with
                </span>
              </div>
            </div>
            <GoogleButton />
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm font-bold text-gray-400">
              New to ThesPro?{' '}
              <Link href="/register" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-bold">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
