'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChatWithAIMutation } from '@/store/features/apiSlice';
import { Send, X, RotateCcw, Sparkles, User } from 'lucide-react';
import toast from 'react-hot-toast';

const AIChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
    const [chatWithAI, { isLoading }] = useChatWithAIMutation();
    const scrollRef = useRef<HTMLDivElement>(null);

    const quickQuestions = [
        "How do I submit a proposal?",
        "What are Research Cells?",
        "How can I find a supervisor?",
        "Tell me about ThesPro."
    ];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory, isLoading]);

    const handleSend = async (customMessage?: string) => {
        const textToSend = customMessage || message;
        if (!textToSend.trim()) return;

        const userMessage = textToSend.trim();
        if (!customMessage) setMessage('');
        
        setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);

        try {
            const result = await chatWithAI({ 
                message: userMessage, 
                chatHistory 
            }).unwrap();
            
            setChatHistory(prev => [...prev, { role: 'assistant', content: result.response }]);
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to get response from AI');
        }
    };

    const resetChat = () => {
        setChatHistory([]);
        toast.success('Conversation reset');
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {/* Sticky Floating Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-gradient-to-tr from-blue-700 to-blue-500 rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(37,99,235,0.4)] hover:scale-110 transition-all duration-300 group active:scale-95"
                >
                    <div className="relative">
                        <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                    </div>
                </button>
            )}

            {/* Chat Panel */}
            {isOpen && (
                <div className="w-[380px] md:w-[420px] h-[650px] max-h-[calc(100vh-100px)] bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-500 origin-bottom-right transition-colors duration-300">
                    
                    {/* Premium Header */}
                    <div className="px-6 py-7 bg-blue-600 text-white relative">
                        {/* Decorative background circle */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white dark:bg-gray-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white dark:bg-gray-900/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                    <Sparkles size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight leading-none mb-1">ThesAI</h3>
                                    <p className="text-[11px] text-blue-100 font-bold uppercase tracking-widest">
                                        ThesPro AI Assistant
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button 
                                    onClick={resetChat} 
                                    className="p-2 hover:bg-white dark:bg-gray-900/10 rounded-xl transition-colors text-blue-100 hover:text-white"
                                    title="Reset Chat"
                                >
                                    <RotateCcw size={20} />
                                </button>
                                <button 
                                    onClick={() => setIsOpen(false)} 
                                    className="p-2 hover:bg-white dark:bg-gray-900/10 rounded-xl transition-colors text-blue-100 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Status Bar */}
                    <div className="px-6 py-2 bg-blue-50/50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/50 flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                            AI Online · Powered by Gemini
                        </span>
                    </div>

                    {/* Chat Body */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-gray-900 custom-scrollbar">
                        {/* Initial Message */}
                        <div className="flex justify-start">
                            <div className="flex space-x-3 max-w-[90%]">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white shadow-lg">
                                    <Sparkles size={14} />
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded-3xl rounded-tl-none text-sm font-medium leading-relaxed">
                                        Hi! 👋 I'm **ThesAI**, your professional academic assistant. I'm here to help you navigate ThesPro and streamline your research journey.
                                    </div>

                                    {/* Quick Questions Section */}
                                    {chatHistory.length === 0 && (
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">
                                                Quick Suggestions:
                                            </p>
                                            <div className="space-y-2">
                                                {quickQuestions.map((q, i) => (
                                                    <button 
                                                        key={i}
                                                        onClick={() => handleSend(q)}
                                                        className="w-full text-left px-5 py-3 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:border-blue-200 dark:hover:border-gray-700 hover:text-blue-700 dark:hover:text-blue-400 transition-all active:scale-[0.98]"
                                                    >
                                                        {q}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Message History */}
                        {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex space-x-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white shadow-lg ${
                                        msg.role === 'user' ? 'bg-gray-800' : 'bg-blue-600'
                                    }`}>
                                        {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                                    </div>
                                    <div className={`p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-blue-600 text-white rounded-tr-none' 
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none flex items-center space-x-1">
                                    <div className="w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" />
                                    <div className="w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Modern Input Area */}
                    <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800">
                        <form 
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="bg-gray-50 dark:bg-gray-800 rounded-[2rem] p-1 flex items-center border border-gray-100 dark:border-gray-700 focus-within:border-blue-300 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100/50 dark:focus-within:ring-blue-900/50 transition-all"
                        >
                            <input 
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Ask ThesAI anything..."
                                className="flex-grow bg-transparent px-5 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none"
                                disabled={isLoading}
                            />
                            <button 
                                type="submit"
                                disabled={!message.trim() || isLoading}
                                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all hover:scale-105 active:scale-95"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                        <p className="text-[10px] text-center text-gray-400 mt-4 font-bold uppercase tracking-widest">
                            ThesAI can make mistakes. Verify important info.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIChatBot;
