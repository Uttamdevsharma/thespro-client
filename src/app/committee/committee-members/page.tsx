'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Loader from '@/components/Loader';
import { ShieldCheck, Mail, User } from 'lucide-react';

const CommitteeMembersPage = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const fetchMembers = async () => {
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
        const { data } = await axios.get('http://localhost:5005/api/users/committee-members', config);
        const membersList = data.map((member: any) => ({
          id: member._id,
          ...member,
        }));
        setMembers(membersList);
      } catch (error) {
        console.error('Failed to fetch committee members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-10 flex items-center">
            <ShieldCheck className="mr-3 text-green-600" size={32} />
            Committee Members
        </h1>

        {members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
                <div key={member.id} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-3xl -mr-4 -mt-4 group-hover:bg-green-100 transition-colors"></div>
                    
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-green-100 text-green-600 p-3 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">{member.name}</h2>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Committee Member</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 group-hover:bg-white transition-colors">
                            <Mail size={16} className="mr-3 text-gray-400" />
                            <span className="truncate">{member.email}</span>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="p-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 text-lg font-medium">No committee members found.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default CommitteeMembersPage;
