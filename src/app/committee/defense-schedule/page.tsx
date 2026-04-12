'use client';

import React, { useState } from 'react';
import {
  useGetRoomsQuery,
  useAddRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useGetScheduleSlotsQuery,
  useAddScheduleSlotMutation,
  useUpdateScheduleSlotMutation,
  useDeleteScheduleSlotMutation,
} from '@/store/features/apiSlice';
import Loader from '@/components/Loader';
import { Plus, Edit2, Trash2, MapPin, Clock, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// --- RoomManager Component ---
export const RoomManager = () => {
  const { data: rooms, isLoading } = useGetRoomsQuery();
  const [addRoom] = useAddRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', capacity: 5 });

  const handleOpenModal = (room: any = null) => {
    setIsModalOpen(true);
    if (room) {
      setIsEditing(true);
      setCurrentRoom(room);
      setFormData({ name: room.name, capacity: room.capacity });
    } else {
      setIsEditing(false);
      setCurrentRoom(null);
      setFormData({ name: '', capacity: 5 });
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) await updateRoom({ id: currentRoom._id, ...formData });
    else await addRoom(formData);
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      await deleteRoom(id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-10">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center">
            <MapPin className="mr-2 text-green-500" size={24} /> Room Manager
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium italic">Configure venue capacity for defenses</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 transform hover:scale-[1.02] active:scale-100"
        >
          <Plus size={20} /> Add New Room
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50">
              <h3 className="text-2xl font-bold text-gray-800">{isEditing ? 'Update Room' : 'New Room Registration'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Internal Room Designation</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange} 
                  placeholder="e.g. Lab 402, Seminar Hall"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all font-semibold" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Max Group Capacity</label>
                <input 
                  type="number" name="capacity" value={formData.capacity} onChange={handleChange} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none font-bold" 
                  required min={1} 
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-green-600 text-white font-extrabold rounded-xl hover:bg-green-700 shadow-xl transition-all">
                  {isEditing ? 'Confirm Changes' : 'Initialize Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center">
            <Loader />
            <p className="text-gray-400 font-bold mt-4">Syncing rooms...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-5 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Designation</th>
                <th className="py-5 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Load Capacity</th>
                <th className="py-5 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rooms?.map((room: any) => (
                <tr key={room._id} className="hover:bg-green-50/20 transition-all group">
                  <td className="py-5 px-8 font-extrabold text-gray-800 group-hover:text-green-700">{room.name}</td>
                  <td className="py-5 px-8 text-center">
                    <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-extrabold border border-green-200 shadow-sm">
                      {room.capacity} Groups
                    </span>
                  </td>
                  <td className="py-5 px-8 text-right space-x-6">
                    <button onClick={() => handleOpenModal(room)} className="text-gray-400 hover:text-green-600 transition-all"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(room._id)} className="text-gray-400 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// --- ScheduleManager Component ---
export const ScheduleManager = () => {
  const { data: scheduleSlots, isLoading } = useGetScheduleSlotsQuery();
  const [addScheduleSlot] = useAddScheduleSlotMutation();
  const [updateScheduleSlot] = useUpdateScheduleSlotMutation();
  const [deleteScheduleSlot] = useDeleteScheduleSlotMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<any>(null);
  const [formData, setFormData] = useState({ date: '', startTime: '', endTime: '' });

  const handleOpenModal = (slot: any = null) => {
    setIsModalOpen(true);
    if (slot) {
      setIsEditing(true);
      setCurrentSlot(slot);
      setFormData({
        date: new Date(slot.date).toISOString().split('T')[0],
        startTime: slot.startTime,
        endTime: slot.endTime
      });
    } else {
      setIsEditing(false);
      setCurrentSlot(null);
      setFormData({ date: '', startTime: '', endTime: '' });
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) await updateScheduleSlot({ id: currentSlot._id, ...formData });
    else await addScheduleSlot(formData);
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this schedule slot?')) {
      await deleteScheduleSlot(id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center">
            <Clock className="mr-2 text-blue-500" size={24} /> Schedule Slots
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium italic">Define active timelines for defense sessions</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 transform hover:scale-[1.02] active:scale-100"
        >
          <Plus size={20} /> New Time Slot
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50">
              <h3 className="text-2xl font-bold text-gray-800">{isEditing ? 'Modify Slot' : 'Create Time Slot'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Calendar Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold" required />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Start Time</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">End Time</label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" required />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-blue-600 text-white font-extrabold rounded-xl hover:bg-blue-700 shadow-xl transition-all">
                  {isEditing ? 'Confirm Changes' : 'Initialize Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-5 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Event Date</th>
              <th className="py-5 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Duration</th>
              <th className="py-5 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {scheduleSlots?.map((slot: any) => (
              <tr key={slot._id} className="hover:bg-blue-50/20 transition-all group">
                <td className="py-5 px-8 text-gray-800 font-extrabold group-hover:text-blue-700">
                  {new Date(slot.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </td>
                <td className="py-5 px-8 text-center">
                  <span className="inline-flex items-center bg-blue-50 text-blue-700 px-5 py-2 rounded-xl text-sm font-extrabold border border-blue-100 shadow-sm">
                    {slot.startTime} — {slot.endTime}
                  </span>
                </td>
                <td className="py-5 px-8 text-right space-x-6">
                   <button onClick={() => handleOpenModal(slot)} className="text-gray-400 hover:text-blue-600 transition-all"><Edit2 size={18} /></button>
                   <button onClick={() => handleDelete(slot._id)} className="text-gray-400 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main DefenseSchedule Component ---
const CommitteeDefenseSchedulePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center">
                <Calendar className="mr-4 text-green-600" size={40} />
                Global Defense Schedule
            </h1>
            <p className="text-gray-500 mt-2 font-bold text-lg flex items-center italic">
                Strategic oversight of academic assessment timelines and venues
            </p>
          </div>
          <Link 
            href="/committee/defense-schedule/create" 
            className="group bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-2xl font-black transition-all shadow-2xl flex items-center gap-3 transform hover:scale-[1.03] active:scale-100"
          >
            Create Board Configuration <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </header>

        <div className="space-y-12">
          <RoomManager />
          <ScheduleManager />
        </div>
      </div>
    </div>
  );
};

export default CommitteeDefenseSchedulePage;
