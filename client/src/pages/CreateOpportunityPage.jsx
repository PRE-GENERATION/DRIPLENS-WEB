import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Plus, Info, Users, Box, CreditCard, Calendar, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';

const SECTIONS = [
  { id: 'basic', label: 'Basic Info', icon: Info },
  { id: 'requirements', label: 'Creator Requirements', icon: Users },
  { id: 'deliverables', label: 'Deliverables', icon: Box },
  { id: 'budget', label: 'Budget', icon: CreditCard },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'extra', label: 'Extra Requirements', icon: ShieldCheck }
];

export default function CreateOpportunityPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const sectionRefs = {
    basic: useRef(null),
    requirements: useRef(null),
    deliverables: useRef(null),
    budget: useRef(null),
    timeline: useRef(null),
    extra: useRef(null)
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    campaign_goal: '',
    city: '',
    language: [],
    niche: [],
    min_followers: 0,
    max_followers: '',
    gender_preference: 'Any',
    num_reels: 0,
    num_stories: 0,
    num_photos: 0,
    budget_type: 'Paid',
    budget_amount: '',
    application_deadline: '',
    content_deadline: '',
    raw_files_needed: false,
    num_revisions: 1,
    usage_rights: false,
    usage_rights_details: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({
      ...p,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleArray = (name, value) => {
    setFormData(p => {
      const current = p[name];
      if (current.includes(value)) {
        return { ...p, [name]: current.filter(item => item !== value) };
      }
      return { ...p, [name]: [...current, value] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/opportunities', formData);
      navigate('/dashboard/brand');
    } catch (err) {
      console.error('Failed to create opportunity:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id) => {
    sectionRefs[id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Post Opportunity — Driplens</title>
      </Helmet>

      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white border-b-2 border-black px-8 py-4 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-[#0044ff]">
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-sm font-black uppercase tracking-[0.3em]">Create Opportunity</h1>
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="bg-black text-white px-8 py-2 text-xs font-black uppercase tracking-widest border-2 border-black hover:bg-[#0044ff] hover:border-[#0044ff] transition-all disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Publish'}
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row">
        {/* Left Mini-Nav */}
        <aside className="md:w-64 md:h-[calc(100vh-64px)] md:sticky md:top-16 p-8 border-r border-gray-100 hidden md:block">
          <nav className="space-y-8">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className={`flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all text-left ${
                  activeSection === s.id ? 'text-[#0044ff]' : 'text-gray-300 hover:text-black'
                }`}
              >
                <s.icon size={16} />
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Scrollable Form Area */}
        <div className="flex-1 p-8 md:p-16 space-y-32 mb-40">
          <form onSubmit={handleSubmit} className="space-y-32">
            
            {/* Section: Basic Info */}
            <section ref={sectionRefs.basic} className="space-y-12">
              <h2 className="text-3xl font-black uppercase tracking-tighter sticky top-24 bg-white/90 backdrop-blur-sm py-4 border-b border-gray-100 z-10">Basic Info</h2>
              <div className="space-y-8 max-w-2xl">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Campaign Title</label>
                  <input 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Summer Collection 2026"
                    className="w-full p-4 border-2 border-black font-bold outline-none focus:border-[#0044ff]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Brand Introduction</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell creators about your brand story..."
                    className="w-full p-4 border-2 border-black font-bold outline-none focus:border-[#0044ff] resize-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Campaign Goal</label>
                  <textarea 
                    name="campaign_goal"
                    value={formData.campaign_goal}
                    onChange={handleChange}
                    rows={4}
                    placeholder="What are you trying to achieve? (e.g. 100k views, brand awareness)"
                    className="w-full p-4 border-2 border-black font-bold outline-none focus:border-[#0044ff] resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Section: Creator Requirements */}
            <section ref={sectionRefs.requirements} className="space-y-12">
              <h2 className="text-3xl font-black uppercase tracking-tighter sticky top-24 bg-white/90 backdrop-blur-sm py-4 border-b border-gray-100 z-10">Creator Requirements</h2>
              <div className="space-y-8 max-w-2xl">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">City</label>
                    <input 
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai, PAN India"
                      className="w-full p-4 border-2 border-black font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Gender Preference</label>
                    <select 
                      name="gender_preference"
                      value={formData.gender_preference}
                      onChange={handleChange}
                      className="w-full p-4 border-2 border-black font-bold bg-white"
                    >
                      <option>Any</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Non-binary</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Niche</label>
                  <div className="flex flex-wrap gap-2">
                    {['Food', 'Fashion', 'Fitness', 'Travel', 'Tech', 'Lifestyle', 'Beauty'].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => toggleArray('niche', n)}
                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border-2 transition-all ${
                          formData.niche.includes(n) ? 'bg-black border-black text-white' : 'border-gray-100 text-gray-400 hover:border-black'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Followers Range</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="number"
                      name="min_followers"
                      value={formData.min_followers}
                      onChange={handleChange}
                      placeholder="Min (e.g. 10000)"
                      className="w-full p-4 border-2 border-black font-bold"
                    />
                    <input 
                      type="number"
                      name="max_followers"
                      value={formData.max_followers}
                      onChange={handleChange}
                      placeholder="Max (optional)"
                      className="w-full p-4 border-2 border-black font-bold"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Deliverables */}
            <section ref={sectionRefs.deliverables} className="space-y-12">
              <h2 className="text-3xl font-black uppercase tracking-tighter sticky top-24 bg-white/90 backdrop-blur-sm py-4 border-b border-gray-100 z-10">Deliverables</h2>
              <div className="grid grid-cols-3 gap-8 max-w-2xl">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reels</label>
                  <input type="number" name="num_reels" value={formData.num_reels} onChange={handleChange} className="w-full p-4 border-2 border-black font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Stories</label>
                  <input type="number" name="num_stories" value={formData.num_stories} onChange={handleChange} className="w-full p-4 border-2 border-black font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Photos</label>
                  <input type="number" name="num_photos" value={formData.num_photos} onChange={handleChange} className="w-full p-4 border-2 border-black font-bold" />
                </div>
              </div>
            </section>

            {/* Section: Budget */}
            <section ref={sectionRefs.budget} className="space-y-12">
              <h2 className="text-3xl font-black uppercase tracking-tighter sticky top-24 bg-white/90 backdrop-blur-sm py-4 border-b border-gray-100 z-10">Budget</h2>
              <div className="space-y-8 max-w-2xl">
                <div className="flex gap-2">
                  {['Paid', 'Barter', 'Paid + Barter'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, budget_type: type }))}
                      className={`flex-1 p-4 text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                        formData.budget_type === type ? 'bg-black border-black text-white' : 'border-gray-100 text-gray-400 hover:border-black'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {formData.budget_type !== 'Barter' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Budget Amount (INR)</label>
                    <input 
                      type="number" 
                      name="budget_amount"
                      value={formData.budget_amount}
                      onChange={handleChange}
                      placeholder="e.g. 50000"
                      className="w-full p-4 border-2 border-black font-bold text-2xl"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Section: Timeline */}
            <section ref={sectionRefs.timeline} className="space-y-12">
              <h2 className="text-3xl font-black uppercase tracking-tighter sticky top-24 bg-white/90 backdrop-blur-sm py-4 border-b border-gray-100 z-10">Timeline</h2>
              <div className="grid grid-cols-2 gap-8 max-w-2xl">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Application Deadline</label>
                  <input type="date" name="application_deadline" value={formData.application_deadline} onChange={handleChange} className="w-full p-4 border-2 border-black font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Content Deadline</label>
                  <input type="date" name="content_deadline" value={formData.content_deadline} onChange={handleChange} className="w-full p-4 border-2 border-black font-bold" />
                </div>
              </div>
            </section>

            {/* Section: Extra Requirements */}
            <section ref={sectionRefs.extra} className="space-y-12">
              <h2 className="text-3xl font-black uppercase tracking-tighter sticky top-24 bg-white/90 backdrop-blur-sm py-4 border-b border-gray-100 z-10">Extra Requirements</h2>
              <div className="space-y-8 max-w-2xl">
                <div className="flex items-center justify-between p-6 border-2 border-gray-100 hover:border-black transition-all">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest">Raw Files Needed?</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Do you require the unedited footage?</p>
                  </div>
                  <input 
                    type="checkbox" 
                    name="raw_files_needed" 
                    checked={formData.raw_files_needed} 
                    onChange={handleChange}
                    className="w-6 h-6 accent-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Number of Revisions</label>
                  <input type="number" name="num_revisions" value={formData.num_revisions} onChange={handleChange} className="w-full p-4 border-2 border-black font-bold" />
                </div>
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-6 border-2 border-gray-100 hover:border-black transition-all">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest">Usage Rights</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Will you use this for paid ads/outdoor?</p>
                    </div>
                    <input 
                      type="checkbox" 
                      name="usage_rights" 
                      checked={formData.usage_rights} 
                      onChange={handleChange}
                      className="w-6 h-6 accent-black"
                    />
                  </div>
                  {formData.usage_rights && (
                    <input 
                      name="usage_rights_details"
                      value={formData.usage_rights_details}
                      onChange={handleChange}
                      placeholder="Specify duration and platforms..."
                      className="w-full p-4 border-2 border-black font-bold"
                    />
                  )}
                </div>
              </div>
            </section>

          </form>
        </div>
      </div>
    </div>
  );
}
