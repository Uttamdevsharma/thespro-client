'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface SupervisorCardProps {
    member: {
        _id: string;
        name: string;
        profilePicture?: string;
        designation?: string;
        researchCells?: Array<{
            _id: string;
            title: string;
        }>;
    };
}

const SupervisorCard: React.FC<SupervisorCardProps> = ({ member }) => {
    const router = useRouter();

    return (
        <div 
            onClick={() => router.push(`/supervisors/profile/${member._id}`)}
            className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:scale-[1.03] transition-all duration-300 cursor-pointer flex flex-col border border-gray-100 dark:border-gray-800 h-full"
        >
            {/* Image Wrapper */}
            <div className="relative">
                <div className="w-full h-[240px] overflow-hidden">
                    {member.profilePicture ? (
                        <img 
                            src={member.profilePicture} 
                            alt={member.name} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-[#0ea5b7] text-4xl font-black uppercase">
                            {member.name.charAt(0)}
                        </div>
                    )}
                </div>
                
                {/* Designation Bar (Overlay) */}
                <div className="absolute bottom-0 w-full bg-[#0ea5b7] py-2 px-2 text-center">
                    <p className="text-xs font-bold text-white uppercase tracking-wider truncate">
                        {member.designation || 'Supervisor'}
                    </p>
                </div>
            </div>

            {/* Info Section */}
            <div className="p-4 flex-grow flex flex-col bg-white dark:bg-gray-900">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 text-center leading-tight mb-3 group-hover:text-[#0ea5b7] transition-colors">
                    {member.name}
                </h3>
                
                {/* Assigned Cells Tags */}
                <div className="mt-auto flex flex-wrap justify-center gap-1 pt-2 border-t border-gray-50 dark:border-gray-800">
                    {member.researchCells && member.researchCells.length > 0 ? (
                        member.researchCells.slice(0, 2).map((cell: any) => (
                            <span key={cell._id} className="text-[8px] font-black bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                {cell.title.split(' ')[0]} Cell
                            </span>
                        ))
                    ) : (
                        <span className="text-[8px] font-bold text-gray-300 dark:text-gray-600 dark:text-gray-300 italic">No Cell</span>
                    )}
                    {member.researchCells && member.researchCells.length > 2 && (
                        <span className="text-[8px] font-black bg-[#0ea5b7]/10 dark:bg-[#0ea5b7]/20 text-[#0ea5b7] px-1.5 py-0.5 rounded-full">
                            +{member.researchCells.length - 2}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupervisorCard;
