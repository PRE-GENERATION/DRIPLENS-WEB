import { useEffect, useState, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import { api } from '../lib/api';

export default function MessagingPage() {
  const { user: currentUser } = useAuth();
  const socket = useSocket();

  const [requests, setRequests] = useState([
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

  const [activeRequestId, setActiveRequestId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [presence, setPresence] = useState({});

  const messageContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
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
        if (reqs.length > 0) {
           setActiveRequestId(reqs[0].id);
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
      }
    };
    load();
  }, []);

  // ── Load messages ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeRequestId) return;

    const load = async () => {
      try {
        if (activeRequestId.startsWith('mock-req-') || activeRequestId.length <= 2) {
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
          const otherId = currentUser?.role === 'creator' ? req?.brand_id : req?.creator_id;
          socket.emit('message_read', { recipientId: otherId, requestId: activeRequestId });
          await api.patch(`/messages/${activeRequestId}/read`);
          setRequests(prev => prev.map(r => r.id === activeRequestId ? { ...r, unread_count: 0 } : r));
        }
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };
    load();
  }, [activeRequestId, socket, currentUser, requests]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg) => {
      if (msg.hiring_request_id === activeRequestId) {
        setMessages(prev => [...prev, msg]);
        const req = requests.find(r => r.id === activeRequestId);
        const otherId = currentUser?.role === 'creator' ? req?.brand_id : req?.creator_id;
        socket.emit('message_read', { recipientId: otherId, requestId: activeRequestId });
      } else {
        setRequests(prev => prev.map(r => r.id === msg.hiring_request_id ? { ...r, unread_count: (r.unread_count || 0) + 1 } : r));
      }
    };

    const handleTyping = ({ requestId }) => {
      if (requestId === activeRequestId) setIsOtherTyping(true);
    };

    const handleStopTyping = ({ requestId }) => {
      if (requestId === activeRequestId) setIsOtherTyping(false);
    };

    const handlePresence = ({ userId, status }) => {
      setPresence(prev => ({ ...prev, [userId]: status }));
    };

    socket.on('receive_message', handleMessage);
    socket.on('user_typing', handleTyping);
    socket.on('user_stop_typing', handleStopTyping);
    socket.on('presence_update', handlePresence);

    return () => {
      socket.off('receive_message', handleMessage);
      socket.off('user_typing', handleTyping);
      socket.off('user_stop_typing', handleStopTyping);
      socket.off('presence_update', handlePresence);
    };
  }, [socket, activeRequestId, requests, currentUser]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content || !activeRequestId) return;

    setNewMessage('');
    try {
      if (activeRequestId.startsWith('mock-req-') || activeRequestId.length <= 2) {
        setMessages(prev => [...prev, { id: 'm_mock_new_' + Date.now(), content, sender_id: currentUser?.id, created_at: new Date().toISOString() }]);
        if (messageContainerRef.current) {
          setTimeout(() => {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
          }, 50);
        }
        return;
      }
      const res = await api.post(`/messages/${activeRequestId}`, { content });
      setMessages(prev => [...prev, res.data.message]);
      if (messageContainerRef.current) {
        setTimeout(() => {
          messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }, 50);
      }
    } catch (err) {
      console.error(err);
      setNewMessage(content);
    }
  };

  const filteredRequests = useMemo(() => {
    if (!debouncedSearch) return requests;
    const s = debouncedSearch.toLowerCase();
    return requests.filter(r => 
      (r.project_title || '').toLowerCase().includes(s) || 
      (r.brand?.username || r.creator?.username || '').toLowerCase().includes(s)
    );
  }, [requests, debouncedSearch]);

  const activeReq = requests.find(r => r.id === activeRequestId);

  const formatTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ height: 'calc(100vh - 128px)', display: 'flex', background: '#FFF', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      <Helmet><title>Messages — Driplens</title></Helmet>

      {/* ── Left Sidebar ────────────────────────────────────────────────────── */}
      <div style={{ width: 320, display: 'flex', flexDirection: 'column', borderRight: '1px solid #F0F0F0' }}>
        <div style={{ padding: '24px 20px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', color: '#000', marginBottom: 20 }}>MESSAGES</div>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', height: 40, border: '2px solid #000', borderRadius: 0,
                padding: '0 12px', fontSize: 12, outline: 'none', fontWeight: 700,
                color: '#000'
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredRequests.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#999', textTransform: 'uppercase' }}>
              No conversations
            </div>
          ) : (
            filteredRequests.map(req => {
              const isActive = activeRequestId === req.id;
              const hasUnread = req.unread_count > 0;
              const otherUser = currentUser?.role === 'creator' ? req.brand : req.creator;
              
              return (
                <div 
                  key={req.id} 
                  onClick={() => setActiveRequestId(req.id)}
                  style={{
                    padding: '20px', display: 'flex', alignItems: 'center', gap: 12,
                    cursor: 'pointer', borderBottom: '1px solid #F0F0F0', position: 'relative',
                    background: isActive ? '#000' : 'transparent',
                    color: isActive ? '#FFF' : '#000',
                    transition: 'all 150ms ease'
                  }}
                >
                  <div style={{ width: 44, height: 44, background: isActive ? '#222' : '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, border: isActive ? '1px solid #333' : '1px solid #000' }}>
                    {otherUser?.username ? otherUser.username.charAt(0).toUpperCase() : 'U'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>{otherUser?.username || 'User'}</span>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, opacity: isActive ? 0.7 : 0.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {req.project_title}
                    </div>
                  </div>
                  {hasUnread && !isActive && (
                    <div style={{ width: 8, height: 8, background: '#0044ff', borderRadius: '50%' }} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right Chat Panel ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F9FAFB' }}>
        {!activeReq ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
             <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.3em', color: '#DDD' }}>SELECT A CONVERSATION</div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ padding: '20px 32px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, background: '#000', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900 }}>
                  {((currentUser?.role === 'creator' ? activeReq.brand : activeReq.creator)?.username || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 900, textTransform: 'uppercase' }}>{(currentUser?.role === 'creator' ? activeReq.brand : activeReq.creator)?.username || 'User'}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#0044ff', textTransform: 'uppercase' }}>{activeReq.project_title}</div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={messageContainerRef}
              style={{ 
                flex: 1, 
                padding: '32px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 16,
                overflowY: 'auto'
              }}
            >
              <AnimatePresence initial={false}>
                {messages.map((m, i) => {
                  const isMe = m.sender_id === currentUser?.id;
                  return (
                    <motion.div 
                      key={m.id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ 
                        alignSelf: isMe ? 'flex-end' : 'flex-start', 
                        maxWidth: '65%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMe ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div style={{ 
                        padding: '14px 18px', 
                        background: isMe ? '#000' : '#FFF',
                        color: isMe ? '#FFF' : '#000',
                        fontSize: 13, 
                        fontWeight: 600,
                        lineHeight: 1.6,
                        border: '1px solid #000',
                        boxShadow: isMe ? '4px 4px 0 #0044ff' : '4px 4px 0 #000'
                      }}>
                        {m.content}
                      </div>
                      <span style={{ fontSize: 9, fontWeight: 800, color: '#999', marginTop: 8, textTransform: 'uppercase' }}>
                        {formatTime(m.created_at)}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div style={{ padding: '24px 32px', background: '#FFF', borderTop: '1px solid #F0F0F0' }}>
              <form onSubmit={sendMessage} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  style={{ 
                    flex: 1, 
                    border: '2px solid #000', 
                    outline: 'none', 
                    fontSize: 12, 
                    fontWeight: 700,
                    background: '#F5F5F5',
                    height: 50,
                    padding: '0 20px'
                  }}
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  style={{ 
                    background: '#000', 
                    border: 'none', 
                    height: 50,
                    padding: '0 32px',
                    color: '#FFF',
                    fontSize: 10,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: newMessage.trim() ? 'pointer' : 'default',
                    opacity: newMessage.trim() ? 1 : 0.5,
                    transition: 'all 200ms'
                  }}
                >
                  Send
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
