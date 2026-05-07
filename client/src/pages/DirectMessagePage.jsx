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
    <div className="flex flex-col lg:flex-row h-[calc(100vh-60px)] bg-white font-['Space_Grotesk'] overflow-hidden">
      
      {/* Left Sidebar - Creator Profile */}
      <div className="w-full lg:w-[35%] lg:min-w-[350px] lg:max-w-[450px] bg-white border-r border-zinc-200 p-8 md:p-12 flex flex-col justify-center relative shrink-0">
        <Link to={`/profile/${id}`} className="absolute top-8 left-8 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-black flex items-center gap-2 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Profile
        </Link>

        <div className="flex flex-col items-center text-center mt-8">
          <div className="relative mb-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden bg-black flex items-center justify-center">
              {creator.avatar_url ? (
                <img src={creator.avatar_url} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-4xl md:text-5xl font-black">{initials(displayName)}</span>
              )}
            </div>
            <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-black rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)]"></span>
          </div>
          
          <h1 className="text-3xl font-black text-black tracking-tighter mb-1">{displayName}</h1>
          <p className="text-sm font-bold text-zinc-500 mb-2">{username}</p>
          <div className="inline-block bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 mb-6 shadow-[4px_4px_0px_#0540F2]">
            {role}
          </div>
          
          <p className="text-sm text-zinc-600 font-medium leading-relaxed mb-8 max-w-xs">
            {bio}
          </p>

          <div className="flex w-full max-w-xs justify-between items-center border-t border-b border-zinc-200 py-4">
            <div className="text-left">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Location</p>
              <p className="text-sm font-bold text-black">{location}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Base Rate</p>
              <p className="text-sm font-bold text-black">{rate}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3 w-full max-w-xs">
            <a
              href="https://meet.google.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#0540F2] text-white font-black uppercase tracking-widest py-3 border-[3px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Start Google Meet
            </a>
            <button
              onClick={() => navigate('/checkout', { state: { creator: MOCK_CREATOR, pkg: null } })}
              className="w-full flex items-center justify-center gap-2 bg-white text-black font-black uppercase tracking-widest py-3 border-[3px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform"
            >
              Fix a Deal →
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Chat Interface */}
      <div className="flex-1 flex flex-col bg-zinc-50 relative h-full">
        
        {/* Chat Header */}
        <header className="bg-white border-b border-zinc-200 px-6 py-4 flex justify-between items-center shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-zinc-200 overflow-hidden bg-zinc-100 flex items-center justify-center">
              {creator.avatar_url ? (
                <img src={creator.avatar_url} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-black text-xs font-bold">{initials(displayName)}</span>
              )}
            </div>
            <div>
              <h2 className="font-bold text-black text-sm tracking-wide">{displayName}</h2>
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Online</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <a 
              href="https://meet.google.com/new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#0540F2] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              Meet
            </a>
            <button className="text-zinc-400 hover:text-black transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
            </button>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 custom-scrollbar">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] md:max-w-[60%] rounded-2xl px-5 py-3 relative shadow-sm ${msg.sender === 'me' ? 'bg-[#0540F2] text-white rounded-tr-sm' : 'bg-white border border-zinc-200 text-black rounded-tl-sm'}`}>
                <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                <div className={`flex items-center gap-1.5 mt-2 justify-end ${msg.sender === 'me' ? 'text-blue-200' : 'text-zinc-400'}`}>
                  <span className="text-[9px] uppercase font-bold tracking-wider">{msg.time}</span>
                  {msg.sender === 'me' && (
                    <svg className={`w-3.5 h-3.5 ${msg.status === 'read' ? 'text-white' : msg.status === 'delivered' ? 'text-white/80' : 'text-white/40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      {msg.status !== 'sent' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 18l4 4L19 12" className="opacity-70" />}
                    </svg>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="bg-white border-t border-zinc-200 p-4 shrink-0">
          <form onSubmit={handleSend} className="w-full flex items-center gap-3">
            <button type="button" className="p-2 text-zinc-400 hover:text-black transition-colors shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
            </button>
            <div className="flex-1 bg-zinc-100 rounded-full px-4 py-1 flex items-center border border-transparent focus-within:border-[#0540F2] focus-within:bg-white transition-all">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none text-black py-2 outline-none text-sm font-medium w-full"
              />
            </div>
            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="w-10 h-10 bg-black text-white rounded-full hover:bg-[#0540F2] disabled:opacity-30 transition-colors shadow-md flex items-center justify-center shrink-0"
            >
              <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
