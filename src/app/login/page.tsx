'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@/store/features/userSlice';
import { useLoginUserMutation } from '@/store/features/apiSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import GoogleButton from '@/components/GoogleButton';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginUserMutation();

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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <div className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl p-10 border border-gray-100 dark:border-gray-800">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-900 dark:text-gray-50 mb-2">Welcome Back</h2>
            <p className="text-gray-400 font-bold">Manage your thesis journey efficiently.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 text-xs font-black uppercase tracking-widest mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-950 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-gray-900 dark:bg-gray-900 focus:border-indigo-500 transition-all outline-none font-bold text-gray-900 dark:text-gray-50"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-200 text-xs font-black uppercase tracking-widest mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-950 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-gray-900 dark:bg-gray-900 focus:border-indigo-500 transition-all outline-none font-bold text-gray-900 dark:text-gray-50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-8">
              <div className="flex-grow h-px bg-gray-100"></div>
              <span className="px-4 text-[10px] font-black text-gray-300 uppercase tracking-widest bg-white dark:bg-gray-900">Or continue with</span>
              <div className="flex-grow h-px bg-gray-100"></div>
            </div>
            
            <GoogleButton />
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm font-bold text-gray-400">
              New to ThesPro?{' '}
              <Link href="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
