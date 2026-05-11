import { useEffect, useState, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { demoConversations } from '../data/demoConversations';

export default function MessagingPage() {
  const { user: currentUser } = useAuth();

  const [conversations, setConversations] = useState(demoConversations);
  const [activeConvId, setActiveConvId] = useState(demoConversations[0]?.id || null);
  const [newMessage,   setNewMessage]   = useState('');
  const [search,       setSearch]       = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const messageContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isInitialMount = useRef(true);

  // ── Debounce Search ───────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (messageContainerRef.current) {
      // Scroll to bottom of messages container, NOT window
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [activeConvId, conversations]); // Run on chat change or messages update

  // ── Handlers ──────────────────────────────────────────────────────────────
  const sendMessage = (e) => {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content || !activeConvId) return;

    const newMsg = {
      id: `m${Date.now()}`,
      sender: 'creator', // Default to creator for demo purposes
      content,
      timestamp: new Date().toISOString()
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConvId) {
        return {
          ...conv,
          lastMessage: content,
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    }));

    setNewMessage('');
    
    // Auto scroll to bottom
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  const filteredConversations = useMemo(() => {
    if (!debouncedSearch) return conversations;
    const s = debouncedSearch.toLowerCase();
    return conversations.filter(c => 
      c.withUser.toLowerCase().includes(s) || 
      c.lastMessage.toLowerCase().includes(s)
    );
  }, [conversations, debouncedSearch]);

  const activeConv = conversations.find(c => c.id === activeConvId);

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', background: '#FFF', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
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
          {filteredConversations.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', fontSize: 12, color: '#CCC' }}>
              No results found.
            </div>
          ) : (
            filteredConversations.map(conv => {
              const isActive = activeConvId === conv.id;
              const hasUnread = conv.unreadCount > 0;
              
              return (
                <div 
                  key={conv.id} 
                  onClick={() => setActiveConvId(conv.id)}
                  style={{
                    height: 72, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 12,
                    cursor: 'pointer', borderBottom: '1px solid #F5F5F5', position: 'relative',
                    background: isActive ? '#F8F8F8' : 'transparent',
                    transition: 'background 150ms ease'
                  }}
                  className="conv-row"
                >
                  {isActive && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: '#6366F1' }} />}
                  
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: 40, height: 40, background: '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, color: '#999' }}>
                      {conv.withUser.charAt(0)}
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: 13, fontWeight: hasUnread ? 600 : 500, color: '#000' }}>{conv.withUser}</span>
                      <span style={{ fontSize: 10, color: '#999' }}>{formatTime(conv.messages[conv.messages.length - 1]?.timestamp)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 12, color: hasUnread ? '#333' : '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {conv.lastMessage}
                      </div>
                      {hasUnread && (
                        <div style={{ 
                          minWidth: 16, height: 16, background: '#6366F1', color: '#FFF', 
                          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 700, padding: '0 4px', marginLeft: 8
                        }}>
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right Chat Panel ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F9FAFB' }}>
        {!activeConv ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#CCC' }}>SELECT A CONVERSATION</div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ height: 64, padding: '0 24px', borderBottom: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', gap: 12, background: '#FFF' }}>
              <div style={{ width: 36, height: 36, background: '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: '#999' }}>
                {activeConv.withUser.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#000' }}>{activeConv.withUser}</div>
                <div style={{ fontSize: 11, color: '#22C55E' }}>Active now</div>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={messageContainerRef}
              className="chat-message-container" 
              style={{ 
                flex: 1, 
                padding: '32px 24px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 12,
                overflowY: 'auto',
                height: 'calc(100vh - 128px)'
              }}
            >
              <AnimatePresence initial={false}>
                {activeConv.messages.map((m, i) => {
                  const isCreator = m.sender === 'creator';
                  return (
                    <motion.div 
                      key={m.id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ 
                        alignSelf: isCreator ? 'flex-end' : 'flex-start', 
                        maxWidth: '70%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isCreator ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div style={{ 
                        padding: '12px 16px', 
                        background: isCreator ? '#6366F1' : '#E5E7EB',
                        color: isCreator ? '#FFF' : '#1F2937',
                        fontSize: 14, 
                        lineHeight: 1.5,
                        borderRadius: isCreator ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                      }}>
                        {m.content}
                      </div>
                      <span style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4, padding: '0 4px' }}>
                        {formatTime(m.timestamp)}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div style={{ padding: '20px 24px', background: '#FFF', borderTop: '1px solid #E0E0E0' }}>
              <form onSubmit={sendMessage} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12,
                background: '#F3F4F6',
                padding: '8px 16px',
                borderRadius: 24
              }}>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Write a message..."
                  style={{ 
                    flex: 1, 
                    border: 'none', 
                    outline: 'none', 
                    fontSize: 14, 
                    background: 'transparent',
                    height: 32
                  }}
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  style={{ 
                    background: newMessage.trim() ? '#6366F1' : 'transparent', 
                    border: 'none', 
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: newMessage.trim() ? '#FFF' : '#9CA3AF',
                    cursor: newMessage.trim() ? 'pointer' : 'default',
                    transition: 'all 200ms'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      <style>{`
        .conv-row:hover { background: #FAFAFA !important; }
        .chat-message-container {
          height: calc(100vh - 128px); /* 64px header + ~64px input bar area */
          overflow-y: auto;
          scroll-behavior: auto; /* Using auto for better control as requested */
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      `}</style>
    </div>
  );
}
