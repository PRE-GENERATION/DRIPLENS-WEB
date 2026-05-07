import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'video/mp4', 'video/quicktime', 'video/webm',
];
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB
const CATEGORIES = ['Cinematography', 'Photography', '3D Motion', 'Design', 'Illustration', 'Animation', 'Graphic Design', 'VFX'];

export default function UploadPage() {
  const [step, setStep] = useState(1); // 1: Project, 2: Upload
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  
  // New Project Form
  const [projectTitle, setProjectTitle] = useState('');
  const [projectCategory, setProjectCategory] = useState('Cinematography');
  const [projectDescription, setProjectDescription] = useState('');

  // Upload State
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/upload/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/upload/projects', {
        title: projectTitle,
        category: projectCategory,
        description: projectDescription
      });
      setProjects([res.data, ...projects]);
      setSelectedProjectId(res.data.id);
      setIsCreatingProject(false);
      setStep(2);
      setMessage({ type: 'success', text: 'Project created! Now add your media.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to create project' });
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileChange = (e) => {
    if (e.target.files) handleFiles(Array.from(e.target.files));
  };

  const handleFiles = (newFiles) => {
    const validFiles = [];
    const newPreviews = [];

    newFiles.forEach(file => {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setMessage({ type: 'error', text: `Skipped ${file.name}: Unsupported type.` });
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setMessage({ type: 'error', text: `Skipped ${file.name}: Too large.` });
        return;
      }
      validFiles.push(file);
      newPreviews.push({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' : 'image',
        name: file.name
      });
    });

    setFiles([...files, ...validFiles]);
    setPreviews([...previews, ...newPreviews]);
    setMessage({ type: '', text: '' });
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index].url);
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handlePublish = async () => {
    if (files.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one file.' });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('media', file));
    
    // Project metadata (inheriting from project for now as per simple workflow)
    const selectedProject = projects.find(p => p.id === selectedProjectId);
    formData.append('project_id', selectedProjectId);
    formData.append('title', selectedProject.title);
    formData.append('category', selectedProject.category);
    formData.append('description', selectedProject.description || '');

    try {
      await api.post('/upload/portfolio', formData);
      setMessage({ type: 'success', text: 'Project published successfully!' });
      setTimeout(() => navigate('/explore'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Upload failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-20 min-h-screen font-sans">
      <Helmet>
        <title>Upload Content — Driplens</title>
      </Helmet>

      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-black tracking-tighter uppercase mb-2">
            {step === 1 ? 'Select Project' : 'Upload Media'}
          </h1>
          <p className="text-[#666] text-sm uppercase tracking-widest font-bold">
            Step {step} of 2 — {step === 1 ? 'Organize your work' : 'Add your files'}
          </p>
        </div>
        {step === 2 && (
          <button 
            onClick={() => setStep(1)}
            className="text-[10px] font-bold uppercase tracking-widest text-[#999] hover:text-black transition-colors"
          >
            ← Change Project
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Existing Projects */}
            <div className="space-y-6">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#999]">Choose an existing project</label>
              <div className="grid grid-cols-1 gap-4">
                {projects.length > 0 ? (
                  projects.map(project => (
                    <button
                      key={project.id}
                      onClick={() => {
                        setSelectedProjectId(project.id);
                        setStep(2);
                      }}
                      className="group text-left p-6 border border-[#EEE] hover:border-black transition-all bg-white flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-bold text-lg">{project.title}</h3>
                        <p className="text-xs text-[#999] uppercase tracking-widest">{project.category}</p>
                      </div>
                      <span className="text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity">SELECT →</span>
                    </button>
                  ))
                ) : (
                  <div className="p-12 border border-dashed border-[#DDD] text-center text-[#999]">
                    No projects found. Create your first one to get started.
                  </div>
                )}
              </div>
            </div>

            {/* Create New Project */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h2 className="text-xl font-bold mb-8 uppercase tracking-tight">Create New Project</h2>
              <form onSubmit={handleCreateProject} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#999] mb-2">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Summer Campaign 2024"
                    className="w-full bg-transparent border-b border-[#DDD] py-3 focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#999] mb-2">Category *</label>
                  <select
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value)}
                    className="w-full bg-transparent border-b border-[#DDD] py-3 focus:outline-none focus:border-black transition-colors"
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#999] mb-2">Description</label>
                  <textarea
                    rows="3"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Briefly describe this project..."
                    className="w-full bg-transparent border border-[#DDD] p-4 focus:outline-none focus:border-black transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 font-bold text-xs uppercase tracking-widest hover:bg-black/90 transition-all shadow-lg"
                >
                  {loading ? 'Creating...' : 'Create & Continue'}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                {/* Multi Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                  className={`aspect-video border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-12 relative ${
                    dragActive ? 'border-black bg-gray-50' : 'border-[#DDD] bg-white hover:border-black'
                  }`}
                >
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={ALLOWED_MIME_TYPES.join(',')}
                  />
                  <svg className="w-12 h-12 text-[#CCC] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-sm font-bold uppercase tracking-widest text-black mb-2">Drop multiple files here</p>
                  <p className="text-xs text-[#999] uppercase tracking-widest">or click to browse</p>
                </div>

                {/* Previews */}
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {previews.map((preview, index) => (
                        <motion.div
                          key={preview.url}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-[#EEE]"
                        >
                          {preview.type === 'video' ? (
                            <video src={preview.url} className="w-full h-full object-cover" muted />
                          ) : (
                            <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(index);
                              }}
                              className="bg-white text-black p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0540F2] mb-6">Publishing To</h3>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-1 tracking-tight text-[#020617]">
                      {projects.find(p => p.id === selectedProjectId)?.title}
                    </h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      {projects.find(p => p.id === selectedProjectId)?.category}
                    </p>
                  </div>
                  
                  <div className="space-y-4 pt-6 border-t border-gray-50">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 uppercase tracking-widest">Selected Files</span>
                      <span className="font-bold text-[#020617]">{files.length}</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePublish}
                    disabled={loading || files.length === 0}
                    className={`w-full mt-12 bg-black text-white py-5 font-bold text-xs uppercase tracking-[0.2em] hover:bg-black/90 transition-all ${
                      loading || files.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Publishing...' : 'Publish Project'}
                  </button>
                </div>

                {message.text && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 text-[10px] font-bold uppercase tracking-widest ${
                      message.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                    }`}
                  >
                    {message.text}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}