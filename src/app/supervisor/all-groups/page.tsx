'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import ListPageSkeleton from '@/components/ListPageSkeleton';
import { useCycle } from '@/contexts/CycleContext';
import { useGetSupervisorAllGroupsQuery } from '@/store/features/apiSlice';

const SupervisorAllGroupsPage = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const { cycleId } = useCycle();
  
    const { data, isLoading: loading } = useGetSupervisorAllGroupsQuery({ thesisCycleId: cycleId || undefined }, {
      skip: !user
    });

    const underMySupervisionOnly = data?.underMySupervisionOnly || [];
    const underMySupervisionAndCourseSupervision = data?.underMySupervisionAndCourseSupervision || [];
    const underMyCourseSupervision = data?.underMyCourseSupervision || [];
  
    const renderTable = (groups: any[]) => (
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="min-w-full bg-white dark:bg-gray-900 divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-950">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Group No</th>
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student ID(s)</th>
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Name(s)</th>
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supervisor / Co-Supervisor</th>
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
            {groups.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 px-4 text-center text-gray-500 dark:text-gray-400 italic">No groups in this category.</td>
              </tr>
            ) : (
              groups.map((group, index) => (
                <tr key={group._id} className="hover:bg-gray-50 dark:bg-gray-950 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-gray-50">{index + 1}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-200">
                    <div className="flex flex-col">
                        {group.members.map((member: any) => <span key={member._id}>{member.studentId}</span>)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-200 font-medium">
                    <div className="flex flex-col">
                        {group.members.map((member: any) => <span key={member._id}>{member.name}</span>)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-200">{group.title}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-200">
                    <span className="font-semibold text-green-700">{group.supervisorId?.name}</span>
                    {group.courseSupervisorId?.name ? <span className="text-gray-500 dark:text-gray-400"> & {group.courseSupervisorId.name}</span> : ''}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-200">
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
      return <ListPageSkeleton />;
    }
  
    return (
      <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-12">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 border-b-2 border-green-500 pb-2 inline-block">All Groups</h1>
    
            <section>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
                    Under My Supervision
                </h2>
                {renderTable(underMySupervisionOnly)}
            </section>
    
            <section>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    <span className="w-2 h-8 bg-blue-500 rounded-full mr-3"></span>
                    Under My Supervision and with Course Supervision
                </h2>
                {renderTable(underMySupervisionAndCourseSupervision)}
            </section>
    
            <section>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
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
