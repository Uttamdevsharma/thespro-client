'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';

const SupervisorAllGroupsPage = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [underMySupervisionOnly, setUnderMySupervisionOnly] = useState<any[]>([]);
    const [underMySupervisionAndCourseSupervision, setUnderMySupervisionAndCourseSupervision] = useState<any[]>([]);
    const [underMyCourseSupervision, setUnderMyCourseSupervision] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchAllGroups = async () => {
        if (!user || !user.token) {
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        try {
          const { data } = await axios.get('http://localhost:5005/api/proposals/supervisor-all-groups', config);
          setUnderMySupervisionOnly(data.underMySupervisionOnly);
          setUnderMySupervisionAndCourseSupervision(data.underMySupervisionAndCourseSupervision);
          setUnderMyCourseSupervision(data.underMyCourseSupervision);
        } catch (error) {
          console.error("Error fetching all groups: ", error);
          toast.error('Failed to fetch all groups.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchAllGroups();
    }, [user]);
  
    const renderTable = (groups: any[]) => (
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Group No</th>
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student ID(s)</th>
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name(s)</th>
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Supervisor / Co-Supervisor</th>
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groups.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 px-4 text-center text-gray-500 italic">No groups in this category.</td>
              </tr>
            ) : (
              groups.map((group, index) => (
                <tr key={group._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="flex flex-col">
                        {group.members.map((member: any) => <span key={member._id}>{member.studentId}</span>)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 font-medium">
                    <div className="flex flex-col">
                        {group.members.map((member: any) => <span key={member._id}>{member.name}</span>)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{group.title}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <span className="font-semibold text-green-700">{group.supervisorId?.name}</span>
                    {group.courseSupervisorId?.name ? <span className="text-gray-500"> & {group.courseSupervisorId.name}</span> : ''}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs font-semibold">
                        {group.type}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  
    if (loading) {
      return <Loader />;
    }
  
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-12">
            <h1 className="text-3xl font-extrabold text-gray-900 border-b-2 border-green-500 pb-2 inline-block">All Groups</h1>
    
            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
                    Under My Supervision
                </h2>
                {renderTable(underMySupervisionOnly)}
            </section>
    
            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-2 h-8 bg-blue-500 rounded-full mr-3"></span>
                    Under My Supervision and with Course Supervision
                </h2>
                {renderTable(underMySupervisionAndCourseSupervision)}
            </section>
    
            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-2 h-8 bg-purple-500 rounded-full mr-3"></span>
                    Under My Course Supervision
                </h2>
                {renderTable(underMyCourseSupervision)}
            </section>
        </div>
      </div>
    );
};
  
export default SupervisorAllGroupsPage;
