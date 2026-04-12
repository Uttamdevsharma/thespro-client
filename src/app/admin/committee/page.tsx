'use client';

import React, { useState } from 'react';
import { 
    useGetAdminCommitteeQuery,
    useGetAdminTeachersQuery,
    useGetAdminDepartmentsQuery,
    useAssignAdminCommitteeMutation,
    useRemoveAdminCommitteeMutation
} from '@/store/features/apiSlice';
import toast from 'react-hot-toast';
import TableSkeleton from '@/components/TableSkeleton';

const CommitteeAssignment = () => {
    const [selectedDept, setSelectedDept] = useState('');
    const { data: departments } = useGetAdminDepartmentsQuery();
    const { data: assignments, isLoading } = useGetAdminCommitteeQuery(selectedDept);
    const { data: availableTeachers } = useGetAdminTeachersQuery();
    
    const [assignAdminCommittee] = useAssignAdminCommitteeMutation();
    const [removeCommittee] = useRemoveAdminCommitteeMutation();

    const [newAssignment, setNewAssignment] = useState({ userId: '', departmentId: '' });

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newAssignment.userId || !newAssignment.departmentId) {
            toast.error('Please select both a teacher and a department');
            return;
        }

        try {
            await assignAdminCommittee(newAssignment).unwrap();
            toast.success('Teacher assigned to committee');
            setNewAssignment({ userId: '', departmentId: '' });
        } catch (err: any) {
            console.error('Assignment error:', err);
            const errMsg = err.data?.message || err.message || 'Assignment failed';
            toast.error(errMsg);
        }
    };

    const handleRemove = async (id: string) => {
        if (window.confirm('Revoke committee status?')) {
            try {
                await removeCommittee(id).unwrap();
                toast.success('Assignment removed');
            } catch (err: any) {
                toast.error(err.data?.message || 'Failed to remove');
            }
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Department Committee Assignment</h1>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Assign New Committee Member</h2>
                <form onSubmit={handleAssign} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Select Teacher</label>
                        <select 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-gray-800 bg-white"
                            value={newAssignment.userId}
                            onChange={e => setNewAssignment({...newAssignment, userId: e.target.value})}
                            required
                        >
                            <option value="">Select Teacher</option>
                            {availableTeachers?.map((t: any) => (
                                <option key={t._id} value={t._id}>{t.name} ({t.department?.name})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Select Department</label>
                        <select 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-gray-800 bg-white"
                            value={newAssignment.departmentId}
                            onChange={e => setNewAssignment({...newAssignment, departmentId: e.target.value})}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments?.map((d: any) => (
                                <option key={d._id} value={d._id}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="md:col-span-2 bg-[#50C878] text-white py-3 rounded-xl font-bold mt-2 shadow-lg hover:bg-green-600 transition-all">
                        Assign Member
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4 mb-6">
                    <span className="text-gray-600 font-medium">View Assignments for:</span>
                    <select 
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-gray-800 bg-white"
                        value={selectedDept}
                        onChange={e => setSelectedDept(e.target.value)}
                    >
                        <option value="">All Departments</option>
                        {departments?.map((d: any) => (
                            <option key={d._id} value={d._id}>{d.name}</option>
                        ))}
                    </select>
                </div>

                {isLoading ? <TableSkeleton rows={5} cols={3} /> : (
                    <div className="overflow-x-auto">
                         <table className="w-full text-left">
                            <thead className="bg-gray-50 uppercase text-xs font-semibold text-gray-500">
                                <tr>
                                    <th className="px-6 py-4">Committee Member</th>
                                    <th className="px-6 py-4">Assigned Department</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {assignments?.map((a: any) => (
                                    <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800">{a.userId?.name}</span>
                                                <span className="text-xs text-gray-500">{a.userId?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-yellow-200">
                                                {a.departmentId?.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleRemove(a._id)}
                                                className="text-red-600 hover:text-red-800 font-medium text-sm"
                                            >
                                                Revoke
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommitteeAssignment;
