'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterUserMutation } from '@/store/features/apiSlice';
import toast from 'react-hot-toast';
import Link from 'next/link';
import GoogleButton from '@/components/GoogleButton';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser({
        name,
        email,
        password,
      }).unwrap();
      toast.success('Registration successful!');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <div className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl p-10 border border-gray-100 dark:border-gray-800">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-900 dark:text-gray-50 mb-2">Create Account</h2>
            <p className="text-gray-400 font-bold">Start your thesis journey today.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 text-xs font-black uppercase tracking-widest mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-950 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-gray-900 dark:bg-gray-900 focus:border-[#0ea5b7] transition-all outline-none font-bold text-gray-900 dark:text-gray-50"
                required
              />
            </div>

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
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-950 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-gray-900 dark:bg-gray-900 focus:border-[#0ea5b7] transition-all outline-none font-bold text-gray-900 dark:text-gray-50"
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
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-950 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-gray-900 dark:bg-gray-900 focus:border-[#0ea5b7] transition-all outline-none font-bold text-gray-900 dark:text-gray-50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-[#0ea5b7] text-white font-black rounded-2xl shadow-xl shadow-cyan-100 hover:bg-[#00838f] transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Sign Up'}
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
              Already have an account?{' '}
              <Link href="/login" className="text-[#0ea5b7] hover:underline">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
