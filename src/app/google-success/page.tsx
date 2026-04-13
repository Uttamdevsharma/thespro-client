'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { login } from '@/store/features/userSlice';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';

const GoogleSuccessHandler = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const encodedData = searchParams.get('data');

    useEffect(() => {
        if (encodedData) {
            try {
                // Decode base64 data
                const decodedString = atob(encodedData);
                const userData = JSON.parse(decodedString);

                if (userData && userData.token) {
                    // 1. Immediately update localStorage
                    localStorage.setItem('userInfo', JSON.stringify(userData));
                    
                    // 2. Immediately update Redux state
                    dispatch(login(userData));
                    
                    toast.success(`Welcome back, ${userData.name}!`);

                    // 3. Navigate to appropriate dashboard based on role
                    const userRole = userData.role ? userData.role.toLowerCase() : '';
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
                } else {
                    throw new Error('Invalid user data received');
                }
            } catch (err) {
                console.error('Failed to decode Google auth data:', err);
                toast.error('Authentication failed. Please try again.');
                router.push('/login');
            }
        } else {
            router.push('/login');
        }
    }, [encodedData, dispatch, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
            <div className="text-center">
                <Loader />
                <p className="mt-4 text-gray-500 dark:text-gray-400 font-bold animate-pulse">Syncing your profile...</p>
            </div>
        </div>
    );
};

const GoogleSuccessPage = () => {
    return (
        <Suspense fallback={<Loader />}>
            <GoogleSuccessHandler />
        </Suspense>
    );
};

export default GoogleSuccessPage;
