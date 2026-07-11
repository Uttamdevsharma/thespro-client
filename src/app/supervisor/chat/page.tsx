'use client';

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useSocket } from "@/contexts/SocketContext";
import toast from "react-hot-toast";
import { useGetProposalsBySupervisorQuery } from "@/store/features/apiSlice";
import PageSkeleton from '@/components/PageSkeleton';

const SupervisorChatPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const socket = useSocket();
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [currentFilter, setCurrentFilter] = useState('my_supervision'); 
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: proposals, isLoading: loading } = useGetProposalsBySupervisorQuery(
    { supervisorId: (user as any)?._id, filter: currentFilter },
    { skip: !user }
  );

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (proposals && proposals.length > 0) {
      if (!selectedProposalId || !proposals.find((p: any) => p._id === selectedProposalId)) {
        setSelectedProposalId(proposals[0]._id);
      }
    } else {
      setSelectedProposalId(null);
    }
  }, [proposals]);

  useEffect(() => {
    if (socket && selectedProposalId) {
      socket.emit("joinRoom", selectedProposalId);

      socket.on("messageHistory", (history: any[]) => setMessages(history));
      socket.on("newMessage", (message: any) =>
        setMessages((prev) => [...prev, message])
      );

      return () => {
        socket.off("messageHistory");
        socket.off("newMessage");
      };
    }
  }, [socket, selectedProposalId]);

  const handleSendMessage = () => {
    if ((newMessage.trim() || file) && user && selectedProposalId && socket) {
      if (file) {
        handleFileUpload();
      } else {
        socket.emit("sendMessage", {
          senderId: (user as any)._id,
          proposalId: selectedProposalId,
          content: newMessage.trim(),
        });
        setNewMessage("");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file || !user || !selectedProposalId || !socket) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/chat-file`,
        formData,
        config
      );

      socket.emit("sendMessage", {
        senderId: (user as any)._id,
        proposalId: selectedProposalId,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
      });
      setFile(null);
      toast.success("File sent!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to upload file.");
    }
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#50C878] text-white px-6 py-3 rounded-t-xl shadow">
        <h1 className="text-xl font-semibold">Supervisor Chat</h1>
        <div className="flex items-center space-x-4">
          <select
            value={currentFilter}
            onChange={(e) => setCurrentFilter(e.target.value)}
            className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-1 rounded-md focus:ring-2 focus:ring-green-300 focus:outline-none text-sm font-medium"
          >
            <option value="my_supervision">Under My Supervision</option>
            <option value="my_supervision_with_course_supervision">Under My Supervision with Course Supervision</option>
            <option value="my_course_supervision">Under My Course Supervision</option>
          </select>
          <select
            value={selectedProposalId || ""}
            onChange={(e) => setSelectedProposalId(e.target.value)}
            className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-1 rounded-md focus:ring-2 focus:ring-green-300 focus:outline-none text-sm font-medium"
          >
            <option value="" disabled>
              Select Proposal
            </option>
            {proposals?.map((prop: any) => (
              <option key={prop._id} value={prop._id}>
                {prop.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-950 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex mb-3 ${
              msg.sender._id === (user as any)?._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl shadow ${
                msg.sender._id === (user as any)?._id
                  ? "bg-[#50C878] text-white rounded-br-none"
                  : "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-none"
              }`}
            >
              <p className="font-semibold text-sm mb-1">{msg.sender.name}</p>
              {msg.content && <p className="text-base">{msg.content}</p>}
              {msg.fileUrl && (
                <a
                  href={msg.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm mt-2 underline text-blue-200"
                >
                  {msg.fileType === "image" ? (
                    <img
                      src={msg.fileUrl}
                      alt="chat image"
                      className="max-w-[180px] rounded-md mt-1"
                    />
                  ) : (
                    "📎 Download file"
                  )}
                </a>
              )}
              <p className={`text-xs mt-1 ${msg.sender._id === (user as any)?._id ? 'text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2 focus:ring-2 focus:ring-[#50C878] focus:outline-none text-gray-700 dark:text-gray-200"
        />
        <input
          type="file"
          onChange={handleFileChange}
          id="file-upload"
          className="hidden dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 dark:placeholder-gray-500"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 dark:text-gray-200 font-medium px-3 py-2 rounded-full mr-2"
        >
          📎
        </label>
        <button
          onClick={handleSendMessage}
          className="bg-[#50C878] hover:bg-[#3ea764] text-white font-semibold px-5 py-2 rounded-full transition-all"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default SupervisorChatPage;
