'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Globe, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

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
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: '+1 (555) 000-1234',
      desc: 'Mon - Fri, 9am - 5pm',
      iconBg: 'bg-violet-100 dark:bg-violet-900/30',
      iconColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      icon: MapPin,
      title: 'Our Office',
      value: 'Academic Block A, Level 4',
      desc: 'University Campus Center',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6">
            <MessageCircle size={14} />
            Contact Support
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-gray-50 tracking-tight mb-6">
            Get In <span className="text-indigo-600 dark:text-indigo-400">Touch</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold text-lg max-w-2xl mx-auto">
            Have questions about the system or need technical assistance? Our team is 
            here to help you navigate your academic journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[3rem] p-10 shadow-xl border border-gray-100/80 dark:border-gray-800/80 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-950/50 rounded-full -mr-16 -mt-16" />

              <div className="relative space-y-10">
                {contactMethods.map((method, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div
                      className={`w-14 h-14 ${method.iconBg} ${method.iconColor} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <method.icon size={28} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        {method.title}
                      </h4>
                      <p className="text-xl font-black text-gray-900 dark:text-gray-50">{method.value}</p>
                      <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-1">{method.desc}</p>
                    </div>
                  </div>
                ))}

                <div className="pt-10 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
                      <Globe className="text-white" size={20} />
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
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-200/50 dark:shadow-indigo-900/30 relative overflow-hidden">
              <MessageCircle className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10" />
              <h3 className="text-2xl font-black mb-4">Need Live Support?</h3>
              <p className="font-bold text-white/80 mb-6">
                Join our community discord or telegram for instant answers from the research committee.
              </p>
              <button className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all hover:shadow-xl active:scale-[0.98] cursor-pointer">
                Join Now
              </button>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[3rem] p-10 lg:p-14 shadow-2xl border border-gray-100/80 dark:border-gray-800/80">
              <div className="mb-10">
                <h3 className="text-3xl font-black text-gray-900 dark:text-gray-50 mb-2">Send us a message</h3>
                <p className="text-gray-500 dark:text-gray-400 font-bold">
                  We handle every inquiry with specialized care.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50/80 dark:bg-gray-950/80 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="yourname@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50/80 dark:bg-gray-950/80 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50/80 dark:bg-gray-950/80 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Message
                  </label>
                  <textarea
                    placeholder="Tell us about your concern..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full px-6 py-4 bg-gray-50/80 dark:bg-gray-950/80 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 py-5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200/50 dark:shadow-indigo-900/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 hover:shadow-2xl hover:shadow-indigo-200/60 dark:hover:shadow-indigo-900/40 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Send Message</span>
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
