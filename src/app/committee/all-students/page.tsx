'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useCycle } from '@/contexts/CycleContext';
import { useGetStudentsQuery } from '@/store/features/apiSlice';

const AllStudentsPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { cycleId } = useCycle();
  const { data: students = [], isLoading: loading } = useGetStudentsQuery({ thesisCycleId: cycleId || undefined }, {
    skip: !user
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Students</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student: any) => (
          <div key={student._id || student.id} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">{student.name}</p>
              <p className="text-sm text-gray-400">{student.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllStudentsPage;
