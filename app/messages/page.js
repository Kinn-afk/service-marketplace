'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);

    // Fetch fresh user data from database
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/users/${parsedUser.id}`);
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          fetchConversations(data.user.id);
        } else {
          setUser(parsedUser);
          fetchConversations(parsedUser.id);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(parsedUser);
        fetchConversations(parsedUser.id);
      }
    };

    fetchUserData();

    // Listen for profile updates
    const handleProfileUpdate = () => {
      fetchUserData();
    };

    window.addEventListener('userProfileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, [router]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(user.id, selectedUser.user_id);
      const interval = setInterval(() => {
        fetchMessages(user.id, selectedUser.user_id);
      }, 3000); // Refresh every 3 seconds
      return () => clearInterval(interval);
    }
  }, [selectedUser, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async (userId) => {
    try {
      const res = await fetch(`/api/messages?userId=${userId}`);
      const data = await res.json();
      setConversations(data.conversations || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async (userId, conversationWith) => {
    try {
      const res = await fetch(`/api/messages?userId=${userId}&conversationWith=${conversationWith}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: user.id,
          receiver_id: selectedUser.user_id,
          message: newMessage
        })
      });

      if (res.ok) {
        setNewMessage('');
        fetchMessages(user.id, selectedUser.user_id);
        fetchConversations(user.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #232F3E 0%, #131A22 100%)'}}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mb-4" style={{borderColor: '#FEBD69', borderTopColor: 'transparent'}}></div>
          <p className="text-white text-xl font-bold">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1419]">
      {/* Navigation */}
      <nav className="shadow-xl" style={{backgroundColor: '#131A22'}}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black" style={{backgroundColor: '#FEBD69', color: '#131A22'}}>
                SM
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Service Marketplace</h1>
                <p className="text-xs font-semibold" style={{color: '#FEBD69'}}>Messages</p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl" style={{backgroundColor: '#232F3E'}}>
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={user.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg text-black" style={{backgroundColor: '#FEBD69'}}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-white">
                  <div className="font-bold text-sm">{user.name}</div>
                  <div className="text-xs capitalize" style={{color: '#FEBD69'}}>{user.role}</div>
                </div>
              </div>
              <Link href="/dashboard" className="px-5 py-2.5 rounded-lg font-bold text-white hover:text-[#FEBD69] transition">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="px-5 py-2.5 rounded-xl font-bold text-black hover:scale-105 transition" style={{backgroundColor: '#FEBD69'}}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Messages Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-[#131A22] rounded-2xl shadow-2xl overflow-hidden border border-[#232F3E]" style={{height: 'calc(100vh - 200px)'}}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r-2 flex-shrink-0" style={{borderColor: '#232F3E'}}>
              <div className="p-6 border-b-2" style={{borderColor: '#232F3E', backgroundColor: '#FEBD69'}}>
                <h2 className="text-2xl font-black" style={{color: '#131A22'}}>💬 Conversations</h2>
              </div>

              <div className="overflow-y-auto" style={{height: 'calc(100% - 80px)'}}>
                {conversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="font-bold text-lg text-gray-300">No conversations yet</p>
                    <p className="text-sm mt-2 text-gray-400">Start by messaging a provider</p>
                  </div>
                ) : (
                  conversations.map(conv => (
                    <div
                      key={conv.user_id}
                      onClick={() => setSelectedUser(conv)}
                      className={`p-4 border-b cursor-pointer transition hover:bg-[#232F3E] ${
                        selectedUser?.user_id === conv.user_id ? 'border-l-4' : ''
                      }`}
                      style={selectedUser?.user_id === conv.user_id ? {
                        backgroundColor: '#37475A',
                        borderLeftColor: '#FEBD69'
                      } : {}}
                    >
                      <div className="flex items-center gap-3">
                        {conv.user_profile_image ? (
                          <img
                            src={conv.user_profile_image}
                            alt={conv.user_name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white" style={{backgroundColor: '#232F3E'}}>
                            {conv.user_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold truncate text-white">{conv.user_name}</h3>
                            {conv.unread_count > 0 && (
                              <span className="px-2 py-1 rounded-full text-xs font-black text-white" style={{backgroundColor: '#FEBD69', color: '#131A22'}}>
                                {conv.unread_count}
                              </span>
                            )}
                          </div>
                          <p className="text-sm truncate text-gray-300">
                            {conv.last_message || 'No messages yet'}
                          </p>
                          {conv.last_message_time && (
                            <p className="text-xs mt-1 text-gray-400">
                              {new Date(conv.last_message_time).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b-2 flex items-center justify-between" style={{borderColor: '#F3F3F3', backgroundColor: '#232F3E'}}>
                    <Link href={`/users/${selectedUser.user_id}`} className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer">
                      {selectedUser.user_profile_image ? (
                        <img
                          src={selectedUser.user_profile_image}
                          alt={selectedUser.user_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-black" style={{backgroundColor: '#FEBD69'}}>
                          {selectedUser.user_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-black text-white">{selectedUser.user_name}</h3>
                        <p className="text-sm" style={{color: '#FEBD69'}}>{selectedUser.user_email}</p>
                      </div>
                    </Link>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0F1419]">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-md px-6 py-3 rounded-2xl shadow-md ${
                            msg.sender_id === user.id
                              ? 'rounded-br-none'
                              : 'rounded-bl-none'
                          }`}
                          style={msg.sender_id === user.id ? {
                            backgroundColor: '#FEBD69',
                            color: '#131A22'
                          } : {
                            backgroundColor: '#232F3E',
                            color: 'white'
                          }}
                        >
                          <p className="font-semibold break-words">{msg.message}</p>
                          <p className="text-xs mt-2 opacity-75">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-6 border-t-2" style={{borderColor: '#F3F3F3'}}>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-6 py-4 rounded-xl border-2 focus:outline-none focus:border-yellow-400 font-semibold text-white"
                        style={{borderColor: '#E5E7EB'}}
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="px-8 py-4 rounded-xl font-black text-black hover:scale-105 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{backgroundColor: '#FEBD69'}}
                      >
                        {sending ? '⏳' : '📤 Send'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-6">💬</div>
                    <h3 className="text-3xl font-black mb-2 text-white">Select a Conversation</h3>
                    <p className="text-lg text-gray-300">Choose a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}