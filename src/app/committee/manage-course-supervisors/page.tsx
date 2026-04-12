'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';
import { RoomManager, ScheduleManager } from '@/app/committee/defense-schedule/page';
import { ShieldCheck, UserPlus, Settings, Layout, Users, ChevronRight } from 'lucide-react';

const CommitteeManageCourseSupervisorsPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [mainSupervisors, setMainSupervisors] = useState<any[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [isCourseSupervisor, setIsCourseSupervisor] = useState(false);
  const [selectedMainSupervisor, setSelectedMainSupervisor] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSupervisors = async () => {
    if (!user || !user.token) {
        setLoading(false);
        return;
    }
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    };
    try {
      const { data } = await axios.get('http://localhost:5005/api/users/supervisors/all', config);
      setSupervisors(data);
      const assignedMainSupervisors = data.filter((s: any) => s.isCourseSupervisor).map((s: any) => s.mainSupervisor).filter(Boolean);
      setMainSupervisors(data.filter((s: any) => !s.isCourseSupervisor && !assignedMainSupervisors.includes(s._id)));
    } catch (error) {
      toast.error('Failed to fetch supervisors.');
      console.error(error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisors();
  }, [user]);

  const handleSupervisorSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const supervisorId = e.target.value;
    setSelectedSupervisor(supervisorId);
    const supervisor = supervisors.find(s => s._id === supervisorId);
    if (supervisor) {
      setIsCourseSupervisor(supervisor.isCourseSupervisor);
      setSelectedMainSupervisor(supervisor.mainSupervisor || '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.token) return toast.error('User not logged in.');
    if (!selectedSupervisor) return toast.error('Please select a supervisor.');

    const config = {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
    };

    try {
      await axios.put(
        `http://localhost:5005/api/users/supervisors/${selectedSupervisor}/assign-course-supervisor`,
        { isCourseSupervisor, mainSupervisor: selectedMainSupervisor || null },
        config
      );
      toast.success('Supervisor role updated successfully!');
      fetchSupervisors();
      setSelectedSupervisor('');
      setIsCourseSupervisor(false);
      setSelectedMainSupervisor('');
    } catch (error: any) {
      toast.error(`Failed to update supervisor role: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <header>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center mb-2">
                <ShieldCheck className="mr-3 text-green-600" size={40} />
                Strategic Supervision Management
            </h1>
            <p className="text-gray-500 font-bold text-lg italic">Hierarchy configuration for Course Supervisors and Main Supervisors</p>
        </header>

        <section className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Settings size={120} />
            </div>
            
            <h2 className="text-xl font-black text-gray-800 mb-8 flex items-center">
                <UserPlus className="mr-2 text-green-500" size={24} /> 
                Configure Supervisor Role
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
                <div>
                    <label htmlFor="supervisorSelect" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                        Target Supervisor
                    </label>
                    <select
                        id="supervisorSelect"
                        value={selectedSupervisor}
                        onChange={handleSupervisorSelect}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-400 focus:bg-white outline-none transition-all font-bold text-gray-700"
                        required
                    >
                        <option value="">-- Choose a Faculty Member --</option>
                        {supervisors.map(s => (
                            <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                        ))}
                    </select>
                </div>

                {selectedSupervisor && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                        <label className="inline-flex items-center cursor-pointer group p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-green-200 transition-all">
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={isCourseSupervisor}
                                onChange={(e) => setIsCourseSupervisor(e.target.checked)}
                            />
                            <div className={`w-6 h-6 rounded-md border-2 mr-3 flex items-center justify-center transition-all ${isCourseSupervisor ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300 bg-white'}`}>
                                {isCourseSupervisor && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                            </div>
                            <span className="font-black text-gray-700 uppercase tracking-tighter">Designate as Course Supervisor</span>
                        </label>
                    </div>
                )}

                {isCourseSupervisor && selectedSupervisor && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                        <label htmlFor="mainSupervisorSelect" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                            Link to Strategic Oversight (Main Supervisor)
                        </label>
                        <select
                            id="mainSupervisorSelect"
                            value={selectedMainSupervisor}
                            onChange={(e) => setSelectedMainSupervisor(e.target.value)}
                            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-400 focus:bg-white outline-none transition-all font-bold text-gray-700"
                            required
                        >
                            <option value="">-- Assign to Main Supervisor --</option>
                            {mainSupervisors
                                .filter(s => s._id !== selectedSupervisor)
                                .map(s => (
                                    <option key={s._id} value={s._id}>{s.name}</option>
                                ))}
                        </select>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-green-100 transition-all transform active:scale-95 disabled:bg-gray-400"
                >
                    Update Authority Parameters
                </button>
            </form>
        </section>

        <section>
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                <Layout className="mr-3 text-green-600" size={28} />
                Current Hierarchy Mappings
            </h2>
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {supervisors.filter(s => s.isCourseSupervisor).length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-4 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Course Supervisor</th>
                                    <th className="py-4 px-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="py-4 px-8 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Reports To</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {supervisors.filter(s => s.isCourseSupervisor).map(cs => (
                                    <tr key={cs._id} className="hover:bg-green-50/20 transition-all group">
                                        <td className="py-5 px-8">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-green-100 text-green-700 rounded-lg flex items-center justify-center font-black mr-3 shadow-sm group-hover:bg-green-600 group-hover:text-white transition-all">
                                                    {cs.name.charAt(0)}
                                                </div>
                                                <span className="font-black text-gray-800 tracking-tight">{cs.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8 text-center">
                                            <span className="inline-block bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-widest">Active Assignment</span>
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            {cs.mainSupervisor ? (
                                                <div className="flex items-center justify-end text-sm font-bold text-gray-500">
                                                    <span className="opacity-60 text-[9px] mr-2 uppercase">Main:</span>
                                                    <span className="text-gray-900">{supervisors.find(s => s._id === cs.mainSupervisor)?.name || 'Unknown Reference'}</span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-black text-red-400 uppercase tracking-tighter italic">No Strategic Head Assigned</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-20 text-center text-gray-400 font-bold italic">No course supervisors currently mapped in system.</div>
                )}
            </div>
        </section>

        <section className="pt-10 border-t-2 border-dashed border-gray-200">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
                    <Users className="mr-3 text-green-600" size={32} />
                    Defense Logistics Overview
                </h2>
                <div className="flex gap-2">
                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">Infrastructure Control</span>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <RoomManager />
                <ScheduleManager />
            </div>
        </section>
      </div>
    </div>
  );
};

export default CommitteeManageCourseSupervisorsPage;
