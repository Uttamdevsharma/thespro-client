'use client';

import React, { useState } from 'react';
import { 
    useGetAdminDepartmentsQuery, 
    useCreateDepartmentMutation, 
    useUpdateDepartmentMutation, 
    useDeleteDepartmentMutation 
} from '@/store/features/apiSlice';
import toast from 'react-hot-toast';
import TableSkeleton from '@/components/TableSkeleton';

const DepartmentPage = () => {
    const { data: departments, isLoading } = useGetAdminDepartmentsQuery();
    const [createDepartment] = useCreateDepartmentMutation();
    const [updateDepartment] = useUpdateDepartmentMutation();
    const [deleteDepartment] = useDeleteDepartmentMutation();

    const [newDeptName, setNewDeptName] = useState('');
    const [newDeptAbbr, setNewDeptAbbr] = useState('');
    const [editingDept, setEditingDept] = useState<any>(null);
    const [editName, setEditName] = useState('');
    const [editAbbr, setEditAbbr] = useState('');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createDepartment({ name: newDeptName, abbreviation: newDeptAbbr || undefined }).unwrap();
            toast.success('Department created');
            setNewDeptName('');
            setNewDeptAbbr('');
        } catch (err: any) {
            toast.error(err.data?.message || 'Failed to create');
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateDepartment({ id: editingDept._id, name: editName, abbreviation: editAbbr || undefined }).unwrap();
            toast.success('Department updated');
            setEditingDept(null);
        } catch (err: any) {
            toast.error(err.data?.message || 'Failed to update');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure? This cannot be undone if users are assigned.')) {
            try {
                await deleteDepartment(id).unwrap();
                toast.success('Department deleted');
            } catch (err: any) {
                toast.error(err.data?.message || 'Failed to delete');
            }
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Department Management</h1>

            {/* Create Section */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Add New Department</h2>
                <form onSubmit={handleCreate} className="flex gap-4">
                    <input 
                        type="text" 
                        value={newDeptName}
                        onChange={(e) => setNewDeptName(e.target.value)}
                        placeholder="Department Name (e.g., Computer Science)"
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900"
                        required
                    />
                    <input 
                        type="text" 
                        value={newDeptAbbr}
                        onChange={(e) => setNewDeptAbbr(e.target.value)}
                        placeholder="Abbreviation (e.g., CSE)"
                        className="w-40 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900"
                    />
                    <button type="submit" className="bg-[#50C878] text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors">
                        Add Department
                    </button>
                </form>
            </div>

            {/* List Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">All Departments</h2>
                </div>
                {isLoading ? (
                    <div className="p-6"><TableSkeleton rows={5} cols={2} /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-950 uppercase text-xs font-semibold text-gray-500 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-4">Department Name</th>
                                    <th className="px-6 py-4">Abbreviation</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {departments?.map((dept: any) => (
                                    <tr key={dept._id} className="hover:bg-gray-50 dark:bg-gray-950 transition-colors">
                                        <td className="px-6 py-4">
                                            {editingDept?._id === dept._id ? (
                                                <input 
                                                    type="text" 
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="w-full px-2 py-1 border rounded"
                                                />
                                            ) : (
                                                <span className="font-medium text-gray-700 dark:text-gray-200">{dept.name}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingDept?._id === dept._id ? (
                                                <input 
                                                    type="text" 
                                                    value={editAbbr}
                                                    onChange={(e) => setEditAbbr(e.target.value)}
                                                    className="w-24 px-2 py-1 border rounded"
                                                />
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400 text-sm font-mono">{dept.abbreviation || '—'}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            {editingDept?._id === dept._id ? (
                                                <>
                                                    <button onClick={handleUpdate} className="text-green-600 font-medium text-sm">Save</button>
                                                    <button onClick={() => setEditingDept(null)} className="text-red-600 font-medium text-sm">Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => { setEditingDept(dept); setEditName(dept.name); setEditAbbr(dept.abbreviation || ''); }} className="text-blue-600 font-medium text-sm">Edit</button>
                                                    <button onClick={() => handleDelete(dept._id)} className="text-red-600 font-medium text-sm">Delete</button>
                                                </>
                                            )}
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

export default DepartmentPage;
