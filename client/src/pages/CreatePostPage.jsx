import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, FileText } from 'lucide-react';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    status: 'draft',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulation of API Call
    setTimeout(() => {
      setLoading(false);
      navigate(-1);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Create Post — Driplens</title>
      </Helmet>

      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white border-b-2 border-black px-8 py-4 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-[#0044ff]">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-sm font-black uppercase tracking-[0.3em]">Create Post</h1>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white px-8 py-2 text-xs font-black uppercase tracking-widest border-2 border-black hover:bg-[#0044ff] hover:border-[#0044ff] transition-all disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish'}
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-8 md:p-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <h2 className="text-4xl font-black uppercase tracking-tighter">New Post</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dive into the editor and start creating</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Cover Image Upload Area */}
            <div className="border-4 border-dashed border-gray-200 h-64 flex flex-col items-center justify-center space-y-4 hover:border-black transition-all cursor-pointer bg-gray-50/50 group">
              <div className="w-16 h-16 bg-white border-2 border-gray-200 flex items-center justify-center group-hover:border-black transition-all">
                <ImageIcon size={32} className="text-gray-400 group-hover:text-black transition-all" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black uppercase tracking-widest">Add Cover Image</p>
                <p className="text-xs font-bold text-gray-400 mt-2">1200 x 630px recommended</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Post Title</label>
              <input 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Give your post a catchy title"
                className="w-full p-6 border-2 border-black font-black text-3xl outline-none focus:border-[#0044ff] placeholder:text-gray-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Content</label>
              <div className="relative">
                <textarea 
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your story here..."
                  rows={15}
                  className="w-full p-6 pt-16 border-2 border-black font-bold outline-none focus:border-[#0044ff] text-lg resize-y"
                  required
                />
                {/* Formatting Toolbar Simulation */}
                <div className="absolute top-0 left-0 right-0 h-12 bg-gray-50 border-b-2 border-black flex items-center px-4 gap-4">
                  <FileText size={16} className="text-gray-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Editor Tools</span>
                  <div className="flex gap-2 ml-auto">
                    {['B', 'I', 'U'].map(btn => (
                      <button key={btn} type="button" className="w-8 h-8 flex items-center justify-center border-2 border-transparent hover:border-black font-black transition-all">
                        {btn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tags (comma separated)</label>
                <input 
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g. Design, Tech, Update"
                  className="w-full p-4 border-2 border-black font-bold outline-none focus:border-[#0044ff]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-4 border-2 border-black font-bold outline-none focus:border-[#0044ff] bg-white cursor-pointer"
                >
                  <option value="draft">Save as Draft</option>
                  <option value="published">Publish Immediately</option>
                  <option value="scheduled">Schedule for later</option>
                </select>
              </div>
            </div>
            
            <div className="pt-8 flex justify-end gap-4">
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-4 text-xs font-black uppercase tracking-widest hover:text-gray-500 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="bg-[#0044ff] text-white px-12 py-4 text-xs font-black uppercase tracking-widest border-2 border-[#0044ff] hover:bg-black hover:border-black transition-all shadow-[8px_8px_0px_0px_rgba(0,68,255,0.2)] hover:shadow-none active:translate-y-1"
              >
                {loading ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
