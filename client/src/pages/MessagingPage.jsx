import { useEffect, useState, useRef, useMemo } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

export default function MessagingPage() {
  const { user: currentUser } = useAuth();
  const [reqs, setReqs] = useState([
    { id: '1', project_title: 'Summer Collection Reel', last_message: 'Hey, when can we expect the first draft?', unread_count: 2, brand: { username: 'Urban Threads', avatar_url: 'https://i.pravatar.cc/150?u=1' } },
    { id: '2', project_title: 'Tech Unboxing Series', last_message: 'The lighting looks great in the preview.', unread_count: 0, brand: { username: 'GadgetHub', avatar_url: 'https://i.pravatar.cc/150?u=2' } },
    { id: '3', project_title: 'Fitness App Promo', last_message: 'Can we change the background music?', unread_count: 5, brand: { username: 'FitLife', avatar_url: 'https://i.pravatar.cc/150?u=3' } },
    { id: '4', project_title: 'Travel Vlog Collaboration', last_message: 'Safe travels! Looking forward to the footage.', unread_count: 1, brand: { username: 'Wanderlust', avatar_url: 'https://i.pravatar.cc/150?u=4' } },
    { id: '5', project_title: 'Eco-Friendly Kitchenware', last_message: 'Thanks for the honest review.', unread_count: 0, brand: { username: 'GreenHome', avatar_url: 'https://i.pravatar.cc/150?u=5' } },
    { id: '6', project_title: 'Gaming Setup Showcase', last_message: 'The RGB sync is perfect.', unread_count: 3, brand: { username: 'GamerGear', avatar_url: 'https://i.pravatar.cc/150?u=6' } },
    { id: '7', project_title: 'Skincare Routine Video', last_message: 'Please emphasize the natural ingredients.', unread_count: 0, brand: { username: 'PureGlow', avatar_url: 'https://i.pravatar.cc/150?u=7' } },
    { id: '8', project_title: 'Smart Home Automation', last_message: 'Does the app support iOS 17?', unread_count: 4, brand: { username: 'SmartLiving', avatar_url: 'https://i.pravatar.cc/150?u=8' } },
    { id: '9', project_title: 'Organic Pet Food Intro', last_message: 'Our dogs loved the samples!', unread_count: 0, brand: { username: 'PawPal', avatar_url: 'https://i.pravatar.cc/150?u=9' } },
    { id: '10', project_title: 'Luxury Watch Shoot', last_message: 'The macro shots are stunning.', unread_count: 1, brand: { username: 'EliteTime', avatar_url: 'https://i.pravatar.cc/150?u=10' } }
  ]);
  const socket = useSocket();

  const [requests,        setRequests]        = useState([]);
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [messages,        setMessages]        = useState([]);
  const [newMessage,      setNewMessage]      = useState('');
  const [isOtherTyping,   setIsOtherTyping]   = useState(false);
  const [presence,        setPresence]        = useState({});
  const [search,          setSearch]          = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ── Debounce Search ───────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Load conversations ────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get('/hiring');
        let reqs = data.data?.requests ?? [];
        if (reqs.length === 0) {
          reqs = [
            { id: 'mock-req-1', project_title: 'Summer Collection Launch', unread_count: 2, creator: { id: 'cr1', username: 'alex_creates', avatar_url: 'https://i.pravatar.cc/150?u=1' }, brand: { id: 'b1', username: 'My Brand', avatar_url: '' } },
            { id: 'mock-req-2', project_title: 'Winter Essentials 2024', unread_count: 0, creator: { id: 'cr2', username: 'samantha_vlogs', avatar_url: 'https://i.pravatar.cc/150?u=2' }, brand: { id: 'b1', username: 'My Brand', avatar_url: '' } },
            { id: 'mock-req-3', project_title: 'Fitness App Review', unread_count: 1, creator: { id: 'cr3', username: 'pro_studio_gear', avatar_url: 'https://i.pravatar.cc/150?u=3' }, brand: { id: 'b1', username: 'My Brand', avatar_url: '' } },
            { id: 'mock-req-4', project_title: 'Eco-friendly Kitchenware', unread_count: 0, creator: { id: 'cr4', username: 'fitness_freak_99', avatar_url: 'https://i.pravatar.cc/150?u=4' }, brand: { id: 'b1', username: 'My Brand', avatar_url: '' } },
            { id: 'mock-req-5', project_title: 'Gaming Setup Vlog', unread_count: 5, creator: { id: 'cr5', username: 'tech_guru_official', avatar_url: 'https://i.pravatar.cc/150?u=5' }, brand: { id: 'b1', username: 'My Brand', avatar_url: '' } },
            { id: 'mock-req-6', project_title: 'Skincare Routine Post', unread_count: 0, creator: { id: 'cr6', username: 'eco_warrior_jane', avatar_url: 'https://i.pravatar.cc/150?u=6' }, brand: { id: 'b1', username: 'My Brand', avatar_url: '' } },
            { id: 'mock-req-7', project_title: 'Travel Diary: Bali', unread_count: 0, creator: { id: 'cr7', username: 'travel_with_tom', avatar_url: 'https://i.pravatar.cc/150?u=7' }, brand: { id: 'b1', username: 'My Brand', avatar_url: '' } },
            { id: 'mock-req-8', project_title: 'Tech Showcase', unread_count: 3, creator: { id: 'cr8', username: 'beauty_by_bella', avatar_url: 'https://i.pravatar.cc/150?u=8' }, brand: { id: 'b1', username: 'My Brand', avatar_url: '' } },
            { id: 'mock-req-9', project_title: 'Home Makeover', unread_count: 0, creator: { id: 'cr9', username: 'gamer_pro_max', avatar_url: 'https://i.pravatar.cc/150?u=9' }, brand: { id: 'b1', username: 'My Brand', avatar_url: '' } },
            { id: 'mock-req-10', project_title: 'Pet Food Review', unread_count: 1, creator: { id: 'cr10', username: 'chef_de_cuisine', avatar_url: 'https://i.pravatar.cc/150?u=10' }, brand: { id: 'b1', username: 'My Brand', avatar_url: '' } }
          ];
        }
        setRequests(reqs);
        if (reqs.length > 0 && !activeRequestId) {
          // Don't auto-select on mobile maybe? Actually, spec says "When no conversation selected"
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
      }
    };
    load();
  }, [activeRequestId]);

  // ── Load messages + Socket listeners ──────────────────────────────────────
  useEffect(() => {
    if (!activeRequestId) return;

    const load = async () => {
      try {
        if (activeRequestId.startsWith('mock-req-')) {
          setMessages([
            { id: 'm1', content: 'Hey, I love the brief for the Summer Campaign!', sender_id: 'c1', created_at: new Date(Date.now() - 3600000).toISOString() },
            { id: 'm2', content: 'Are you open to video reels instead of just stories?', sender_id: 'c1', created_at: new Date(Date.now() - 3500000).toISOString() },
            { id: 'm3', content: 'Hi Alex! Yes, reels would be fantastic. Let us discuss the budget.', sender_id: currentUser?.id, created_at: new Date(Date.now() - 3000000).toISOString() },
          ]);
          return;
        }
        const data = await api.get(`/messages/${activeRequestId}`);
        setMessages(data.data?.messages ?? []);
        
        // Mark as read
        if (socket) {
          const req = requests.find(r => r.id === activeRequestId);
          const otherId = currentUser.role === 'creator' ? req?.brand_id : req?.creator_id;
          socket.emit('message_read', { recipientId: otherId, requestId: activeRequestId });
          await api.patch(`/messages/${activeRequestId}/read`);
          
          // Update local unread status if any
          setRequests(prev => prev.map(r => r.id === activeRequestId ? { ...r, unread_count: 0 } : r));
        }
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };
    load();
  }, [activeRequestId, socket, currentUser?.role, requests]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg) => {
      if (msg.hiring_request_id === activeRequestId) {
        setMessages(prev => [...prev, msg]);
        
        const req = requests.find(r => r.id === activeRequestId);
        const otherId = currentUser.role === 'creator' ? req?.brand_id : req?.creator_id;
        socket.emit('message_read', { recipientId: otherId, requestId: activeRequestId });
      } else {
        // Increment unread count for other conversations
        setRequests(prev => prev.map(r => r.id === msg.hiring_request_id ? { ...r, unread_count: (r.unread_count || 0) + 1 } : r));
      }
    };

    const handleTyping = ({ requestId }) => {
      if (requestId === activeRequestId) setIsOtherTyping(true);
    };

    const handleStopTyping = ({ requestId }) => {
      if (requestId === activeRequestId) setIsOtherTyping(false);
    };

    const handleReadReceipt = ({ requestId }) => {
      if (requestId === activeRequestId) {
        setMessages(prev => prev.map(m => ({ ...m, is_read: true })));
      }
    };

    const handlePresence = ({ userId, status }) => {
      setPresence(prev => ({ ...prev, [userId]: status }));
    };

    socket.on('receive_message', handleMessage);
    socket.on('user_typing', handleTyping);
    socket.on('user_stop_typing', handleStopTyping);
    socket.on('read_receipt', handleReadReceipt);
    socket.on('presence_update', handlePresence);

    return () => {
      socket.off('receive_message', handleMessage);
      socket.off('user_typing', handleTyping);
      socket.off('user_stop_typing', handleStopTyping);
      socket.off('read_receipt', handleReadReceipt);
      socket.off('presence_update', handlePresence);
    };
  }, [socket, activeRequestId, requests, currentUser?.role]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOtherTyping]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const sendMessage = async (e) => {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content || !activeRequestId) return;
    setNewMessage('');
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      handleStopTypingEmit();
    }

    try {
      if (activeRequestId.startsWith('mock-req-')) {
        setMessages(prev => [...prev, { id: 'm_mock_new_' + Date.now(), content, sender_id: currentUser?.id, created_at: new Date().toISOString() }]);
        return;
      }
      const res = await api.post(`/messages/${activeRequestId}`, { content });
      setMessages(prev => [...prev, res.data.message]);
    } catch (err) {
      console.error(err);
      setNewMessage(content);
    }
  };

  const handleTypingEmit = () => {
    if (!socket || !activeRequestId) return;
    const req = requests.find(r => r.id === activeRequestId);
    const otherId = currentUser.role === 'creator' ? req?.brand_id : req?.creator_id;
    socket.emit('typing', { recipientId: otherId, requestId: activeRequestId });
  };

  const handleStopTypingEmit = () => {
    if (!socket || !activeRequestId) return;
    const req = requests.find(r => r.id === activeRequestId);
    const otherId = currentUser.role === 'creator' ? req?.brand_id : req?.creator_id;
    socket.emit('stop_typing', { recipientId: otherId, requestId: activeRequestId });
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (!socket) return;
    if (!typingTimeoutRef.current) handleTypingEmit();
    else clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTypingEmit();
      typingTimeoutRef.current = null;
    }, 2000);
  };

  const getOtherParty = (req) => {
    if (!currentUser) return null;
    return currentUser.role === 'creator' ? req.brand : req.creator;
  };

  const filteredRequests = useMemo(() => {
    if (!debouncedSearch) return requests;
    const s = debouncedSearch.toLowerCase();
    return requests.filter(r => {
      const party = getOtherParty(r);
      return (party?.username?.toLowerCase().includes(s)) || (r.project_title?.toLowerCase().includes(s));
    });
  }, [requests, debouncedSearch, currentUser]);

  const activeReq  = requests.find(r => r.id === activeRequestId);
  const otherParty = activeReq ? getOtherParty(activeReq) : null;
  const isOnline   = otherParty && presence[otherParty.id] === 'online';

  return (
    <div style={{ height: '100%', display: 'flex', background: '#FFF', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      <Helmet><title>Messages — Driplens</title></Helmet>

      {/* ── Left Sidebar ────────────────────────────────────────────────────── */}
      <div style={{ width: 320, display: 'flex', flexDirection: 'column', borderRight: '1px solid #E0E0E0' }}>
        <div style={{ padding: '24px 16px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#999', marginBottom: 16 }}>MESSAGES</div>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', height: 36, border: '1px solid #E0E0E0', borderRadius: 0,
                padding: '0 12px', fontSize: 12, outline: 'none', fontStyle: 'italic',
                color: '#000'
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredRequests.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', fontSize: 12, color: '#CCC' }}>
              {requests.length === 0 ? 'No conversations yet.' : 'No results found.'}
            </div>
          ) : (
            filteredRequests.map(r => {
              const party = getOtherParty(r);
              const isActive = activeRequestId === r.id;
              const userOnline = party && presence[party.id] === 'online';
              const hasUnread = (r.unread_count || 0) > 0;
              
              return (
                <div 
                  key={r.id} 
                  onClick={() => setActiveRequestId(r.id)}
                  style={{
                    height: 64, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 12,
                    cursor: 'pointer', borderBottom: '1px solid #F5F5F5', position: 'relative',
                    background: isActive ? '#F8F8F8' : 'transparent',
                    transition: 'background 150ms ease'
                  }}
                  className="conv-row"
                >
                  {isActive && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: '#000' }} />}
                  
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    {party?.avatar_url ? (
                      <img src={party.avatar_url} style={{ width: 36, height: 36, objectFit: 'cover' }} alt="" />
                    ) : (
                      <div style={{ width: 36, height: 36, background: '#F0F0F0' }} />
                    )}
                    {userOnline && <div style={{ position: 'absolute', top: -2, right: -2, width: 6, height: 6, background: '#22C55E' }} />}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: 13, fontWeight: hasUnread ? 600 : 500, color: '#000' }}>{party?.username || 'Unknown'}</span>
                      <span style={{ fontSize: 10, color: '#CCC' }}>12:45 PM</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 12, color: hasUnread ? '#333' : '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {r.project_title}
                      </div>
                      {hasUnread && <div style={{ width: 6, height: 6, background: '#000', flexShrink: 0, marginLeft: 8 }} />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right Chat Panel ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!activeReq ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#CCC' }}>SELECT A CONVERSATION</div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ height: 56, padding: '0 20px', borderBottom: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', gap: 12 }}>
              {otherParty?.avatar_url ? (
                <img src={otherParty.avatar_url} style={{ width: 32, height: 32, objectFit: 'cover' }} alt="" />
              ) : (
                <div style={{ width: 32, height: 32, background: '#F0F0F0' }} />
              )}
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#000' }}>{otherParty?.username}</div>
                <div style={{ fontSize: 11, color: isOnline ? '#22C55E' : '#999' }}>{isOnline ? 'Active now' : 'Away'}</div>
              </div>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <AnimatePresence initial={false}>
                {messages.map((m, i) => {
                  const isMe = m.sender_id === currentUser?.id;
                  const isLast = i === messages.length - 1;
                  return (
                    <motion.div 
                      key={m.id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}
                    >
                      <div style={{ 
                        padding: '10px 14px', 
                        background: isMe ? '#000' : '#F5F5F5',
                        color: isMe ? '#FFF' : '#000',
                        fontSize: 13, lineHeight: 1.5,
                      }}>
                        {m.content}
                      </div>
                      <div style={{ marginTop: 4, display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 10, color: '#CCC' }}>
                          {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </span>
                        {isMe && isLast && m.is_read && (
                          <span style={{ fontSize: 10, color: '#CCC' }}>Seen</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {isOtherTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ alignSelf: 'flex-start' }}
                >
                  <div style={{ display: 'flex', gap: 4, padding: '10px 0' }}>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                        style={{ width: 4, height: 4, background: '#999' }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div style={{ height: 56, borderTop: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16 }}>
              <div style={{ color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
              </div>
              <form onSubmit={sendMessage} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <input 
                  ref={inputRef}
                  type="text" 
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder="Write a message..."
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, background: 'transparent' }}
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  style={{ 
                    background: 'none', border: 'none', padding: '0 0 0 16px',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                    color: newMessage.trim() ? '#000' : '#CCC',
                    cursor: newMessage.trim() ? 'pointer' : 'default',
                    transition: 'color 200ms'
                  }}
                >
                  SEND
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      <style>{`
        .conv-row:hover { background: #FAFAFA !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #EEE; }
        ::-webkit-scrollbar-thumb:hover { background: #DDD; }
      `}</style>
    </div>
  );
}
