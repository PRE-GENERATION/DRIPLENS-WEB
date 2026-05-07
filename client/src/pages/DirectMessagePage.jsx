import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MOCK_CREATOR = {
  name: 'Atharv Gadekar',
  username: '@atharvagadekar2906',
  role: 'Cinematographer & Director',
  location: 'Mumbai, India',
  img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop',
  bio: 'Specializing in high-end commercial videography and aesthetic brand storytelling. Let\'s create something beautiful together.',
  rate: '₹5,000/hr'
};

export default function DirectMessagePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! I saw your portfolio and I love your work.", sender: 'me', time: '10:41 AM', status: 'read' },
    { id: 2, text: "Are you taking on new projects? We have a commercial shoot next month.", sender: 'me', time: '10:42 AM', status: 'read' },
    { id: 3, text: "Hi! Thank you so much. Yes, I'm available. What kind of commercial shoot is it?", sender: 'them', time: '10:45 AM', status: 'read' },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

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
            text: "That sounds interesting! Could you share the brief?",
            sender: 'them',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }, 2000);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-60px)] bg-white font-['Space_Grotesk'] overflow-hidden">
      
      {/* Left Sidebar - Creator Profile */}
      <div className="w-full lg:w-[35%] lg:min-w-[350px] lg:max-w-[450px] bg-white border-r border-zinc-200 p-8 md:p-12 flex flex-col justify-center relative shrink-0">
        <Link to={`/profile/${id || 'demo'}`} className="absolute top-8 left-8 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-black flex items-center gap-2 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Profile
        </Link>

        <div className="flex flex-col items-center text-center mt-8">
          <div className="relative mb-6">
            <img src={MOCK_CREATOR.img} alt={MOCK_CREATOR.name} className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]" />
            <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-black rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)]"></span>
          </div>
          
          <h1 className="text-3xl font-black text-black tracking-tighter mb-1">{MOCK_CREATOR.name}</h1>
          <p className="text-sm font-bold text-zinc-500 mb-2">{MOCK_CREATOR.username}</p>
          <div className="inline-block bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 mb-6 shadow-[4px_4px_0px_#0540F2]">
            {MOCK_CREATOR.role}
          </div>
          
          <p className="text-sm text-zinc-600 font-medium leading-relaxed mb-8 max-w-xs">
            {MOCK_CREATOR.bio}
          </p>

          <div className="flex w-full max-w-xs justify-between items-center border-t border-b border-zinc-200 py-4">
            <div className="text-left">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Location</p>
              <p className="text-sm font-bold text-black">{MOCK_CREATOR.location}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Base Rate</p>
              <p className="text-sm font-bold text-black">{MOCK_CREATOR.rate}</p>
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
      <div className="flex-1 flex flex-col bg-[#111] relative h-full">
        
        {/* Chat Header */}
        <header className="bg-[#0a0a0a] border-b border-white/5 px-6 py-4 flex justify-between items-center shrink-0 shadow-md z-10">
          <div className="flex items-center gap-3">
            <img src={MOCK_CREATOR.img} alt={MOCK_CREATOR.name} className="w-10 h-10 object-cover rounded-full border border-white/10" />
            <div>
              <h2 className="font-bold text-white text-sm tracking-wide">{MOCK_CREATOR.name}</h2>
              <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <a 
              href="https://meet.google.com/new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#0540F2] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              Meet
            </a>
            <button className="text-white/40 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
            </button>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 custom-scrollbar" style={{ backgroundImage: "url('https://transparenttextures.com/patterns/cubes.png')", backgroundBlendMode: 'overlay', opacity: 0.95 }}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] md:max-w-[60%] rounded-2xl px-5 py-3 relative shadow-md ${msg.sender === 'me' ? 'bg-[#0540F2] text-white rounded-tr-sm' : 'bg-[#222] border border-white/5 text-white rounded-tl-sm'}`}>
                <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                <div className={`flex items-center gap-1.5 mt-2 justify-end ${msg.sender === 'me' ? 'text-blue-200' : 'text-zinc-400'}`}>
                  <span className="text-[9px] uppercase font-bold tracking-wider">{msg.time}</span>
                  {msg.sender === 'me' && (
                    <svg className={`w-3.5 h-3.5 ${msg.status === 'read' ? 'text-[#F072F2]' : msg.status === 'delivered' ? 'text-white' : 'text-white/50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="bg-[#0a0a0a] border-t border-white/5 p-4 shrink-0">
          <form onSubmit={handleSend} className="w-full flex items-center gap-3">
            <button type="button" className="p-2 text-white/40 hover:text-white transition-colors shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
            </button>
            <div className="flex-1 bg-[#1a1a1a] rounded-full px-4 py-1 flex items-center border border-white/10 focus-within:border-[#0540F2] transition-colors">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none text-white py-2 outline-none text-sm font-medium w-full"
              />
            </div>
            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="w-10 h-10 bg-white text-black rounded-full hover:bg-[#0540F2] hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black transition-colors shadow-lg flex items-center justify-center shrink-0"
            >
              <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
