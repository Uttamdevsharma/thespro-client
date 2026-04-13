'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast.success('Your message has been sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitting(false);
    };

    const contactMethods = [
        {
            icon: Mail,
            title: 'Email Us',
            value: 'support@thespro.edu',
            desc: 'Response within 24 hours',
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            icon: Phone,
            title: 'Call Us',
            value: '+1 (555) 000-1234',
            desc: 'Mon - Fri, 9am - 5pm',
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
        {
            icon: MapPin,
            title: 'Our Office',
            value: 'Academic Block A, Level 4',
            desc: 'University Campus Center',
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-32 pb-20 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center px-4 py-2 bg-[#50C878]/10 text-[#50C878] rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6">
                        Contact Support
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-gray-50 tracking-tight mb-6">
                        Get In <span className="text-[#50C878]">Touch</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold text-lg max-w-2xl mx-auto">
                        Have questions about the system or need technical assistance? Our team is 
                        here to help you navigate your academic journey.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* Left: Contact Info */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-10 shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden relative">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 -z-0" />
                             
                             <div className="relative z-10 space-y-10">
                                {contactMethods.map((method, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className={`w-14 h-14 ${method.bg} ${method.color} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                            <method.icon size={28} />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{method.title}</h4>
                                            <p className="text-xl font-black text-gray-900 dark:text-gray-50">{method.value}</p>
                                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-1">{method.desc}</p>
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-10 border-t border-gray-50 dark:border-gray-800/50">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
                                            <Globe className="text-[#50C878]" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900 dark:text-gray-50">Global Digital Portal</p>
                                            <p className="text-xs font-bold text-gray-400">Accessible globally 24/7</p>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>

                        {/* Additional Help Card */}
                        <div className="bg-gradient-to-br from-[#50C878] to-[#45b66d] rounded-[3rem] p-10 text-white shadow-2xl shadow-green-100 relative overflow-hidden">
                            <MessageCircle className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10" />
                            <h3 className="text-2xl font-black mb-4">Live Support?</h3>
                            <p className="font-bold text-green-50 opacity-90 mb-6">
                                Join our community discord or telegram for instant answers from the research committee.
                            </p>
                            <button className="px-8 py-3 bg-white dark:bg-gray-900 text-[#50C878] rounded-xl font-black text-sm uppercase tracking-widest hover:bg-green-50 transition-colors">
                                Join Now
                            </button>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-10 lg:p-14 shadow-2xl border border-gray-100 dark:border-gray-800">
                            <div className="mb-10">
                                <h3 className="text-3xl font-black text-gray-900 dark:text-gray-50 mb-2">Send us a message</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-bold">We handle every inquiry with specialized care.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Your Name</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-950 border-none rounded-2xl focus:ring-4 focus:ring-green-100 text-gray-800 dark:text-gray-100 font-bold transition-all placeholder:text-gray-400"
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-950 border-none rounded-2xl focus:ring-4 focus:ring-green-100 text-gray-800 dark:text-gray-100 font-bold transition-all placeholder:text-gray-400"
                                            placeholder="yourname@example.com"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-950 border-none rounded-2xl focus:ring-4 focus:ring-green-100 text-gray-800 dark:text-gray-100 font-bold transition-all placeholder:text-gray-400"
                                        placeholder="How can we help you?"
                                        value={formData.subject}
                                        onChange={e => setFormData({...formData, subject: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                                    <textarea 
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-950 border-none rounded-2xl focus:ring-4 focus:ring-green-100 text-gray-800 dark:text-gray-100 font-bold transition-all placeholder:text-gray-400 min-h-[150px] resize-none"
                                        placeholder="Tell us about your concern..."
                                        value={formData.message}
                                        onChange={e => setFormData({...formData, message: e.target.value})}
                                        required
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center space-x-3 py-5 bg-[#50C878] text-white font-black rounded-2xl shadow-xl shadow-green-100 hover:bg-green-600 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <Clock className="animate-spin" size={20} />
                                            Sending...
                                        </span>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            <span className="text-lg">Send Message</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
