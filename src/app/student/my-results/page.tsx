'use client';

import React from 'react';
import { useGetMyResultsQuery } from '@/store/features/apiSlice';
import PageSkeleton from '@/components/PageSkeleton';

interface Comment {
  evaluator: string;
  comment: string;
}

interface AssessmentTableProps {
  title: string;
  comments: {
    supervisor: Comment[];
    board: Comment[];
  };
}

const AssessmentTable: React.FC<AssessmentTableProps> = ({ title, comments }) => (
  <div className="mb-12">
    <h2 className="text-xl font-black text-gray-900 dark:text-gray-50 mb-4">{title}</h2>
    <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-indigo-600 dark:bg-indigo-500">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-sm font-black text-white w-1/4 uppercase tracking-wider">
              Evaluator
            </th>
            <th scope="col" className="px-6 py-4 text-left text-sm font-black text-white uppercase tracking-wider">
              Comments
            </th>
          </tr>
        </thead>
        <tbody className="bg-white/80 dark:bg-gray-900/80 divide-y divide-gray-200 dark:divide-gray-700">
          {/* Supervisor Comments */}
          {comments.supervisor.map((c, i) => (
            <tr key={`sup-${i}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td className="px-6 py-5 align-top">
                <div className="text-sm font-black text-gray-900 dark:text-gray-50">{c.evaluator}</div>
                <div className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-black tracking-wider">Supervisor</div>
              </td>
              <td className="px-6 py-5 text-base text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                {c.comment}
              </td>
            </tr>
          ))}

          {/* Board Member Comments */}
          {comments.board.map((c, i) => (
            <tr key={`board-${i}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td className="px-6 py-5 align-top">
                <div className="text-sm font-black text-gray-900 dark:text-gray-50">{c.evaluator}</div>
                <div className="text-[10px] text-violet-600 dark:text-violet-400 uppercase font-black tracking-wider">Board Member</div>
              </td>
              <td className="px-6 py-5 text-base text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                {c.comment}
              </td>
            </tr>
          ))}

          {/* No Comments State */}
          {comments.supervisor.length === 0 && comments.board.length === 0 && (
            <tr>
              <td colSpan={2} className="px-6 py-8 text-center text-sm text-gray-400 italic font-medium">
                No feedback comments recorded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const MyResultsPage = () => {
  const { data: results, isLoading, isError, error } = useGetMyResultsQuery();

  if (isLoading) return <PageSkeleton />;

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-700 dark:text-red-400 rounded-2xl text-center font-bold">
        Error: {(error as any)?.data?.message || 'Failed to fetch results.'}
      </div>
    );
  }

  if (!results) {
    return (
      <div className="p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-gray-100/80 dark:border-gray-800/80 text-center">
        <p className="text-gray-500 dark:text-gray-400 font-bold">No results found yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-gray-900 dark:text-gray-50 mb-2">My Results</h1>
          <p className="text-gray-400 font-bold">View your assessment feedback and final grades.</p>
        </div>

        {/* Pre-Defense Feedback Table */}
        <AssessmentTable 
          title="Pre-Defense Feedback" 
          comments={results.preDefenseComments} 
        />

        {/* Final-Defense Feedback Table */}
        <AssessmentTable 
          title="Final-Defense Feedback" 
          comments={results.finalDefenseComments} 
        />

        {/* Final Result Summary Table */}
        <div className="mt-16">
          <h2 className="text-xl font-black text-gray-900 dark:text-gray-50 mb-4">Final Result Summary</h2>
          <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-indigo-600 dark:bg-indigo-500">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-black text-white uppercase tracking-wider">Course Code</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-white uppercase tracking-wider">Course Title</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-white uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-white uppercase tracking-wider">Point</th>
                </tr>
              </thead>
              <tbody className="bg-white/80 dark:bg-gray-900/80 divide-y divide-gray-200 dark:divide-gray-700">
                {results.published ? (
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-gray-50">{results.courseCode}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-medium">{results.courseTitle}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-left text-sm font-black text-gray-900 dark:text-gray-50">{results.grade}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-left text-sm font-black text-indigo-600 dark:text-indigo-400">{results.point.toFixed(2)}</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400 font-medium italic bg-gray-50/50 dark:bg-gray-950/50">
                      Your final grade is currently being processed.
                    </td>
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

export default MyResultsPage;
