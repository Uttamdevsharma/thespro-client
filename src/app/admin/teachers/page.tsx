'use client';

import React, { useState } from 'react';
import { 
    useGetAdminTeachersQuery, 
    useCreateAdminTeacherMutation, 
    useUpdateAdminTeacherMutation, 
    useDeleteAdminTeacherMutation,
    useGetAdminDepartmentsQuery
} from '@/store/features/apiSlice';
import toast from 'react-hot-toast';
import TableSkeleton from '@/components/TableSkeleton';

const TeacherManagement = () => {
    const [selectedDept, setSelectedDept] = useState('');
    const { data: departments } = useGetAdminDepartmentsQuery();
    const { data: teachers, isLoading } = useGetAdminTeachersQuery(selectedDept);
    
    const [createTeacher] = useCreateAdminTeacherMutation();
    const [updateTeacher] = useUpdateAdminTeacherMutation();
    const [deleteTeacher] = useDeleteAdminTeacherMutation();

    const [showAddForm, setShowAddForm] = useState(false);
    const [newTeacher, setNewTeacher] = useState({ name: '', email: '', password: '', departmentId: '' });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTeacher(newTeacher).unwrap();
            toast.success('Teacher created successfully');
            setNewTeacher({ name: '', email: '', password: '', departmentId: '' });
            setShowAddForm(false);
        } catch (err: any) {
            toast.error(err.data?.message || 'Failed to create teacher');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Remove this teacher?')) {
            try {
                await deleteTeacher(id).unwrap();
                toast.success('Teacher removed');
            } catch (err: any) {
                toast.error(err.data?.message || 'Failed to remove');
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Teacher Management</h1>
                <button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-[#50C878] text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-all shadow-md"
                >
                    {showAddForm ? 'Cancel' : 'Add New Teacher'}
                </button>
            </div>

            {showAddForm && (
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">New Teacher Details</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-gray-800 bg-white"
                                    value={newTeacher.name}
                                    onChange={e => setNewTeacher({...newTeacher, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-gray-800 bg-white"
                                    value={newTeacher.email}
                                    onChange={e => setNewTeacher({...newTeacher, email: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Password</label>
                                <input 
                                    type="password" 
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-gray-800 bg-white"
                                    value={newTeacher.password}
                                    onChange={e => setNewTeacher({...newTeacher, password: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Department</label>
                                <select 
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-gray-800 bg-white"
                                    value={newTeacher.departmentId}
                                    onChange={e => setNewTeacher({...newTeacher, departmentId: e.target.value})}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments?.map((d: any) => (
                                        <option key={d._id} value={d._id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-[#50C878] text-white py-3 rounded-xl font-bold mt-4 shadow-lg hover:bg-green-600 transition-all">
                            Create Supervisor Account
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4 mb-6">
                    <span className="text-gray-600 font-medium">Filter by Department:</span>
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
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {teachers?.map((t: any) => (
                                    <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-700">{t.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{t.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                {t.department?.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleDelete(t._id)}
                                                className="text-red-600 hover:text-red-800 font-medium text-sm"
                                            >
                                                Delete
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

export default TeacherManagement;
