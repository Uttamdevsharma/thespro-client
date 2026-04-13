'use client';

import React, { useState } from 'react';
import { 
    useGetAdminStudentsQuery,
    useGetAdminDepartmentsQuery
} from '@/store/features/apiSlice';
import TableSkeleton from '@/components/TableSkeleton';

const StudentManagement = () => {
    const [selectedDept, setSelectedDept] = useState('');
    const { data: departments } = useGetAdminDepartmentsQuery();
    const { data: students, isLoading } = useGetAdminStudentsQuery(selectedDept);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Student Management</h1>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center space-x-4 mb-6">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Filter by Department:</span>
                    <select 
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900"
                        value={selectedDept}
                        onChange={e => setSelectedDept(e.target.value)}
                    >
                        <option value="">All Departments</option>
                        {departments?.map((d: any) => (
                            <option key={d._id} value={d._id}>{d.name}</option>
                        ))}
                    </select>
                </div>

                {isLoading ? <TableSkeleton rows={8} cols={4} /> : (
                    <div className="overflow-x-auto">
                         <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-950 uppercase text-xs font-semibold text-gray-500 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Student ID</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4 text-center">CGPA</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {students?.map((s: any) => (
                                    <tr key={s._id} className="hover:bg-gray-50 dark:bg-gray-950 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-200">{s.name}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-mono text-sm">{s.studentId}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                {s.department?.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-gray-800 dark:text-gray-100">
                                            {s.currentCGPA?.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                {students?.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400 italic">
                                            No students found for this department.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentManagement;
