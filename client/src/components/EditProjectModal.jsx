import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

const CATEGORIES = [
  'Cinematography', 'Photography', '3D Motion', 'Design',
  'Illustration', 'Animation', 'Graphic Design', 'VFX'
];

export default function EditProjectModal({ project, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        category: project.category || CATEGORIES[0]
      });
    }
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.patch(`/upload/projects/${project.id}`, {
        ...formData,
        description: formData.description || null
      });
      onSave(res.data);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-lg overflow-hidden shadow-2xl"
            style={{ borderRadius: '0px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-[#0D1033] uppercase tracking-tighter">Edit Project</h2>
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest font-bold mt-1">Refine your showcase details</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-[#0D1033]" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">Project Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F8F9FC] border border-[#F0F0F0] focus:border-[#3B50E0] focus:ring-1 focus:ring-[#3B50E0] outline-none transition-all font-medium text-[#0D1033]"
                    style={{ borderRadius: '0px' }}
                    placeholder="Enter project title"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F8F9FC] border border-[#F0F0F0] focus:border-[#3B50E0] focus:ring-1 focus:ring-[#3B50E0] outline-none transition-all font-medium text-[#0D1033] appearance-none"
                    style={{ borderRadius: '0px' }}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">Description</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F8F9FC] border border-[#F0F0F0] focus:border-[#3B50E0] focus:ring-1 focus:ring-[#3B50E0] outline-none transition-all font-medium text-[#0D1033] resize-none"
                    style={{ borderRadius: '0px' }}
                    placeholder="Tell the story behind this project..."
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight">{error}</p>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#0D1033] text-white py-4 px-6 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#1a1f5c] transition-all disabled:opacity-50"
                    style={{ borderRadius: '0px' }}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 border border-[#F0F0F0] text-[#0D1033] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
                    style={{ borderRadius: '0px' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
