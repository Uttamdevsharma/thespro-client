'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetStudentProposalsQuery } from '@/store/features/apiSlice';

const StudentProposalStatusPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { data: proposals, isLoading: proposalsLoading } = useGetStudentProposalsQuery((user as any)?._id, { skip: !user });

  if (proposalsLoading) {
    return <div className="p-6 bg-white rounded-lg shadow-md">Loading proposals...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Proposal Status</h1>
      {proposals && proposals.length === 0 ? (
        <p>No proposals found. Submit a new proposal to get started!</p>
      ) : (
        <div className="space-y-4">
          {proposals && proposals.map((proposal: any) => (
            <div key={proposal._id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800">{proposal.title}</h2>
              <p className="text-gray-600 text-sm mb-2">Type: {proposal.type}</p>
              <p className="text-gray-600 text-sm mb-2">Research Cell: {proposal.researchCellId?.title || 'N/A'}</p>
              <p className="text-gray-600 text-sm mb-2">Supervisor: {proposal.supervisorId?.name || 'N/A'}</p>
              <div className="text-gray-600 text-sm mb-2">
                <span className="font-semibold mr-2">Group Members:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {proposal.members.map((member: any) => (
                    <span key={member._id} className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs font-medium text-gray-700">
                      {member.name || 'Unknown'} - {member.studentId} (CGPA: {member.currentCGPA})
                    </span>
                  ))}
                </div>
              </div>
              <p className={`text-lg font-bold mt-2 ${proposal.status === 'Approved' ? 'text-green-600' :
                  proposal.status === 'Not Approved' ? 'text-red-600' :
                    proposal.status === 'Pending Committee' ? 'text-yellow-600' :
                      'text-gray-600'
                }`}>
                Status: {proposal.status}
              </p>
              {proposal.status === 'Not Approved' && proposal.feedback && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm font-semibold text-red-800">Feedback:</p>
                  <p className="text-sm text-red-700">{proposal.feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentProposalStatusPage;
