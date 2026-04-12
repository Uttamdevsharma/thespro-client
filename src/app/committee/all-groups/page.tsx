'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';
import { Users, BookOpen, UserCheck, Tag } from 'lucide-react';

const CommitteeAllGroupsPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllGroups = async () => {
      if (!user || !user.token) {
        setLoading(false);
        return;
      }
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      try {
        const { data } = await axios.get('http://localhost:5005/api/proposals/approved-proposals', config);
        setGroups(data);
      } catch (error) {
        toast.error('Failed to fetch all groups.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllGroups();
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center">
            <Users className="mr-3 text-green-600" size={32} />
            All Approved Groups
        </h1>

        {groups.length === 0 ? (
          <div className="p-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-lg font-medium italic">No approved groups found at this time.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">SL</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Group Members</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Research Topic</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Supervisor</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Type</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {groups.map((group, index) => (
                    <tr key={group._id} className="hover:bg-green-50/20 transition-colors group">
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-400">{index + 1 < 10 ? `0${index + 1}` : index + 1}</td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-2">
                          {group.members.map((member: any) => (
                            <div key={member.studentId} className="flex items-center text-xs">
                                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono font-bold mr-2">{member.studentId}</span>
                                <span className="text-gray-900 font-semibold">{member.name}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-2">
                           <BookOpen size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                           <span className="text-sm font-bold text-gray-800 leading-tight group-hover:text-green-700 transition-colors line-clamp-2 max-w-xs">{group.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center text-sm font-semibold text-gray-700">
                           <div className="bg-green-100 text-green-600 p-1.5 rounded-lg mr-2">
                             <UserCheck size={14} />
                           </div>
                           {group.supervisorId?.name || 'Assigned Soon'}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex items-center">
                            <Tag size={12} className="mr-1.5 text-blue-400" />
                            <span className="inline-block bg-blue-50 text-blue-700 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-tighter">
                                {group.type}
                            </span>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommitteeAllGroupsPage;
