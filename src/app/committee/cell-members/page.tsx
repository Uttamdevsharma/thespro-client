'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGetResearchCellsQuery } from '@/store/features/apiSlice';
import Loader from '@/components/Loader';
import { Layers, ChevronRight } from 'lucide-react';

const CommitteeCellMembersOverviewPage = () => {
  const router = useRouter();
  const { data: researchCells, isLoading, isError, error } = useGetResearchCellsQuery();

  if (isLoading) return <Loader />;
  if (isError) return <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-6xl mx-auto mt-10">Error: {(error as any)?.data?.message || (error as any)?.error}</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center">
            <Layers className="mr-3 text-green-600" size={32} />
            Research Cell Members Overview
        </h1>

        {researchCells && researchCells.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {researchCells.map((cell: any) => (
              <div
                key={cell._id}
                className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-start hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
                onClick={() => router.push(`/committee/cell-members/${cell._id}`)}
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-green-500 transition-all group-hover:w-3"></div>
                
                <div className="text-green-600 mb-4 bg-green-50 p-3 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <Layers size={32} strokeWidth={1.5} />
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors uppercase tracking-tight">{cell.title}</h2>
                <p className="text-sm text-gray-500 mb-6 flex-grow leading-relaxed">{cell.description}</p>
                
                <div className="flex items-center text-sm font-bold text-green-600 group-hover:translate-x-2 transition-transform">
                    View Members <ChevronRight size={18} className="ml-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-lg font-medium">No research cells found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommitteeCellMembersOverviewPage;
