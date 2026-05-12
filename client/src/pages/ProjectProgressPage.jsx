import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  LayoutDashboard, 
  ArrowRight, 
  AlertTriangle, 
  FileText, 
  ExternalLink,
  MessageCircle,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export default function ProjectProgressPage() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const socket = useSocket();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [submissionType, setSubmissionType] = useState('draft');
  const [notes, setNotes] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDisputeForm, setShowDisputeForm] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    if (socket) {
      socket.on('project_update', (updated) => {
        if (updated.id === projectId) setProject(p => ({ ...p, ...updated }));
      });
      socket.on('project_submitted', (data) => {
        if (data.id === projectId) fetchProject();
      });
      return () => {
        socket.off('project_update');
        socket.off('project_submitted');
      };
    }
  }, [socket, projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${projectId}`);
      setProject(res.data.project);
    } catch (err) {
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileUrl) return alert('Please provide a file URL or link');
    
    setIsSubmitting(true);
    try {
      await api.post(`/projects/${projectId}/submit`, {
        file_url: fileUrl,
        file_name: submissionType === 'final_link' ? 'Live Content Link' : 'Draft Submission',
        notes,
        type: submissionType
      });
      fetchProject();
      setFileUrl('');
      setNotes('');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevision = async () => {
    if (!revisionFeedback) return alert('Please provide feedback');
    setIsSubmitting(true);
    try {
      await api.post(`/projects/${projectId}/revision`, {
        deliverable_id: project.latest_deliverable?.id,
        feedback: revisionFeedback
      });
      fetchProject();
      setRevisionFeedback('');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this project and release payment?')) return;
    setIsSubmitting(true);
    try {
      await api.post(`/projects/${projectId}/approve`);
      fetchProject();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDispute = async () => {
    if (!disputeReason) return alert('Please provide a reason for the dispute');
    setIsSubmitting(true);
    try {
      await api.post(`/projects/${projectId}/dispute`, { reason: disputeReason });
      fetchProject();
      setShowDisputeForm(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !project) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Project Not Found</h2>
      <p className="text-gray-500 mb-8">{error || "We couldn't find the project you're looking for."}</p>
      <Link to="/dashboard" className="px-8 py-4 bg-black text-white font-black uppercase tracking-widest text-xs">Back to Dashboard</Link>
    </div>
  );

  const isCreator = user.role === 'creator';
  const isBrand = user.role === 'brand';

  const steps = [
    { id: 1, title: 'Hired', status: 'COMPLETED', description: 'Terms agreed and escrow secured.' },
    { id: 2, title: 'Production', status: project.progress < 100 ? 'IN PROGRESS' : 'COMPLETED', description: 'Creator is working on the content.', progress: project.progress },
    { id: 3, title: 'Submission', status: project.status === 'submitted' ? 'IN PROGRESS' : (['approved', 'completed'].includes(project.status) ? 'COMPLETED' : 'UPCOMING'), description: 'Content submitted for brand review.' },
    { id: 4, title: 'Payment', status: project.status === 'completed' ? 'COMPLETED' : 'UPCOMING', description: 'Funds released to creator.' }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-inter text-[#020617] py-12 px-4 md:px-8 flex justify-center">
      <div className="max-w-4xl w-full">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-black border-2 border-black flex items-center justify-center shrink-0">
              <img 
                src={isCreator ? project.brand?.avatar_url : project.creator?.avatar_url} 
                alt="" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-black uppercase tracking-tight">
                  {project.hiring_request?.project_title || 'Content Collaboration'}
                </h1>
                <span className={`text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-none shadow-sm ${
                  project.status === 'disputed' ? 'bg-red-600' : 'bg-[#0033CC]'
                }`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[#555555] font-bold text-[10px] uppercase tracking-widest">
                {isCreator ? `Client: ${project.brand?.username}` : `Creator: ${project.creator?.username}`}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => navigate(`/dm/${isCreator ? project.brand_id : project.creator_id}`)}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#020617] border-2 border-black px-4 py-2 bg-white hover:bg-black hover:text-white transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4" /> Chat
            </button>
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white border-2 border-black px-4 py-2 bg-black hover:bg-[#0033CC] hover:border-[#0033CC] transition-all shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          </div>
        </div>

        {/* Dispute Banner */}
        {project.status === 'disputed' && (
          <div className="bg-red-50 border-2 border-red-600 p-6 mb-12 flex gap-6 items-start">
            <ShieldAlert className="w-8 h-8 text-red-600 shrink-0" />
            <div>
              <h3 className="text-red-600 font-black uppercase tracking-widest text-xs mb-1">Project Disputed</h3>
              <p className="text-red-900 text-sm font-bold mb-4">{project.dispute_reason}</p>
              <p className="text-red-700 text-xs italic">A Driplens moderator has been notified and will intervene shortly.</p>
            </div>
          </div>
        )}

        {/* Timeline Content */}
        <div className="relative mb-12">
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px] bg-[#C4C4C4] -z-0"></div>
          <div className="space-y-12 relative z-10">
            {steps.map((step, index) => {
              const isCompleted = step.status === 'COMPLETED';
              const isInProgress = step.status === 'IN PROGRESS';
              const isUpcoming = step.status === 'UPCOMING';

              return (
                <div key={step.id} className="flex gap-8 md:gap-12 group">
                  <div className="relative flex flex-col items-center">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-20 transition-all duration-300
                      ${isCompleted ? 'bg-black text-white shadow-lg' : ''}
                      ${isInProgress ? 'bg-[#0033CC] text-white ring-4 ring-[#0033CC]/20 shadow-xl scale-110' : ''}
                      ${isUpcoming ? 'bg-white border-2 border-[#C4C4C4] text-[#C4C4C4]' : ''}
                    `}>
                      {isCompleted ? <Check className="w-6 h-6 stroke-[3px]" /> : <span className="font-bold text-base">{step.id}</span>}
                    </div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      flex-1 p-6 md:p-8 rounded-none transition-all duration-300 border-2
                      ${isCompleted ? 'bg-white border-black/5' : ''}
                      ${isInProgress ? 'bg-white border-[#0033CC] shadow-xl' : ''}
                      ${isUpcoming ? 'bg-white border-[#E2E8F0] opacity-60' : ''}
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-black">
                        {step.title}
                      </h3>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 ${
                        isCompleted ? 'bg-black text-white' : isInProgress ? 'bg-[#0033CC] text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm leading-relaxed mb-6 font-medium text-gray-500">
                      {step.description}
                    </p>

                    {isInProgress && step.id === 2 && (
                      <div className="relative">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Phase Progress</span>
                          <span className="text-xs font-black bg-black text-white px-2 py-0.5">{project.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 border border-gray-200">
                          <div className="h-full bg-black" style={{ width: `${project.progress}%` }} />
                        </div>
                        {isCreator && (
                           <div className="mt-4 flex gap-2">
                             <input 
                               type="range" min="0" max="100" value={project.progress} 
                               onChange={(e) => api.patch(`/projects/${projectId}/progress`, { progress: parseInt(e.target.value) })}
                               className="flex-1 accent-black"
                             />
                             <span className="text-[10px] font-bold">Adjust Progress</span>
                           </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-white border-2 border-black p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-gray-50">
            <h2 className="text-xl font-black uppercase tracking-tighter">Project Management</h2>
            <div className="flex gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Revisions: {project.revision_count}/{project.max_revisions}</span>
            </div>
          </div>

          {isCreator && project.status !== 'completed' && project.status !== 'disputed' && (
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest mb-2">Submission Type</label>
                   <select 
                    value={submissionType} 
                    onChange={(e) => setSubmissionType(e.target.value)}
                    className="w-full p-4 border-2 border-black font-bold text-xs bg-gray-50 outline-none focus:bg-white transition-all"
                   >
                     <option value="draft">Draft for Review</option>
                     <option value="final_link">Final Content Link (Reel/Post)</option>
                     <option value="raw_files">Raw Files / Deliverables</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest mb-2">URL / Link</label>
                   <input 
                    type="url" 
                    placeholder="https://..." 
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    className="w-full p-4 border-2 border-black font-bold text-xs outline-none focus:border-[#0033CC] transition-all"
                   />
                 </div>
               </div>
               <div>
                 <label className="block text-[10px] font-black uppercase tracking-widest mb-2">Notes to Brand</label>
                 <textarea 
                  rows={3} 
                  placeholder="Anything the brand should know..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-4 border-2 border-black font-bold text-xs outline-none focus:border-[#0033CC] transition-all"
                 />
               </div>
               <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full p-5 bg-black text-white font-black uppercase tracking-widest text-xs hover:bg-[#0033CC] transition-all flex items-center justify-center gap-3"
               >
                 {isSubmitting ? 'Uploading...' : 'Submit Deliverable'} <ArrowRight className="w-4 h-4" />
               </button>
            </form>
          )}

          {isBrand && project.status === 'submitted' && (
            <div className="space-y-8">
              <div className="p-6 bg-gray-50 border-2 border-black/5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Latest Submission</p>
                    <p className="font-bold text-sm">{project.latest_deliverable?.type.toUpperCase()} • Version {project.latest_deliverable?.version}</p>
                  </div>
                </div>
                <a href={project.latest_deliverable?.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                  View Content <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <textarea 
                    rows={3} 
                    placeholder="Feedback for revision..."
                    value={revisionFeedback}
                    onChange={(e) => setRevisionFeedback(e.target.value)}
                    className="w-full p-4 border-2 border-black font-bold text-xs outline-none focus:border-[#0033CC] transition-all"
                  />
                  <button 
                    onClick={handleRevision}
                    disabled={isSubmitting || project.revision_count >= project.max_revisions}
                    className="w-full p-4 border-2 border-black font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all disabled:opacity-50"
                  >
                    Request Revision ({project.revision_count}/{project.max_revisions})
                  </button>
                </div>
                <div className="flex flex-col justify-end">
                  <button 
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="w-full p-4 bg-green-600 text-white border-2 border-green-600 font-black uppercase tracking-widest text-[10px] hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    Approve & Release Payment <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {project.status !== 'completed' && project.status !== 'disputed' && (
            <div className="mt-12 pt-8 border-t-2 border-gray-50 flex justify-between items-center">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Issues with the collaboration?</p>
               {!showDisputeForm ? (
                 <button 
                  onClick={() => setShowDisputeForm(true)}
                  className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:underline"
                 >
                   Raise a Dispute
                 </button>
               ) : (
                 <div className="w-full max-w-md bg-red-50 p-4 border-2 border-red-100 flex flex-col gap-3">
                   <textarea 
                    rows={2} 
                    placeholder="Why are you disputing this project?"
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full p-3 border-2 border-red-200 font-bold text-[10px] outline-none focus:border-red-600"
                   />
                   <div className="flex gap-2">
                     <button onClick={handleDispute} disabled={isSubmitting} className="flex-1 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest p-2">Confirm Dispute</button>
                     <button onClick={() => setShowDisputeForm(false)} className="px-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Cancel</button>
                   </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
