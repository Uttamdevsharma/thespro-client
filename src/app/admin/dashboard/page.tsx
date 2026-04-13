'use client';

import React from 'react';
import { useGetAdminStatsQuery } from '@/store/features/apiSlice';
import DashboardSkeleton from '@/components/DashboardSkeleton';

const AdminDashboard = () => {
    const { data: stats, isLoading } = useGetAdminStatsQuery();

    if (isLoading) return <DashboardSkeleton />;

    const statCards = [
        { label: 'Departments', value: stats?.deptCount || 0, color: 'bg-blue-100 text-blue-600', icon: '🏢' },
        { label: 'Teachers', value: stats?.teacherCount || 0, color: 'bg-green-100 text-green-600', icon: '👨‍🏫' },
        { label: 'Students', value: stats?.studentCount || 0, color: 'bg-purple-100 text-purple-600', icon: '🎓' },
        { label: 'Committee Assignments', value: stats?.committeeCount || 0, color: 'bg-yellow-100 text-yellow-600', icon: '📝' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Admin Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center space-x-4">
                        <div className={`p-4 rounded-xl ${stat.color} text-2xl`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Welcome, Administrator</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Use the sidebar to manage departments, supervisors (teachers), students, and committee assignments. 
                    Your role is to ensure the system architecture remains balanced and optimized for academic workflows.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;
