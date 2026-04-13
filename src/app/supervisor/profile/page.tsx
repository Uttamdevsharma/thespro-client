'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { useUpdateProfilePictureMutation, useUpdateSupervisorProfileMutation, useGetProfileQuery } from '@/store/features/apiSlice';
import { login } from '@/store/features/userSlice';
import toast from 'react-hot-toast';
import { Camera, Save, User as UserIcon, Book, Briefcase, GraduationCap } from 'lucide-react';

const SupervisorProfilePage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  const { data: profileData, refetch } = useGetProfileQuery();
  const [updateSupervisorProfile, { isLoading }] = useUpdateSupervisorProfileMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    education: '',
    experience: '',
    research: '',
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        education: profileData.education || '',
        experience: profileData.experience || '',
        research: profileData.research || '',
      });
      setPreviewImage(profileData.profilePicture || null);
    } else if (user) {
      setFormData({
        ...formData,
        name: user.name || '',
        email: user.email || '',
      });
      setPreviewImage(user.profilePicture || null);
    }
  }, [profileData, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('education', formData.education);
      submitData.append('experience', formData.experience);
      submitData.append('research', formData.research);
      
      if (selectedImage) {
        submitData.append('profileImage', selectedImage);
      }

      const updatedUser = await updateSupervisorProfile(submitData).unwrap();
      
      // Update Redux state with new user object including token
      const token = user?.token;
      dispatch(login({ ...updatedUser, token }));
      
      refetch();
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      toast.error(err?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-100 overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="h-32 bg-[#50C878] relative">
          <div className="absolute -bottom-16 left-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-white dark:bg-gray-900 p-2 shadow-lg shadow-gray-200">
                <div className="w-full h-full rounded-2xl bg-gray-50 dark:bg-gray-950 flex items-center justify-center overflow-hidden border-2 border-gray-100 dark:border-gray-800 position-relative group-hover:border-[#50C878] transition-colors">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-12 h-12 text-gray-300" />
                  )}
                  <label htmlFor="profileImage" className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">Change Image</span>
                  </label>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    className="hidden dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 dark:placeholder-gray-500"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 dark:text-gray-50 tracking-tight">Supervisor Profile</h1>
            <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Manage your professional information</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border-2 border-transparent text-gray-900 dark:text-gray-50 text-sm rounded-xl focus:ring-0 focus:border-[#50C878] focus:bg-white dark:focus:bg-gray-900 dark:bg-gray-900 transition-all font-bold placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-300" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-11 pr-4 py-3 bg-gray-100 border-2 border-transparent text-gray-500 dark:text-gray-400 text-sm rounded-xl font-bold cursor-not-allowed dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Educational Background</label>
              <div className="relative">
                <div className="absolute top-3 left-4 pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border-2 border-transparent text-gray-900 dark:text-gray-50 text-sm rounded-xl focus:ring-0 focus:border-[#50C878] focus:bg-white dark:focus:bg-gray-900 dark:bg-gray-900 transition-all font-medium placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                  placeholder="E.g., Ph.D. in Computer Science from University X"
                ></textarea>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Professional Experience</label>
              <div className="relative">
                <div className="absolute top-3 left-4 pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border-2 border-transparent text-gray-900 dark:text-gray-50 text-sm rounded-xl focus:ring-0 focus:border-[#50C878] focus:bg-white dark:focus:bg-gray-900 dark:bg-gray-900 transition-all font-medium placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                  placeholder="E.g., 10+ years teaching experience at University Y"
                ></textarea>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Research Interests</label>
              <div className="relative">
                <div className="absolute top-3 left-4 pointer-events-none">
                  <Book className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="research"
                  value={formData.research}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border-2 border-transparent text-gray-900 dark:text-gray-50 text-sm rounded-xl focus:ring-0 focus:border-[#50C878] focus:bg-white dark:focus:bg-gray-900 dark:bg-gray-900 transition-all font-medium placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                  placeholder="E.g., Artificial Intelligence, Machine Learning, Data Science"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-50 dark:border-gray-800/50">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3.5 bg-[#50C878] text-white text-sm font-black rounded-xl shadow-lg shadow-green-100 hover:bg-[#45b66d] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Profile Updates</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupervisorProfilePage;
