'use client';

import React from 'react';

const GoogleButton = () => {
    const handleGoogleLogin = () => {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
        window.location.href = `${backendUrl}/api/auth/google`;
    };

    return (
        <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-4 px-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 mt-4 shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer"
        >
            <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                className="w-5 h-5"
            />
            <span>Continue with Google</span>
        </button>
    );
};

export default GoogleButton;
