'use client';

import React, { useState } from "react";
import { useAddTeacherMutation } from "@/store/features/apiSlice";
import toast from 'react-hot-toast';
import { User, Mail, Lock, UserPlus, Loader2, Sparkles, ShieldCheck } from "lucide-react";

const CommitteeAddTeacherPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [addTeacher, { isLoading }] = useAddTeacherMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTeacher({ name, email, password, role: "supervisor" }).unwrap();
      toast.success("Faculty member registered successfully!");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Internal registration failed");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-green-100 text-green-700 rounded-2xl shadow-sm border border-green-50">
                <UserPlus size={32} />
            </div>
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Faculty Registration</h2>
                <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Onboard new supervisor to the system</p>
            </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Sparkles size={120} className="text-green-500" />
            </div>

            <div className="bg-gray-50/50 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-green-600" />
                    <span className="text-sm font-black text-gray-700 uppercase tracking-tighter">Secure Credential Setup</span>
                </div>
                <span className="text-[10px] font-black bg-gray-200 text-gray-500 px-2 py-0.5 rounded-md uppercase tracking-widest">Step 01/01</span>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div>
                    <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-widest ml-1">
                        Professional Identity (Full Name)
                    </label>
                    <div className="relative group">
                        <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 group-focus-within:text-green-500 transition-colors">
                            <User size={20} />
                        </span>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Tanpia Tasnim"
                            className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-400 focus:bg-white outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300 shadow-sm"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-widest ml-1">
                        Academic Email Correspondence
                    </label>
                    <div className="relative group">
                        <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 group-focus-within:text-green-500 transition-colors">
                            <Mail size={20} />
                        </span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@cse.green.edu.bd"
                            className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-400 focus:bg-white outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300 shadow-sm"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-widest ml-1">
                        Default Access Token (Password)
                    </label>
                    <div className="relative group">
                        <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 group-focus-within:text-green-500 transition-colors">
                            <Lock size={20} />
                        </span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-400 focus:bg-white outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300 shadow-sm"
                            required
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-3 py-5 px-6 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl shadow-xl shadow-green-100 hover:shadow-2xl hover:shadow-green-200 transition-all transform active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={24} />
                                Synchronizing...
                            </>
                        ) : (
                            <>
                                <UserPlus size={24} />
                                Finalize Registration
                            </>
                        )}
                    </button>
                    <p className="mt-6 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-60">
                        System automatically assigns 'supervisor' role for all new faculty entries.
                    </p>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default CommitteeAddTeacherPage;
