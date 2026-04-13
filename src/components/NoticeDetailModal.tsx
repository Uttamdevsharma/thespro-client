import React from 'react';

interface NoticeDetailModalProps {
  showModal: boolean;
  onClose: () => void;
  notice: any;
}

const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({ showModal, onClose, notice }) => {
  if (!showModal || !notice) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative p-8 border w-full max-w-lg md:max-w-xl lg:max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-900 transform transition-all duration-300 ease-out scale-100 opacity-100">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">{notice.title}</h3>
        <div className="mt-2 text-gray-700 dark:text-gray-200 mb-4">
          <p className="whitespace-pre-wrap">{notice.description}</p>
        </div>
        {notice.file && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Attachment:</p>
            <a
              href={`${process.env.NEXT_PUBLIC_BASE_URL}${notice.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Download Attachment
            </a>
          </div>
        )}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          <p>Sent to: {notice.sendTo}</p>
          <p>Created by: {notice.sender?.name || 'Unknown'} on {new Date(notice.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetailModal;
