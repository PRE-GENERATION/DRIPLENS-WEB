import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../lib/api';



function initials(str = 'A') {
  return str.split(/[\s_]/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

export default function DirectMessagePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! I saw your portfolio and I love your work.", sender: 'me', time: '10:41 AM', status: 'read' },
    { id: 2, text: "Are you taking on new projects? We have a commercial shoot next month.", sender: 'me', time: '10:42 AM', status: 'read' },
    { id: 3, text: "Hi! Thank you so much. Yes, I'm available. What kind of commercial shoot is it?", sender: 'them', time: '10:45 AM', status: 'read' },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    const loadCreator = async () => {
      try {
        const { data } = await api.get(`/creators/${id}`);
        setCreator(data.creator);
      } catch (err) {
        console.error('Failed to load creator:', err);
        setError('Creator not found');
      } finally {
        setLoading(false);
      }
    };
    loadCreator();
  }, [id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      text: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages([...messages, msg]);
    setNewMessage("");

    // Simulate reading message
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'delivered' } : m));
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'read' } : m));
        // Simulate reply
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: `Hi! Thank you for reaching out. Let's discuss this further.`,
            sender: 'them',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }, 2000);
      }, 1000);
    }, 1000);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;
  if (error) return <div className="h-screen flex flex-col items-center justify-center bg-white"><h1 className="text-2xl font-bold mb-4">{error}</h1><Link to="/messages" className="bg-black text-white px-6 py-2">Back to Messages</Link></div>;

  const displayName = creator.display_name || creator.username;
  const username = `@${creator.username}`;
  const role = creator.category || 'Creator';
  const location = creator.location || 'Remote';
  const bio = creator.bio || 'Multi-disciplinary creative professional.';
  const rate = creator.min_budget ? `₹${creator.min_budget}/hr` : 'Contact for Rates';

  return (
    <div className="flex flex-col lg:flex-row h-full bg-white overflow-hidden">
      
      {/* Left Sidebar - Creator Profile */}
      <div className="w-full lg:w-[30%] lg:min-w-[320px] lg:max-w-[400px] bg-white border-r border-[#F0F0F0] p-8 md:p-10 flex flex-col justify-center relative shrink-0">
        <Link to={`/profile/${id}`} className="absolute top-8 left-8 text-[10px] uppercase tracking-[0.2em] text-[#999] hover:text-[#111] flex items-center gap-2 transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </Link>

        <div className="flex flex-col items-center text-center mt-4">
          <div className="relative mb-6">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border border-[#EEE] overflow-hidden bg-[#FAFAFA] flex items-center justify-center">
              {creator.avatar_url ? (
                <img src={creator.avatar_url} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#CCC] text-3xl font-light">{initials(displayName)}</span>
              )}
            </div>
            <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          
          <h1 className="text-xl font-medium text-[#111] tracking-tight mb-0.5">{displayName}</h1>
          <p className="text-xs text-[#999] mb-4 font-normal">{username}</p>
          
          <div className="text-[10px] text-[#999] uppercase tracking-[0.2em] mb-8 font-normal">
            {role}
          </div>
          
          <p className="text-xs text-[#666] font-normal leading-relaxed mb-10 max-w-[240px]">
            {bio}
          </p>

          <div className="flex w-full max-w-[240px] justify-between items-center border-t border-b border-[#F5F5F5] py-5 mb-8">
            <div className="text-left">
              <p className="text-[9px] text-[#999] uppercase tracking-widest mb-1">Location</p>
              <p className="text-xs text-[#111] font-normal">{location}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-[#999] uppercase tracking-widest mb-1">Base Rate</p>
              <p className="text-xs text-[#111] font-normal">{rate}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 w-full max-w-[240px]">
            <a
              href="https://meet.google.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-transparent text-[#111] text-[10px] font-normal uppercase tracking-[0.15em] py-2.5 border border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors"
            >
              Start Google Meet
            </a>
            <button
              onClick={() => navigate('/checkout', { state: { creator: MOCK_CREATOR, pkg: null } })}
              className="w-full flex items-center justify-center gap-2 bg-transparent text-[#111] text-[10px] font-normal uppercase tracking-[0.15em] py-2.5 border border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors"
            >
              Fix a Deal
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Chat Interface */}
      <div className="flex-1 flex flex-col bg-white relative h-full">
        
        {/* Chat Header */}
        <header className="bg-white border-b border-[#F0F0F0] px-8 py-4 flex justify-between items-center shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#EEE] overflow-hidden bg-[#FAFAFA] flex items-center justify-center">
              {creator.avatar_url ? (
                <img src={creator.avatar_url} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#CCC] text-[10px]">{initials(displayName)}</span>
              )}
            </div>
            <div>
              <h2 className="font-medium text-[#111] text-sm">{displayName}</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <p className="text-[10px] text-[#999] uppercase tracking-widest">Online</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <a 
              href="https://meet.google.com/new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-[#999] uppercase tracking-widest border border-[#E5E5E5] px-4 py-1.5 hover:bg-[#FAFAFA] transition-colors"
            >
              Meet
            </a>
            <button className="text-[#CCC] hover:text-[#111] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
            </button>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-6 custom-scrollbar">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] md:max-w-[50%] rounded-lg px-4 py-2.5 relative ${msg.sender === 'me' ? 'bg-[#3B50E0] text-white' : 'bg-white border border-[#E5E5E5] text-[#111]'}`}>
                <p className="text-sm leading-relaxed font-normal">{msg.text}</p>
                <div className={`flex items-center gap-1.5 mt-1.5 justify-end ${msg.sender === 'me' ? 'text-blue-100/60' : 'text-[#CCC]'}`}>
                  <span className="text-[8px] uppercase tracking-wider font-normal">{msg.time}</span>
                  {msg.sender === 'me' && (
                    <svg className={`w-3 h-3 ${msg.status === 'read' ? 'text-white' : 'opacity-40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="bg-white border-t border-[#F0F0F0] p-6 shrink-0">
          <form onSubmit={handleSend} className="w-full flex items-center gap-4">
            <button type="button" className="text-[#CCC] hover:text-[#111] transition-colors shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
            </button>
            <div className="flex-1 bg-gray-50 rounded-full px-6 py-3 flex items-center gap-4">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none text-[#111] outline-none text-sm font-normal"
              />
              <button type="button" className="text-gray-400 hover:text-black">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>
              </button>
            </div>
            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="w-12 h-12 bg-[#3B50E0] text-white rounded-full flex items-center justify-center disabled:bg-gray-200 transition-colors shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>
            </button>
          </form>
          
          <div className="flex justify-center gap-8 mt-6">
            <button className="text-[10px] font-black uppercase tracking-widest text-[#0044ff] flex items-center gap-2 hover:underline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              Negotiate Pricing
            </button>
            <button className="text-[10px] font-black uppercase tracking-widest text-[#0044ff] flex items-center gap-2 hover:underline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Update Deadline
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
