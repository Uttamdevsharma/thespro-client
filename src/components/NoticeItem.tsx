import React, { useState } from 'react';
import { FaRegBell } from 'react-icons/fa';

interface NoticeItemProps {
  notice: any;
}

const NoticeItem: React.FC<NoticeItemProps> = ({ notice }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-3">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <FaRegBell className="text-gray-500 dark:text-gray-400 mr-3" />
          <h4 className="font-semibold text-gray-800 dark:text-gray-100">{notice.title}</h4>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(notice.createdAt).toLocaleDateString()}
        </span>
      </div>
      {isOpen && (
        <div className="mt-2 pl-8 text-gray-600 dark:text-gray-300">
          <p>{notice.description}</p>
        </div>
      )}
    </div>
  );
};

export default NoticeItem;
