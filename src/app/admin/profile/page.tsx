'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useUpdatePasswordMutation } from '@/store/features/apiSlice';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        try {
            await updatePassword({
                oldPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }).unwrap();
            
            toast.success('Password updated successfully');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err: any) {
            toast.error(err.data?.message || 'Failed to update password');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Account Settings</h1>
                <p className="text-gray-500 mt-1 text-lg">Manage your profile and security preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Information Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#50C878] to-[#45b66d] flex items-center justify-center text-white font-bold text-4xl mb-6 shadow-lg border-4 border-white">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                        <p className="text-[#50C878] font-bold text-sm tracking-widest uppercase mt-1">{user?.role}</p>
                        
                        <div className="w-full mt-8 space-y-4 text-left">
                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</label>
                                <p className="text-sm font-semibold text-gray-700">{user?.email}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Department</label>
                                <p className="text-sm font-semibold text-gray-700">{user?.department?.name || 'Central Administration'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Update Card */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-full">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-[#50C878]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Security & Password</h2>
                        </div>

                        <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-xl">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">Current Password</label>
                                <input 
                                    type="password"
                                    required
                                    className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-[#50C878] text-gray-800 bg-white transition-all outline-none"
                                    value={passwordData.currentPassword}
                                    onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2">New Password</label>
                                    <input 
                                        type="password"
                                        required
                                        className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-[#50C878] text-gray-800 bg-white transition-all outline-none"
                                        value={passwordData.newPassword}
                                        onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2">Confirm New Password</label>
                                    <input 
                                        type="password"
                                        required
                                        className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-[#50C878] text-gray-800 bg-white transition-all outline-none"
                                        value={passwordData.confirmPassword}
                                        onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-[#50C878] to-[#45b66d] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] focus:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                                >
                                    {isLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
