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
import { UserPlus, Trash2, Edit3, Users, X } from 'lucide-react';

const TeacherManagement = () => {
    const [selectedDept, setSelectedDept] = useState('');
    const { data: departments } = useGetAdminDepartmentsQuery();
    const { data: teachers, isLoading } = useGetAdminTeachersQuery(selectedDept);
    
    const [createTeacher] = useCreateAdminTeacherMutation();
    const [updateTeacher] = useUpdateAdminTeacherMutation();
    const [deleteTeacher] = useDeleteAdminTeacherMutation();

    const [showAddForm, setShowAddForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newTeacher, setNewTeacher] = useState({ name: '', email: '', password: '', departmentId: '', designation: '' });
    const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && editingTeacherId) {
                await updateTeacher({ id: editingTeacherId, ...newTeacher }).unwrap();
                toast.success('Teacher updated successfully');
            } else {
                await createTeacher(newTeacher).unwrap();
                toast.success('Teacher created successfully');
            }
            resetForm();
        } catch (err: any) {
            toast.error(err.data?.message || `Failed to ${isEditing ? 'update' : 'create'} teacher`);
        }
    };

    const handleEdit = (teacher: any) => {
        setIsEditing(true);
        setEditingTeacherId(teacher._id);
        setNewTeacher({
            name: teacher.name,
            email: teacher.email,
            password: '', // Password optional on edit
            departmentId: teacher.department?._id || '',
            designation: teacher.designation || '',
        });
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setNewTeacher({ name: '', email: '', password: '', departmentId: '', designation: '' });
        setIsEditing(false);
        setEditingTeacherId(null);
        setShowAddForm(false);
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
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-gray-50 tracking-tight">Teacher Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Manage supervisors and academic faculty</p>
                </div>
                <button 
                    onClick={() => {
                        if (showAddForm) resetForm();
                        else setShowAddForm(true);
                    }}
                    className={`px-6 py-3 rounded-2xl font-black transition-all shadow-lg flex items-center gap-2 ${showAddForm ? 'bg-gray-100 text-gray-600 dark:text-gray-300' : 'bg-[#50C878] text-white hover:bg-green-600 shadow-green-100'}`}
                >
                    {showAddForm ? (
                        <>
                            <X size={20} />
                            Cancel
                        </>
                    ) : (
                        <>
                            <UserPlus size={20} />
                            Add New Teacher
                        </>
                    )}
                </button>
            </div>

            {showAddForm && (
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 max-w-3xl border-t-4 border-t-[#50C878] animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-50">{isEditing ? 'Edit Teacher Details' : 'Register New Teacher'}</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Please fill in the information below</p>
                    </div>
                    <form onSubmit={handleCreate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">Full Name</label>
                                <input 
                                    type="text" 
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-950 border-none rounded-2xl focus:ring-4 focus:ring-green-100 text-gray-800 dark:text-gray-100 font-bold transition-all placeholder:text-gray-400 placeholder:font-medium"
                                    placeholder="e.g. Dr. John Doe"
                                    value={newTeacher.name}
                                    onChange={e => setNewTeacher({...newTeacher, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">Email Address</label>
                                <input 
                                    type="email" 
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-950 border-none rounded-2xl focus:ring-4 focus:ring-green-100 text-gray-800 dark:text-gray-100 font-bold transition-all placeholder:text-gray-400 placeholder:font-medium"
                                    placeholder="john@department.edu"
                                    value={newTeacher.email}
                                    onChange={e => setNewTeacher({...newTeacher, email: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">
                                    {isEditing ? 'Password (Leave blank to keep same)' : 'Account Password'}
                                </label>
                                <input 
                                    type="password" 
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-950 border-none rounded-2xl focus:ring-4 focus:ring-green-100 text-gray-800 dark:text-gray-100 font-bold transition-all"
                                    value={newTeacher.password}
                                    onChange={e => setNewTeacher({...newTeacher, password: e.target.value})}
                                    required={!isEditing}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">Department</label>
                                <select 
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-950 border-none rounded-2xl focus:ring-4 focus:ring-green-100 text-gray-800 dark:text-gray-100 font-bold transition-all appearance-none"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">Faculty Designation</label>
                                <select 
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-950 border-none rounded-2xl focus:ring-4 focus:ring-green-100 text-gray-800 dark:text-gray-100 font-bold transition-all appearance-none"
                                    value={newTeacher.designation}
                                    onChange={e => setNewTeacher({...newTeacher, designation: e.target.value})}
                                    required
                                >
                                    <option value="">Select Designation</option>
                                    <option value="Professor">Professor</option>
                                    <option value="Associate Professor">Associate Professor</option>
                                    <option value="Assistant Professor">Assistant Professor</option>
                                    <option value="Lecturer">Lecturer</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-[#50C878] text-white py-5 rounded-[1.25rem] font-black text-lg shadow-xl shadow-green-100 hover:bg-green-600 hover:-translate-y-1 transition-all active:scale-95 mt-4">
                            {isEditing ? 'Update Faculty Member' : 'Create Supervisor Account'}
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                            <Users className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-800 dark:text-gray-100">Faculty List</h3>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{teachers?.length || 0} Members Registered</p>
                        </div>
                    </div>
                    <div className="flex items-center bg-gray-50 dark:bg-gray-950 px-5 py-2 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <span className="text-gray-400 font-bold text-sm mr-3">Filter:</span>
                        <select 
                            className="bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-200 font-black text-sm pr-8 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                            value={selectedDept}
                            onChange={e => setSelectedDept(e.target.value)}
                        >
                            <option value="">All Departments</option>
                            {departments?.map((d: any) => (
                                <option key={d._id} value={d._id}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {isLoading ? <TableSkeleton rows={5} cols={5} /> : (
                    <div className="overflow-x-auto">
                         <table className="w-full text-left border-separate border-spacing-y-3">
                            <thead className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-4">
                                <tr>
                                    <th className="px-6 py-4">Full Name</th>
                                    <th className="px-6 py-4">Designation</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4 px-10">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers?.map((t: any) => (
                                    <tr key={t._id} className="group hover:scale-[1.01] transition-all duration-300 shadow-sm hover:shadow-xl rounded-2xl">
                                        <td className="px-6 py-5 bg-white dark:bg-gray-900 rounded-l-2xl border-y border-l border-gray-50 dark:border-gray-800/50 font-black text-gray-700 dark:text-gray-200">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-[#50C878] font-black uppercase">
                                                    {t.name.charAt(0)}
                                                </div>
                                                <span>{t.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 bg-white dark:bg-gray-900 border-y border-gray-50 dark:border-gray-800/50 text-gray-500 dark:text-gray-400 font-bold italic">
                                            {t.designation || 'Not Set'}
                                        </td>
                                        <td className="px-6 py-5 bg-white dark:bg-gray-900 border-y border-gray-50 dark:border-gray-800/50 text-gray-500 dark:text-gray-400 font-medium">
                                            {t.email}
                                        </td>
                                        <td className="px-6 py-5 bg-white dark:bg-gray-900 border-y border-gray-50 dark:border-gray-800/50">
                                            <span className="bg-[#50C878]/10 text-[#50C878] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                {t.department?.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 bg-white dark:bg-gray-900 rounded-r-2xl border-y border-r border-gray-50 dark:border-gray-800/50 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button 
                                                    onClick={() => handleEdit(t)}
                                                    className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    title="Edit Member"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(t._id)}
                                                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {teachers?.length === 0 && (
                            <div className="py-20 text-center bg-gray-50 dark:bg-gray-950 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-800 mt-4">
                                <Users size={48} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-gray-400 font-bold">No faculty members found in this category</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherManagement;
