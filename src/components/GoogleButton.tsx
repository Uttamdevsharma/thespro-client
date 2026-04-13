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
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:bg-gray-950 transition-all duration-200 mt-4 shadow-sm active:scale-[0.98]"
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
