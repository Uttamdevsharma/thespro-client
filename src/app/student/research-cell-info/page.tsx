'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Loader from '@/components/Loader';
import { useGetTeachersQuery } from '@/store/features/apiSlice';

const ResearchCellInfoPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { data: rawTeachers = [], isLoading: loading } = useGetTeachersQuery(undefined, {
    skip: !user
  });

  const teachers = React.useMemo(() => {
    return rawTeachers.filter((teacher: any) => teacher.researchCells && teacher.researchCells.length > 0);
  }, [rawTeachers]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Research Cell Information</h1>
      {teachers.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md text-center text-gray-500 dark:text-gray-400">
          No teachers have been assigned to any research cells yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <div key={teacher._id} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{teacher.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{teacher.email}</p>
              <div>
                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">Assigned Cells:</h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.researchCells.map((cell: any) => (
                    <div key={cell._id} className="inline-block bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-semibold">
                      {cell.title}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResearchCellInfoPage;
