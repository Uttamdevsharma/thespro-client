'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Loader from '@/components/Loader';

const ResearchCellInfoPage = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const fetchSupervisors = async () => {
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
        const { data: teachersData } = await axios.get('http://localhost:5005/api/users/supervisors', config);
        
        // Filter for teachers who are assigned to one or more cells
        const teachersWithCells = teachersData.filter((teacher: any) => teacher.researchCells && teacher.researchCells.length > 0);

        setTeachers(teachersWithCells);
      } catch (error) {
        console.error("Error fetching research cell info: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisors();
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Research Cell Information</h1>
      {teachers.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
          No teachers have been assigned to any research cells yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <div key={teacher._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{teacher.name}</h2>
              <p className="text-sm text-gray-600 mb-4">{teacher.email}</p>
              <div>
                <h3 className="text-md font-semibold text-gray-700 mb-3">Assigned Cells:</h3>
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
