'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetPublicDepartmentsQuery, useUpdateProfileMutation } from '@/store/features/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectUser } from '@/store/features/userSlice';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';
import { BookOpen, Hash, TrendingUp, ShieldCheck } from 'lucide-react';

const CompleteProfilePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { data: departments, isLoading: deptsLoading } = useGetPublicDepartmentsQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    departmentId: '',
    studentId: '',
    currentCGPA: '',
  });

  // If user already has these fields, redirect them to dashboard
  useEffect(() => {
    if (user && user.department && user.studentId && user.currentCGPA) {
        router.push('/student/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.departmentId) return toast.error('Please select a department');
    
    try {
      const updatedUser = await updateProfile(formData).unwrap();
      
      // Update local storage and redux
      const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const newUserInfo = { ...storedUserInfo, ...updatedUser };
      localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
      dispatch(login(newUserInfo));
      
      toast.success('Profile completed successfully!');
      router.push('/student/dashboard');
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to update profile');
    }
  };

  if (deptsLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl p-12 border border-gray-100 dark:border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-50 rounded-full -mr-32 -mt-32 -z-0" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-[#0ea5b7] text-white rounded-3xl flex items-center justify-center shadow-lg shadow-cyan-100">
               <ShieldCheck size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-gray-50 tracking-tight">One Last Step</h1>
              <p className="text-gray-400 font-bold">Complete your profile to access the portal.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Department Dropdown */}
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 text-xs font-black uppercase tracking-widest mb-3">
                  <BookOpen size={14} className="text-[#0ea5b7]" />
                  <span>Academic Department</span>
                </label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="w-full px-6 py-5 bg-gray-50 dark:bg-gray-950 border-2 border-transparent rounded-[1.5rem] focus:bg-white dark:focus:bg-gray-900 dark:bg-gray-900 focus:border-[#0ea5b7] transition-all outline-none font-bold text-gray-900 dark:text-gray-50 appearance-none shadow-sm"
                  required
                >
                  <option value="">Select your department</option>
                  {departments?.map((dept: any) => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              {/* Student ID */}
              <div>
                <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 text-xs font-black uppercase tracking-widest mb-3">
                  <Hash size={14} className="text-[#0ea5b7]" />
                  <span>Student ID</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 21-44789-1"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-6 py-5 bg-gray-50 dark:bg-gray-950 border-2 border-transparent rounded-[1.5rem] focus:bg-white dark:focus:bg-gray-900 dark:bg-gray-900 focus:border-[#0ea5b7] transition-all outline-none font-bold text-gray-900 dark:text-gray-50 shadow-sm"
                  required
                />
              </div>

              {/* CGPA */}
              <div>
                <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 text-xs font-black uppercase tracking-widest mb-3">
                  <TrendingUp size={14} className="text-[#0ea5b7]" />
                  <span>Current CGPA</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  max="4"
                  min="0"
                  placeholder="e.g. 3.75"
                  value={formData.currentCGPA}
                  onChange={(e) => setFormData({ ...formData, currentCGPA: e.target.value })}
                  className="w-full px-6 py-5 bg-gray-50 dark:bg-gray-950 border-2 border-transparent rounded-[1.5rem] focus:bg-white dark:focus:bg-gray-900 dark:bg-gray-900 focus:border-[#0ea5b7] transition-all outline-none font-bold text-gray-900 dark:text-gray-50 shadow-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full py-6 bg-[#1a2b3c] text-white font-black rounded-3xl shadow-2xl hover:bg-[#0ea5b7] transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
            >
              {updating ? 'Saving Profile...' : 'Complete & Enter Portal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
