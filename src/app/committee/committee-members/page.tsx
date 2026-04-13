'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Loader from '@/components/Loader';
import { ShieldCheck, Mail, User } from 'lucide-react';
import { useGetCommitteeMembersQuery } from '@/store/features/apiSlice';

const CommitteeMembersPage = () => {
  const user = useSelector((state: RootState) => state.user.user);

  const { data: rawMembers, isLoading: loading } = useGetCommitteeMembersQuery(undefined, {
    skip: !user
  });

  const members = React.useMemo(() => {
    if (!rawMembers) return [];
    return rawMembers.map((member: any) => ({
      id: member._id,
      ...member,
    }));
  }, [rawMembers]);

  if (loading) return <Loader />;

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 mb-10 flex items-center">
            <ShieldCheck className="mr-3 text-green-600" size={32} />
            Committee Members
        </h1>

        {members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
                <div key={member.id} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-3xl -mr-4 -mt-4 group-hover:bg-green-100 transition-colors"></div>
                    
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-green-100 text-green-600 p-3 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50 group-hover:text-green-700 transition-colors">{member.name}</h2>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Committee Member</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 p-3 rounded-lg border border-gray-100 dark:border-gray-800 group-hover:bg-white dark:bg-gray-900 transition-colors">
                            <Mail size={16} className="mr-3 text-gray-400" />
                            <span className="truncate">{member.email}</span>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="p-20 text-center bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-gray-400 text-lg font-medium">No committee members found.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default CommitteeMembersPage;
