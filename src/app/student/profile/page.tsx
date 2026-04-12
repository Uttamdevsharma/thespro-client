'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const [loading, setLoading] = useState(true);

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get('http://localhost:5005/api/users/profile', config);
        setName(data.name || '');
        setEmail(data.email || '');
        setProfilePictureURL(data.profilePicture || '');
      } catch (error) {
        console.error("Error fetching user data: ", error);
        toast.error('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user || !user.token) {
      toast.error('No user logged in.');
      setLoading(false);
      return;
    }

    try {
      // Update name
      await axios.put('http://localhost:5005/api/users/profile', { name }, config);

      // Update password if newPassword is provided
      if (newPassword) {
        if (!currentPassword) {
          toast.error('Please enter your current password to update the new password.');
          setLoading(false);
          return;
        }
        await axios.put('http://localhost:5005/api/users/update-password', { currentPassword, newPassword }, config);
        toast.success('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
      }

      // Update profile picture
      if (profilePicture) {
        const formData = new FormData();
        formData.append('profilePicture', profilePicture);

        await axios.post('http://localhost:5005/api/users/profile-picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user?.token}`,
          },
        });
        // After successful upload, re-fetch user data to get the updated URL
        const { data: updatedUserData } = await axios.get('http://localhost:5005/api/users/profile', config);
        setProfilePictureURL(updatedUserData.profilePicture || '');
        toast.success('Profile picture updated successfully!');
      }

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error("Error updating profile: ", error);
      toast.error(`Failed to update profile: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !name) {
    return <Loader />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Your Profile</h1>
      <form onSubmit={handleUpdateProfile} className="space-y-6">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 mb-4">
            {profilePictureURL ? (
              <img 
                src={profilePictureURL} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-[#50C878] shadow-md" 
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-[#50C878] shadow-md">
                <span className="text-4xl text-gray-400 capitalize">{name.charAt(0)}</span>
              </div>
            )}
            <label 
              htmlFor="profilePicture" 
              className="absolute bottom-0 right-0 bg-[#50C878] text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-[#3ea764] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <input
                type="file"
                id="profilePicture"
                onChange={(e) => setProfilePicture(e.target.files ? e.target.files[0] : null)}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">Pick a profile picture</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-700"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 cursor-not-allowed text-gray-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-700"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-700"
                placeholder="Enter new password"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-lg shadow-md hover:from-green-500 hover:to-green-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Updating Profile...
              </>
            ) : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
