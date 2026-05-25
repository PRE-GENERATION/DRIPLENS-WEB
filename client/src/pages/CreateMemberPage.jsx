import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, UserPlus, Users, Info } from 'lucide-react';

export default function CreateMemberPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'csv'

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Member',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulation of API Call
    setTimeout(() => {
      setLoading(false);
      navigate(-1);
    }, 1000);
  };

  const handleCsvSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulation of API Call
    setTimeout(() => {
      setLoading(false);
      navigate(-1);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Create Member — Driplens</title>
      </Helmet>

      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white border-b-2 border-black px-8 py-4 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-[#0044ff]">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-sm font-black uppercase tracking-[0.3em]">Create Member</h1>
        </div>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      <div className="max-w-4xl mx-auto p-8 md:p-16">
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Add a Team Member</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Manually add a member or bulk import via CSV</p>
          </div>

          <div className="flex border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'manual' ? 'border-b-4 border-black text-black' : 'text-gray-400 hover:text-black'
              }`}
            >
              <UserPlus size={16} />
              Manual Entry
            </button>
            <button
              onClick={() => setActiveTab('csv')}
              className={`flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'csv' ? 'border-b-4 border-black text-black' : 'text-gray-400 hover:text-black'
              }`}
            >
              <Users size={16} />
              CSV Import
            </button>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'manual' && (
              <form onSubmit={handleManualSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">First Name</label>
                    <input 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Jane"
                      className="w-full p-4 border-2 border-black font-bold outline-none focus:border-[#0044ff]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Last Name</label>
                    <input 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full p-4 border-2 border-black font-bold outline-none focus:border-[#0044ff]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className="w-full p-4 border-2 border-black font-bold outline-none focus:border-[#0044ff]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Role</label>
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-black font-bold outline-none focus:border-[#0044ff] bg-white cursor-pointer"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Member">Member</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <div className="pt-8 flex justify-end">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-12 py-4 text-xs font-black uppercase tracking-widest border-2 border-black hover:bg-[#0044ff] hover:border-[#0044ff] transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none active:translate-y-1"
                  >
                    {loading ? 'Saving...' : 'Save Member'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'csv' && (
              <form onSubmit={handleCsvSubmit} className="space-y-8">
                <div className="border-4 border-dashed border-gray-200 p-16 flex flex-col items-center justify-center space-y-4 hover:border-[#0044ff] transition-all cursor-pointer bg-gray-50/50">
                  <Upload size={48} className="text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm font-black uppercase tracking-widest">Click to upload CSV file</p>
                    <p className="text-xs font-bold text-gray-400 mt-2">or drag and drop here</p>
                  </div>
                  <input type="file" accept=".csv" className="hidden" id="csv-upload" />
                  <label htmlFor="csv-upload" className="mt-4 px-8 py-3 bg-white border-2 border-black text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-black hover:text-white transition-all">
                    Browse Files
                  </label>
                </div>

                <div className="flex items-start gap-4 p-6 bg-blue-50/50 border-2 border-[#0044ff]/20">
                  <Info size={24} className="text-[#0044ff] shrink-0" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#0044ff]">CSV Formatting Tips</h4>
                    <p className="text-xs font-bold text-gray-600 mt-2">Your CSV should include columns for: FirstName, LastName, Email, and Role. Ensure the first row contains these exact headers.</p>
                  </div>
                </div>

                <div className="pt-8 flex justify-end">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-12 py-4 text-xs font-black uppercase tracking-widest border-2 border-black hover:bg-[#0044ff] hover:border-[#0044ff] transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none active:translate-y-1"
                  >
                    {loading ? 'Importing...' : 'Import Members'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
