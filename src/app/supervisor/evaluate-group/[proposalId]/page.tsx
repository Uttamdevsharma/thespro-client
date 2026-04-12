'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    useGetEvaluationsByProposalQuery,
    useSubmitOrUpdateEvaluationMutation,
    useGetProposalByIdQuery
} from '@/store/features/apiSlice';
import { RootState } from '@/store';
import Loader from '@/components/Loader';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

const EvaluateGroupPage = () => {
    const params = useParams();
    const proposalId = params.proposalId as string;
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialDefenseType = searchParams.get('defenseType') || 'Pre-Defense';

    const user = useSelector((state: RootState) => state.user.user);
    const supervisorId = (user as any)?._id;

    const [marks, setMarks] = useState<Record<string, string | number>>({});
    const [comments, setComments] = useState<Record<string, string>>({});
    const [defenseType, setDefenseType] = useState(initialDefenseType);

    const { data: proposal, isLoading: isLoadingProposal, error: proposalError } =
        useGetProposalByIdQuery(proposalId, { skip: !proposalId });

    const { data: existingEvaluations, refetch, isLoading: isLoadingEvaluations } =
        useGetEvaluationsByProposalQuery({ proposalId, defenseType }, {
            skip: !proposalId,
        });

    const [submitEvaluation, { isLoading: isSubmitting }] = useSubmitOrUpdateEvaluationMutation();

    // Determine role dynamically
    const isSupervisor = proposal?.supervisorId?._id === supervisorId || 
                         proposal?.coSupervisors?.some((s: any) => s._id === supervisorId);
    
    const evaluationType = isSupervisor ? 'supervisor' : 'committee';
    const maxMark = evaluationType === 'supervisor' 
        ? (defenseType === 'Pre-Defense' ? 20 : 40)
        : (defenseType === 'Pre-Defense' ? 10 : 30);

    useEffect(() => {
        if (!proposalId) {
            toast.error('No group selected for evaluation.');
            router.push('/supervisor/my-supervisions');
            return;
        }
        if (proposalError) {
            toast.error(`Error loading proposal: ${(proposalError as any).message || 'Unknown error'}`);
            router.push('/supervisor/my-supervisions');
            return;
        }

        const initialMarks: Record<string, number> = {};
        const initialComments: Record<string, string> = {};
        if (existingEvaluations) {
            existingEvaluations.forEach((evalGroup: any) => {
                evalGroup.evaluations.forEach((evaluation: any) => {
                    // Match by evaluator ID AND correct evaluation type (supervisor vs committee)
                    if (evaluation.evaluator._id === supervisorId && 
                        evaluation.defenseType === defenseType &&
                        evaluation.evaluationType === evaluationType) {
                        initialMarks[evalGroup.student._id] = evaluation.marks;
                        initialComments[evalGroup.student._id] = evaluation.comments || '';
                    }
                });
            });
        }
        
        const marksString = Object.fromEntries(
            Object.entries(initialMarks).map(([key, value]) => [key, String(value)])
        );

        setMarks(marksString);
        setComments(initialComments);
    }, [existingEvaluations, defenseType, supervisorId, proposalId, router, proposalError, evaluationType]);


    const handleMarkChange = (studentId: string, value: string) => {
        const cleanedValue = value.trim() === '' ? '' : Number(value); 
        setMarks(prev => ({ ...prev, [studentId]: cleanedValue }));
    };

    const handleCommentChange = (studentId: string, value: string) => {
        setComments(prev => ({ ...prev, [studentId]: value }));
    };

    const handleSaveAll = async () => {
        if (!proposal) {
            toast.error('Proposal data not available.');
            return;
        }

        const submissionPromises = proposal.members.map(async (student: any) => {
            const mark = marks[student._id];
            const comment = comments[student._id] || '';

            if (mark === undefined || mark === '' || Number(mark) < 0 || Number(mark) > maxMark) {
                const errMsg = `Marks for ${student.name} must be a number between 0 and ${maxMark}.`;
                toast.error(errMsg);
                throw new Error(errMsg);
            }

            try {
                return await submitEvaluation({
                    studentId: student._id,
                    proposalId: proposal._id,
                    defenseType,
                    evaluationType, // Dynamically set to 'supervisor' or 'committee'
                    marks: Number(mark),
                    comments: comment,
                }).unwrap();
            } catch (err: any) {
                console.error(`Submission failed for ${student.name}:`, JSON.stringify(err, null, 2));
                const backendMsg = err.data?.message || err.message || 'Server error';
                toast.error(`Failed to save for ${student.name}: ${backendMsg}`);
                throw err;
            }
        });

        try {
            await Promise.all(submissionPromises);
            toast.success(`Evaluations saved successfully as ${evaluationType.toUpperCase()}!`);
            refetch();
        } catch (err) {
            // Errors managed in map
        }
    };

    if (isLoadingProposal || isLoadingEvaluations || !proposal) {
        return <Loader />;
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <button 
                    onClick={() => router.push('/supervisor/my-supervisions')} 
                    className="flex items-center gap-2 mb-6 text-gray-500 hover:text-green-600 font-medium transition-colors"
                >
                    <ArrowLeft size={20} /> Back to My Supervisions
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-3">Evaluation Management</h2>
                
                <div className="mb-6 flex items-center space-x-4 bg-green-50 p-3 rounded-lg border border-green-200">
                    <label className="font-semibold text-gray-700">Evaluation Phase:</label>
                    <select 
                        value={defenseType} 
                        onChange={(e) => setDefenseType(e.target.value)} 
                        className="p-2 border border-green-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150 text-gray-700"
                    >
                        <option value="Pre-Defense">Pre-Defense (Max: {evaluationType === 'supervisor' ? 20 : 10})</option>
                        <option value="Final Defense">Final Defense (Max: {evaluationType === 'supervisor' ? 40 : 30})</option>
                    </select>
                    <span className="text-sm text-gray-600 ml-auto font-medium">Current Max Mark: <span className="font-bold text-green-700">{maxMark}</span></span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Students in "{proposal.title}"</h3>

                <div className="space-y-6">
                    {proposal.members.map((student: any) => (
                        <div key={student._id} className="p-5 border border-gray-200 rounded-xl shadow-md bg-white">
                            <div className="flex justify-between items-center mb-3 border-b pb-2">
                                <p className="font-bold text-lg text-gray-900">{student.name}</p>
                                <p className="text-sm text-gray-600">{student.email}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="font-medium text-gray-700 mb-1">Marks (out of {maxMark}):</label>
                                    <input
                                        type="number"
                                        value={marks[student._id] ?? ''} 
                                        onChange={(e) => handleMarkChange(student._id, e.target.value)}
                                        className="p-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 text-gray-700 font-semibold"
                                        max={maxMark}
                                        min="0"
                                        placeholder="Enter Mark"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="font-medium text-gray-700 mb-1">Comment (Optional):</label>
                                    <input
                                        type="text"
                                        value={comments[student._id] || ''}
                                        onChange={(e) => handleCommentChange(student._id, e.target.value)}
                                        className="p-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        placeholder="Provide feedback"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleSaveAll}
                        className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-gray-400 flex items-center shadow-lg"
                        disabled={isSubmitting}
                    >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        {isSubmitting ? 'Saving All...' : 'Save All Evaluations'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EvaluateGroupPage;
