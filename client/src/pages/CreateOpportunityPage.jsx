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

  const handleNext = () => {
    const currentIndex = SECTIONS.findIndex(s => s.id === activeSection);
    if (currentIndex < SECTIONS.length - 1) {
      setActiveSection(SECTIONS[currentIndex + 1].id);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    const currentIndex = SECTIONS.findIndex(s => s.id === activeSection);
    if (currentIndex > 0) {
      setActiveSection(SECTIONS[currentIndex - 1].id);
      window.scrollTo(0, 0);
    }
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
        <div className="flex flex-col items-center">
          <h1 className="text-sm font-black uppercase tracking-[0.3em]">Create Opportunity</h1>
          <div className="text-[8px] font-bold text-[#0044ff] mt-1 tracking-widest uppercase">
            Step {SECTIONS.findIndex(s => s.id === activeSection) + 1} of {SECTIONS.length}
          </div>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="bg-black text-white px-8 py-2 text-xs font-black uppercase tracking-widest border-2 border-black hover:bg-[#0044ff] hover:border-[#0044ff] transition-all disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Publish'}
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        {/* Mobile Section Dropdown */}
        <div className="md:hidden px-8 py-4 bg-gray-50 border-b-2 border-black">
          <select 
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className="w-full p-4 border-2 border-black font-black uppercase tracking-widest text-[10px] bg-white"
          >
            {SECTIONS.map((s, idx) => (
              <option key={s.id} value={s.id}>
                Step {idx + 1}: {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Left Mini-Nav */}
        <aside className="md:w-72 p-8 border-r-2 border-gray-50 hidden md:block">
          <nav className="space-y-6">
            {SECTIONS.map((s, idx) => {
              const isActive = activeSection === s.id;
              const isCompleted = SECTIONS.findIndex(sec => sec.id === activeSection) > idx;
              
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-4 p-4 transition-all text-left border-l-4 ${
                    isActive 
                      ? 'border-[#0044ff] bg-blue-50/50 text-[#0044ff]' 
                      : 'border-transparent text-gray-400 hover:text-black'
                  }`}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-none border-2 transition-all ${
                    isActive ? 'border-[#0044ff] bg-[#0044ff] text-white' : 
                    isCompleted ? 'border-black bg-black text-white' : 'border-gray-200'
                  }`}>
                    {isCompleted ? <Check size={14} /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em]">{s.label}</div>
                    {isActive && <div className="text-[8px] font-bold uppercase tracking-widest opacity-60">Currently Editing</div>}
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Form Area */}
        <div className="flex-1 bg-gray-50/30">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <div className="flex-1 p-8 md:p-16 max-w-4xl">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                {/* Section: Basic Info */}
                {activeSection === 'basic' && (
                  <section className="space-y-12">
                    <div className="space-y-2">
                      <h2 className="text-4xl font-black uppercase tracking-tighter">Basic Info</h2>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Start with the essentials of your campaign</p>
                    </div>
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Campaign Title</label>
                        <input 
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g. Summer Collection 2026"
                          className="w-full p-6 border-2 border-black font-bold outline-none focus:border-[#0044ff] text-lg"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Brand Introduction</label>
                        <textarea 
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={6}
                          placeholder="Tell creators about your brand story..."
                          className="w-full p-6 border-2 border-black font-bold outline-none focus:border-[#0044ff] resize-none text-lg"
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
                          className="w-full p-6 border-2 border-black font-bold outline-none focus:border-[#0044ff] resize-none"
                        />
                      </div>
                    </div>
                  </section>
                )}

                {/* Section: Creator Requirements */}
                {activeSection === 'requirements' && (
                  <section className="space-y-12">
                    <div className="space-y-2">
                      <h2 className="text-4xl font-black uppercase tracking-tighter">Creator Requirements</h2>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Define your ideal creator profile</p>
                    </div>
                    <div className="space-y-8">
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
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Language</label>
                        <div className="flex flex-wrap gap-2">
                          {['Hindi', 'English', 'Marathi', 'Tamil', 'Telugu', 'Bengali', 'Gujarati'].map(l => (
                            <button
                              key={l}
                              type="button"
                              onClick={() => toggleArray('language', l)}
                              className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest border-2 transition-all ${
                                formData.language.includes(l) ? 'bg-black border-black text-white' : 'bg-white border-gray-100 text-gray-400 hover:border-black'
                              }`}
                            >
                              {l}
                            </button>
                          ))}
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
                              className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest border-2 transition-all ${
                                formData.niche.includes(n) ? 'bg-black border-black text-white' : 'bg-white border-gray-100 text-gray-400 hover:border-black'
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
                )}

                {/* Section: Deliverables */}
                {activeSection === 'deliverables' && (
                  <section className="space-y-12">
                    <div className="space-y-2">
                      <h2 className="text-4xl font-black uppercase tracking-tighter">Deliverables</h2>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">What exactly do you need from the creators?</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reels</label>
                        <input type="number" name="num_reels" value={formData.num_reels} onChange={handleChange} className="w-full p-6 border-2 border-black font-bold text-2xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Stories</label>
                        <input type="number" name="num_stories" value={formData.num_stories} onChange={handleChange} className="w-full p-6 border-2 border-black font-bold text-2xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Photos</label>
                        <input type="number" name="num_photos" value={formData.num_photos} onChange={handleChange} className="w-full p-6 border-2 border-black font-bold text-2xl" />
                      </div>
                    </div>
                  </section>
                )}

                {/* Section: Budget */}
                {activeSection === 'budget' && (
                  <section className="space-y-12">
                    <div className="space-y-2">
                      <h2 className="text-4xl font-black uppercase tracking-tighter">Budget</h2>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Set your compensation model</p>
                    </div>
                    <div className="space-y-8">
                      <div className="flex gap-4">
                        {['Paid', 'Barter', 'Paid + Barter'].map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, budget_type: type }))}
                            className={`flex-1 p-6 text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                              formData.budget_type === type ? 'bg-black border-black text-white' : 'bg-white border-gray-100 text-gray-400 hover:border-black'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      {formData.budget_type !== 'Barter' && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Budget Amount (INR)</label>
                          <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-2xl">₹</span>
                            <input 
                              type="number" 
                              name="budget_amount"
                              value={formData.budget_amount}
                              onChange={handleChange}
                              placeholder="e.g. 50000"
                              className="w-full p-6 pl-12 border-2 border-black font-bold text-3xl outline-none focus:border-[#0044ff]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Section: Timeline */}
                {activeSection === 'timeline' && (
                  <section className="space-y-12">
                    <div className="space-y-2">
                      <h2 className="text-4xl font-black uppercase tracking-tighter">Timeline</h2>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Important dates for the campaign</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Application Deadline</label>
                        <input type="date" name="application_deadline" value={formData.application_deadline} onChange={handleChange} className="w-full p-6 border-2 border-black font-bold text-lg" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Content Deadline</label>
                        <input type="date" name="content_deadline" value={formData.content_deadline} onChange={handleChange} className="w-full p-6 border-2 border-black font-bold text-lg" />
                      </div>
                    </div>
                  </section>
                )}

                {/* Section: Extra Requirements */}
                {activeSection === 'extra' && (
                  <section className="space-y-12">
                    <div className="space-y-2">
                      <h2 className="text-4xl font-black uppercase tracking-tighter">Extra Requirements</h2>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Final details and usage rights</p>
                    </div>
                    <div className="space-y-8">
                      <div className="flex items-center justify-between p-8 border-2 border-black bg-white">
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-widest">Raw Files Needed?</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Do you require the unedited footage?</p>
                        </div>
                        <input 
                          type="checkbox" 
                          name="raw_files_needed" 
                          checked={formData.raw_files_needed} 
                          onChange={handleChange}
                          className="w-8 h-8 accent-black cursor-pointer"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Number of Revisions</label>
                        <input type="number" name="num_revisions" value={formData.num_revisions} onChange={handleChange} className="w-full p-6 border-2 border-black font-bold text-xl" />
                      </div>
                      <div className="space-y-4">
                         <div className="flex items-center justify-between p-8 border-2 border-black bg-white">
                          <div>
                            <h4 className="text-sm font-black uppercase tracking-widest">Usage Rights</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Will you use this for paid ads/outdoor?</p>
                          </div>
                          <input 
                            type="checkbox" 
                            name="usage_rights" 
                            checked={formData.usage_rights} 
                            onChange={handleChange}
                            className="w-8 h-8 accent-black cursor-pointer"
                          />
                        </div>
                        {formData.usage_rights && (
                          <textarea 
                            name="usage_rights_details"
                            value={formData.usage_rights_details}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Specify duration and platforms (e.g. 6 months Instagram Ads)..."
                            className="w-full p-6 border-2 border-black font-bold outline-none focus:border-[#0044ff]"
                          />
                        )}
                      </div>
                    </div>
                  </section>
                )}
              </motion.div>
            </div>

            {/* Sticky Bottom Navigation */}
            <div className="mt-auto bg-white border-t-2 border-black p-8 sticky bottom-0 z-40">
              <div className="max-w-4xl flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={activeSection === SECTIONS[0].id}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-[#0044ff] disabled:opacity-30 disabled:hover:text-black transition-all"
                >
                  <ArrowLeft size={16} /> Previous Step
                </button>
                
                {activeSection === SECTIONS[SECTIONS.length - 1].id ? (
                  <button 
                    type="button"
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="bg-[#0044ff] text-white px-12 py-4 text-xs font-black uppercase tracking-widest border-2 border-[#0044ff] hover:bg-black hover:border-black transition-all shadow-[8px_8px_0px_0px_rgba(0,68,255,0.2)] hover:shadow-none active:translate-y-1"
                  >
                    {loading ? 'Publishing...' : 'Publish Opportunity'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-black text-white px-12 py-4 text-xs font-black uppercase tracking-widest border-2 border-black hover:bg-[#0044ff] hover:border-[#0044ff] transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none active:translate-y-1"
                  >
                    Continue to {SECTIONS[SECTIONS.findIndex(s => s.id === activeSection) + 1]?.label}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
