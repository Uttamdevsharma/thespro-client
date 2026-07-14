'use client';

import React, { useState } from 'react';
import {
  useGetThesisCyclesQuery,
  useCreateThesisCycleMutation,
  useUpdateThesisCycleMutation,
  useArchiveThesisCycleMutation,
  useSetActiveCohortMutation,
} from '@/store/features/apiSlice';
import toast from 'react-hot-toast';
import TableSkeleton from '@/components/TableSkeleton';

const statusBadge: Record<string, string> = {
  'Registration Open': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Registration Closed': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Running: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Completed: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  Archived: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const ThesisCyclesPage = () => {
  const { data: cycles, isLoading } = useGetThesisCyclesQuery();
  const [createCycle] = useCreateThesisCycleMutation();
  const [updateCycle] = useUpdateThesisCycleMutation();
  const [archiveCycle] = useArchiveThesisCycleMutation();
  const [setActiveCohort] = useSetActiveCohortMutation();

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const [newRegStart, setNewRegStart] = useState('');
  const [newRegEnd, setNewRegEnd] = useState('');

  const [editing, setEditing] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
  const [editRegStart, setEditRegStart] = useState('');
  const [editRegEnd, setEditRegEnd] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editProposalOpen, setEditProposalOpen] = useState(false);
  const [editDeadline, setEditDeadline] = useState('');
  const [editDefensePhase, setEditDefensePhase] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCycle({
        name: newName,
        startSemester: newStart,
        endSemester: newEnd,
        registrationStartDate: newRegStart || undefined,
        registrationEndDate: newRegEnd || undefined,
        status: 'Registration Open',
      }).unwrap();
      toast.success('Cohort created');
      setNewName('');
      setNewStart('');
      setNewEnd('');
      setNewRegStart('');
      setNewRegEnd('');
      setShowCreate(false);
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to create');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCycle({
        id: editing._id,
        name: editName,
        startSemester: editStart,
        endSemester: editEnd,
        registrationStartDate: editRegStart || undefined,
        registrationEndDate: editRegEnd || undefined,
        status: editStatus,
        proposalSubmissionOpen: editProposalOpen,
        proposalSubmissionDeadline: editDeadline || undefined,
        defensePhase: editDefensePhase || null,
      }).unwrap();
      toast.success('Cohort updated');
      setEditing(null);
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to update');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveCycle(id).unwrap();
      toast.success('Archive status toggled');
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to archive');
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await setActiveCohort(id).unwrap();
      toast.success('Cohort activated');
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to activate');
    }
  };

  const startEditing = (cycle: any) => {
    setEditing(cycle);
    setEditName(cycle.name);
    setEditStart(cycle.startSemester);
    setEditEnd(cycle.endSemester);
    setEditRegStart(cycle.registrationStartDate ? cycle.registrationStartDate.slice(0, 10) : '');
    setEditRegEnd(cycle.registrationEndDate ? cycle.registrationEndDate.slice(0, 10) : '');
    setEditStatus(cycle.status);
    setEditProposalOpen(cycle.proposalSubmissionOpen);
    setEditDeadline(cycle.proposalSubmissionDeadline ? cycle.proposalSubmissionDeadline.slice(0, 10) : '');
    setEditDefensePhase(cycle.defensePhase || '');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Thesis Cycle Management</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-[#50C878] text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
        >
          {showCreate ? 'Cancel' : 'New Cycle'}
        </button>
      </div>

      {/* Create Section */}
      {showCreate && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Create Thesis Cycle</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Cycle Name (e.g., Summer 2026)"
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900"
              required
            />
            <input
              type="text"
              value={newStart}
              onChange={(e) => setNewStart(e.target.value)}
              placeholder="Start Semester (e.g., Spring 2026)"
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900"
              required
            />
            <input
              type="text"
              value={newEnd}
              onChange={(e) => setNewEnd(e.target.value)}
              placeholder="End Semester (e.g., Fall 2026)"
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900"
              required
            />
            <input
              type="date"
              value={newRegStart}
              onChange={(e) => setNewRegStart(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900"
            />
            <input
              type="date"
              value={newRegEnd}
              onChange={(e) => setNewRegEnd(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900"
            />
            <button type="submit" className="bg-[#50C878] text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors">
              Create Cohort
            </button>
          </form>
        </div>
      )}

      {/* List Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">All Thesis Cycles</h2>
        </div>
        {isLoading ? (
          <div className="p-6"><TableSkeleton rows={5} cols={5} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-950 uppercase text-xs font-semibold text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submission</th>
                  <th className="px-6 py-4">Defense Phase</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cycles?.map((cycle: any) => (
                  <tr key={cycle._id} className={`hover:bg-gray-50 dark:bg-gray-950 transition-colors ${cycle.archived ? 'opacity-60' : ''}`}>
                    {editing?._id === cycle._id ? (
                      <>
                        <td className="px-6 py-4">
                          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-2 py-1 border rounded text-sm" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <input type="text" value={editStart} onChange={(e) => setEditStart(e.target.value)} className="w-28 px-2 py-1 border rounded text-sm" placeholder="Start" />
                            <input type="text" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} className="w-28 px-2 py-1 border rounded text-sm" placeholder="End" />
                          </div>
                          <div className="flex gap-2 mt-2">
                            <input type="date" value={editRegStart} onChange={(e) => setEditRegStart(e.target.value)} className="w-32 px-2 py-1 border rounded text-sm" title="Registration start" />
                            <input type="date" value={editRegEnd} onChange={(e) => setEditRegEnd(e.target.value)} className="w-32 px-2 py-1 border rounded text-sm" title="Registration end" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="px-2 py-1 border rounded text-sm">
                            <option value="Registration Open">Registration Open</option>
                            <option value="Registration Closed">Registration Closed</option>
                            <option value="Running">Running</option>
                            <option value="Completed">Completed</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <label className="flex items-center gap-2 text-sm cursor-pointer mb-2">
                            <input type="checkbox" checked={editProposalOpen} onChange={(e) => setEditProposalOpen(e.target.checked)} className="w-4 h-4" />
                            {editProposalOpen ? 'Open' : 'Closed'}
                          </label>
                          <input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} className="w-full px-2 py-1 border rounded text-sm" title="Proposal submission deadline" />
                        </td>
                        <td className="px-6 py-4">
                          <select value={editDefensePhase} onChange={(e) => setEditDefensePhase(e.target.value)} className="px-2 py-1 border rounded text-sm">
                            <option value="">None</option>
                            <option value="Pre-Defense">Pre-Defense</option>
                            <option value="Final Defense">Final Defense</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right space-x-3">
                          <button onClick={handleUpdate} className="text-green-600 font-medium text-sm">Save</button>
                          <button onClick={() => setEditing(null)} className="text-red-600 font-medium text-sm">Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-700 dark:text-gray-200">{cycle.name}</span>
                          {cycle.archived && <span className="ml-2 text-xs text-gray-400">(archived)</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">{cycle.startSemester} &rarr; {cycle.endSemester}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusBadge[cycle.status] || ''}`}>
                            {cycle.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-medium ${cycle.proposalSubmissionOpen ? 'text-green-600' : 'text-gray-400'}`}>
                            {cycle.proposalSubmissionOpen ? 'Open' : 'Closed'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{cycle.defensePhase || '—'}</span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-3">
                          {cycle.status !== 'Running' && cycle.status !== 'Completed' && !cycle.archived && (
                            <button onClick={() => handleActivate(cycle._id)} className="text-green-600 font-medium text-sm">Move to Running</button>
                          )}
                          <button onClick={() => startEditing(cycle)} className="text-blue-600 font-medium text-sm">Edit</button>
                          <button onClick={() => handleArchive(cycle._id)} className="text-orange-600 font-medium text-sm">
                            {cycle.archived ? 'Unarchive' : 'Archive'}
                          </button>
                        </td>
                      </>
                    )}
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

export default ThesisCyclesPage;
