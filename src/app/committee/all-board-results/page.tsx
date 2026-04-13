'use client';

import React, { useState, useEffect } from 'react';
import { useGetBoardResultsQuery, usePublishAllResultsMutation } from '@/store/features/apiSlice';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';
import { ArrowLeft, Send, Users, FileText, Trophy, BarChart3, Filter, CheckCircle2, FlaskConical } from 'lucide-react';

const CommitteeAllBoardResultsPage = () => {
  const [defenseType, setDefenseType] = useState('Pre-Defense');
  const [selectedBoard, setSelectedBoard] = useState<any>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const { data: boardResults, isLoading, isError, error, refetch } = useGetBoardResultsQuery(defenseType);
  const [publishAllResults, { isLoading: isPublishing }] = usePublishAllResultsMutation();

  useEffect(() => {
    setSelectedBoard(null);
    setSelectedGroup(null);
  }, [defenseType]);

  const handlePublish = async () => {
    try {
      await publishAllResults().unwrap();
      toast.success('Result published successfully');
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to publish results');
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return (
    <div className="flex items-center justify-center min-h-[400px]">
       <p className="text-red-500 bg-red-50 px-4 py-2 rounded-md border border-red-100 font-medium">
         Error: {(error as any).data?.message || 'Failed to load board results'}
       </p>
    </div>
  );

  if (selectedBoard) {
    if (selectedGroup) {
      return <StudentWiseEvaluation group={selectedGroup} onBack={() => setSelectedGroup(null)} />;
    }
    return <GroupList board={selectedBoard} onGroupSelect={setSelectedGroup} onBack={() => setSelectedBoard(null)} />;
  }

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-gray-50 tracking-tight flex items-center">
                    <Trophy className="mr-3 text-green-600" size={32} />
                    Examination Results Oversight
                </h1>
                <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Global Results aggregation and publication</p>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select
                        value={defenseType}
                        onChange={(e) => setDefenseType(e.target.value)}
                        className="block w-full md:w-48 pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-xl shadow-sm focus:ring-2 focus:ring-green-400 outline-none transition-all"
                    >
                        <option value="Pre-Defense">Pre-Defense</option>
                        <option value="Final Defense">Final Defense</option>
                    </select>
                </div>
                
                <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="whitespace-nowrap px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-black rounded-xl shadow-xl shadow-green-100 transition-all transform active:scale-95 flex items-center gap-2"
                >
                    <Send size={18} />
                    {isPublishing ? 'Broadcasting...' : 'Publish Official Results'}
                </button>
            </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200 dark:border-gray-700">
                            <th className="py-5 px-8 text-[10px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-widest">Board Designation</th>
                            <th className="py-5 px-8 text-[10px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-widest text-center">Examination Type</th>
                            <th className="py-5 px-8 text-[10px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-widest text-center">Venue</th>
                            <th className="py-5 px-8 text-[10px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-widest text-center">Schedule</th>
                            <th className="py-5 px-8 text-[10px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-widest text-right">Review</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {boardResults && boardResults.length > 0 ? (
                            boardResults.map((boardResult: any) => (
                                <tr key={boardResult.board._id} className="hover:bg-green-50/20 transition-all group">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-green-100 text-green-700 flex items-center justify-center rounded-xl font-black mr-4 shadow-sm group-hover:bg-green-600 group-hover:text-white transition-all">
                                                {boardResult.board.boardNumber}
                                            </div>
                                            <span className="font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">Board ID #{boardResult.board.boardNumber}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-center text-gray-700 dark:text-gray-200">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${boardResult.board.defenseType === 'Pre-Defense' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
                                            {boardResult.board.defenseType}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8 text-center">
                                        <div className="inline-block bg-gray-50 dark:bg-gray-950 px-3 py-1 rounded-lg text-sm font-bold text-gray-900 dark:text-gray-50 border border-gray-200 dark:border-gray-700 uppercase tracking-tight">
                                            {boardResult.board.room.name}
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-center">
                                        <div className="text-sm font-bold text-gray-900 dark:text-gray-50">{new Date(boardResult.board.date).toLocaleDateString()}</div>
                                        <div className="text-[10px] font-black text-gray-700 dark:text-gray-200 mt-0.5">{boardResult.board.schedule.startTime} - {boardResult.board.schedule.endTime}</div>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <button 
                                            onClick={() => setSelectedBoard(boardResult)} 
                                            className="inline-flex items-center px-5 py-2 text-xs font-black text-green-700 bg-white dark:bg-gray-900 border-2 border-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all transform active:scale-95 shadow-sm"
                                        >
                                            <BarChart3 className="mr-2" size={14} />
                                            Audit Results
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-20 text-center text-gray-500 dark:text-gray-400 font-bold italic">No results detected for {defenseType} phase.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

const GroupList = ({ board, onGroupSelect, onBack }: any) => {
    return (
      <div className="p-8 max-w-5xl mx-auto animate-in slide-in-from-left duration-300">
        <button 
            onClick={onBack} 
            className="flex items-center gap-2 mb-8 text-gray-500 dark:text-gray-400 hover:text-green-600 font-black transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> BACK TO BOARDS OVERSIGHT
        </button>
        
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-8 bg-gray-50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h1 className="text-2xl font-black text-gray-900 dark:text-gray-50 tracking-tight">Assigned Groups: Board #{board.board.boardNumber}</h1>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{board.proposals.length} Units</span>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-50 dark:border-gray-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white dark:bg-gray-900">
                            <th className="py-5 px-8">Serial</th>
                            <th className="py-5 px-8">Research Identity</th>
                            <th className="py-5 px-8 text-right">Controls</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {board.proposals.map((proposalResult: any, index: number) => (
                            <tr key={proposalResult.proposal._id} className="hover:bg-green-50/20 transition-all group">
                                <td className="py-6 px-8 font-black text-gray-400">0{index + 1}</td>
                                <td className="py-6 px-8">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-50 p-2 rounded-xl text-blue-500">
                                            <FlaskConical size={20} />
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-gray-900 dark:text-gray-50 group-hover:text-green-700 transition-colors tracking-tight">{proposalResult.proposal.title}</p>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Approved Document ID: {proposalResult.proposal._id.substring(0,8)}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 px-8 text-right">
                                    <button 
                                        onClick={() => onGroupSelect(proposalResult)} 
                                        className="bg-gray-900 text-white px-6 py-2.5 rounded-xl hover:bg-black transition-all font-black text-xs shadow-lg transform active:scale-95"
                                    >
                                        Extract Summary
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    );
};

const StudentWiseEvaluation = ({ group, onBack }: any) => {
    return (
      <div className="p-8 max-w-7xl mx-auto animate-in slide-in-from-right duration-300">
        <button 
            onClick={onBack} 
            className="flex items-center gap-2 mb-8 text-gray-500 dark:text-gray-400 hover:text-green-600 font-black transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> BACK TO UNIT LIST
        </button>
  
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-8 bg-green-600 text-white relative">
                <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                    <CheckCircle2 size={120} />
                </div>
                <h1 className="text-3xl font-black tracking-tight mb-2">Internal Assessment Summary</h1>
                <p className="opacity-80 font-bold italic flex items-center">
                    <FileText size={18} className="mr-2" />
                    {group.proposal.title}
                </p>
            </div>
          
            <div className="p-8 overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-4">
                    <thead>
                        <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <th className="py-2 px-4">Candidate Identity</th>
                            <th className="py-2 px-4">Internal Supervisor</th>
                            <th className="py-2 px-4 text-center">Supervisor Credit</th>
                            <th className="py-2 px-4 text-center">Board Average</th>
                            <th className="py-2 px-4 text-right">Aggregated Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {group.students.map((studentResult: any) => {
                            const supervisorEval = studentResult.evaluations.find((e: any) => e.evaluationType === 'supervisor');
                            const committeeEvals = studentResult.evaluations.filter((e: any) => e.evaluationType === 'committee');
                            const committeeAvg = committeeEvals.length > 0 ? committeeEvals.reduce((acc: number, e: any) => acc + e.marks, 0) / committeeEvals.length : 0;
                            const total = (supervisorEval?.marks || 0) + committeeAvg;
    
                            return (
                                <tr key={studentResult.student._id} className="bg-gray-50 dark:bg-gray-950/50 hover:bg-green-50/30 transition-all rounded-2xl group border border-gray-100 dark:border-gray-800">
                                    <td className="py-5 px-6 rounded-l-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center font-black text-gray-300">
                                                {studentResult.student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 dark:text-gray-50 group-hover:text-green-700 transition-colors uppercase tracking-tight">{studentResult.student.name}</p>
                                                <p className="text-[10px] font-black text-gray-400 font-mono tracking-tighter">{studentResult.student.studentId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 text-sm font-bold text-gray-600 dark:text-gray-300">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                            {group.proposal.supervisorId?.name || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 text-center">
                                        <span className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-4 py-1.5 rounded-xl font-black text-gray-700 dark:text-gray-200 shadow-sm">{supervisorEval?.marks || 'N/A'}</span>
                                    </td>
                                    <td className="py-5 px-6 text-center">
                                        <span className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-4 py-1.5 rounded-xl font-black text-gray-700 dark:text-gray-200 shadow-sm">{committeeAvg.toFixed(2)}</span>
                                    </td>
                                    <td className="py-5 px-6 text-right rounded-r-2xl">
                                        <span className="text-2xl font-black text-green-600 tabular-nums">{total.toFixed(2)}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    );
};

export default CommitteeAllBoardResultsPage;
