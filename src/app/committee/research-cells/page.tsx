'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';
import { PlusCircle, Layers, Users } from 'lucide-react';
import { useGetResearchCellsQuery, useGetTeachersQuery, useAddResearchCellMutation } from '@/store/features/apiSlice';

const CommitteeResearchCellsPage = () => {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const user = useSelector((state: RootState) => state.user.user);

  const { data: rawCells, isLoading: cellsLoading, refetch: refetchCells } = useGetResearchCellsQuery(undefined, {
    skip: !user
  });
  const { data: supervisors, isLoading: supervisorsLoading } = useGetTeachersQuery(undefined, {
    skip: !user
  });
  const [addResearchCell, { isLoading: addingCell }] = useAddResearchCellMutation();

  const cells = React.useMemo(() => {
    if (!rawCells) return [];
    return rawCells.map((cell: any) => ({
      id: cell._id,
      ...cell,
    }));
  }, [rawCells]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('User not authenticated.');
      return;
    }
    try {
      await addResearchCell(formData).unwrap();
      refetchCells();
      setFormData({ title: '', description: '' });
      toast.success('Research Cell Added.');
    } catch (error: any) {
      console.error("Error adding research cell: ", error);
      toast.error(`Failed to add research cell: ${error.data?.message || error.message}`);
    }
  };

  if (cellsLoading || supervisorsLoading) return <Loader />;

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 mb-8 flex items-center">
            <Layers className="mr-3 text-green-600" size={32} />
            Research Cell Management
        </h1>

        {/* Add New Cell Form */}
        <div className="mb-10 p-8 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg bg-white dark:bg-gray-900">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                <PlusCircle className="mr-2 text-green-500" size={20} />
                Create New Research Cell
            </h2>
            <form onSubmit={handleAddCell} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Cell Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="e.g., Artificial Intelligence"
                        value={formData.title}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-700 dark:text-gray-200 font-medium dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 dark:placeholder-gray-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Description</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Brief overview of the research area"
                        value={formData.description}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-700 dark:text-gray-200 font-medium dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 dark:placeholder-gray-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all transform hover:scale-[1.01] active:scale-100 flex justify-center items-center"
                >
                    <PlusCircle className="mr-2" size={20} /> Add Cell
                </button>
            </form>
        </div>

        {/* Cells List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cells.map((cell) => {
            const assignedSupervisors = supervisors.filter(supervisor => 
                supervisor.researchCells && supervisor.researchCells.some((c: any) => (c._id || c) === cell.id)
            );

            return (
                <div key={cell.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all">
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 border-b-2 border-green-500 pb-1 inline-block">{cell.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">{cell.description}</p>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-800/50">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                            <Users size={14} className="mr-1" /> Assigned Supervisors ({assignedSupervisors.length})
                        </h4>
                        {assignedSupervisors.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {assignedSupervisors.map(supervisor => (
                                    <span key={supervisor._id} className="inline-block bg-green-50 text-green-700 rounded-full px-3 py-1 text-xs font-bold border border-green-100">
                                        {supervisor.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic">No supervisors assigned yet.</p>
                        )}
                    </div>
                </div>
            );
            })}
        </div>
      </div>
    </div>
  );
};

export default CommitteeResearchCellsPage;
