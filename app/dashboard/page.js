'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [workPhotos, setWorkPhotos] = useState({});
  const [uploadingPhotos, setUploadingPhotos] = useState({});
  const [reviewModal, setReviewModal] = useState({ open: false, booking: null });
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchData(parsedUser);

    // Listen for profile updates
    const handleProfileUpdate = () => {
      const updatedUserData = localStorage.getItem('user');
      if (updatedUserData) {
        const updatedUser = JSON.parse(updatedUserData);
        setUser(updatedUser);
      }
    };

    window.addEventListener('userProfileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, [router]);

  useEffect(() => {
    if (activeTab === 'bookings' && user && bookings.length > 0) {
      // Fetch work photos for completed bookings
      const completedBookings = bookings.filter(b => b.status === 'completed');
      completedBookings.forEach(booking => {
        fetchWorkPhotos(booking.id);
      });
    }
  }, [activeTab, user, bookings]);

  useEffect(() => {
    if (activeTab === 'messages' && user) {
      fetchConversations();
    }
  }, [activeTab, user]);

  const fetchData = async (userData) => {
    try {
      const bookingsRes = await fetch(`/api/bookings?userId=${userData.id}`);
      const bookingsData = await bookingsRes.json();
      const userBookings = bookingsData.bookings || [];
      setBookings(userBookings);

      setStats({
        total: userBookings.length,
        pending: userBookings.filter(b => b.status === 'pending').length,
        confirmed: userBookings.filter(b => b.status === 'confirmed').length,
        completed: userBookings.filter(b => b.status === 'completed').length
      });

      if (userData.role === 'provider') {
        const servicesRes = await fetch('/api/services');
        const servicesData = await servicesRes.json();
        const myServices = servicesData.services?.filter(s => s.provider_id === userData.id) || [];
        setServices(myServices);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status: newStatus })
      });

      if (res.ok) {
        fetchData(user);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const handlePhotoUpload = async (bookingId, file) => {
    if (!file) return;

    setUploadingPhotos(prev => ({ ...prev, [bookingId]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      // First upload the file
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadRes.ok) {
        throw new Error('File upload failed');
      }

      const uploadData = await uploadRes.json();
      const photoUrl = uploadData.url;

      // Then save the photo record
      const photoRes = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId,
          uploaded_by: user.id,
          photo_url: photoUrl,
          caption: ''
        })
      });

      if (photoRes.ok) {
        // Refresh work photos for this booking
        fetchWorkPhotos(bookingId);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploadingPhotos(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const fetchWorkPhotos = async (bookingId) => {
    try {
      const res = await fetch(`/api/photos?bookingId=${bookingId}`);
      const data = await res.json();
      setWorkPhotos(prev => ({ ...prev, [bookingId]: data.photos || [] }));
    } catch (error) {
      console.error('Error fetching work photos:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewModal.booking) return;

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: reviewModal.booking.id,
          customer_id: user.id,
          provider_id: reviewModal.booking.provider_id,
          rating: reviewData.rating,
          comment: reviewData.comment
        })
      });

      if (res.ok) {
        setReviewModal({ open: false, booking: null });
        setReviewData({ rating: 5, comment: '' });
        fetchData(user); // Refresh data to update any review status
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Review submission error:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch(`/api/messages?userId=${user.id}`);
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const res = await fetch(`/api/messages?userId=${user.id}&conversationId=${conversationId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSendingMessage(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: user.id,
          receiver_id: selectedConversation.other_user_id,
          message: newMessage.trim()
        })
      });

      if (res.ok) {
        setNewMessage('');
        fetchMessages(selectedConversation.other_user_id);
        fetchConversations(); // Refresh conversations to update last message
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const formatDateTime = (dateObj, timeStr) => {
    let date;

    // If dateObj is already a full ISO string, use it directly
    if (typeof dateObj === 'string' && dateObj.includes('T')) {
      date = new Date(dateObj);
    } else {
      // Otherwise, combine date and time
      const dateTimeString = `${dateObj}T${timeStr}`;
      date = new Date(dateTimeString);
    }

    const dateOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);

    const timeOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

    return { date: formattedDate, time: formattedTime };
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1419]">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 rounded-full animate-spin mb-4 border-[#FEBD69] border-t-transparent"></div>
          <p className="text-white text-xl font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0F1419]">
      {/* Navigation */}
      <nav className="bg-[#131A22] border-b border-[#232F3E]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold bg-[#FEBD69] text-[#131A22]">
                SM
              </div>
              <h1 className="text-2xl font-bold text-white">Service Marketplace</h1>
            </Link>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#232F3E]">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg bg-[#FEBD69] text-[#131A22]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-white">
                  <div className="font-bold">{user.name}</div>
                  <div className="text-xs capitalize text-[#FEBD69]">{user.role}</div>
                </div>
              </div>
              <Link href="/" className="text-white hover:text-[#FEBD69] transition font-semibold">
                Home
              </Link>

              <Link href="/messages" className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white hover:bg-white hover:text-black transition">
                <span>💬</span>
                <span className="text-sm">Messages</span>
              </Link>
              <Link href="/profile" className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white hover:bg-white hover:text-black transition">
                <span>👤</span>
                <span className="text-sm">Profile</span>
              </Link>
              <button onClick={handleLogout} className="px-5 py-2.5 rounded-lg font-bold text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] transition">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-[#131A22] border-b border-[#232F3E]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, <span className="text-[#FEBD69]">{user.name}</span>!
          </h1>
          <p className="text-lg text-gray-300">
            {user.role === 'provider' ? 'Manage your services and grow your business' : 'Track bookings and discover new services'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Bookings', value: stats.total, icon: '📋', bg: 'bg-[#FEBD69]', text: 'text-[#131A22]' },
            { label: 'Pending', value: stats.pending, icon: '⏳', bg: 'bg-[#232F3E]', text: 'text-white' },
            { label: 'Confirmed', value: stats.confirmed, icon: '✅', bg: 'bg-[#37475A]', text: 'text-white' },
            { label: 'Completed', value: stats.completed, icon: '🎉', bg: 'bg-green-700', text: 'text-white' }
          ].map((stat, i) => (
            <div key={i} className={`rounded-xl p-6 shadow-lg ${stat.bg} ${stat.text}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold opacity-90">{stat.label}</div>
                <div className="text-2xl">{stat.icon}</div>
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions & Recent Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-[#131A22] rounded-xl border border-[#232F3E] p-6">
              <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.role === 'provider' ? (
                  <>
                    <Link href="/services/create" 
                      className="group p-4 rounded-lg bg-[#FEBD69] hover:bg-[#e5a958] transition text-center"
                    >
                      <div className="text-2xl mb-2">➕</div>
                      <div className="font-semibold text-[#131A22]">Add New Service</div>
                    </Link>
                    <Link href="/marketplace"
                      className="group p-4 rounded-lg bg-[#232F3E] hover:bg-[#2d3a4a] transition text-center border border-[#37475A]"
                    >
                      <div className="text-2xl mb-2 text-white">🏪</div>
                      <div className="font-semibold text-white">View Marketplace</div>
                    </Link>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="group p-4 rounded-lg bg-[#37475A] hover:bg-[#455768] transition text-center border border-[#455768] w-full"
                    >
                      <div className="text-2xl mb-2 text-white">📅</div>
                      <div className="font-semibold text-white">Manage Bookings</div>
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/"
                      className="group p-4 rounded-lg bg-[#FEBD69] hover:bg-[#e5a958] transition text-center"
                    >
                      <div className="text-2xl mb-2">🔍</div>
                      <div className="font-semibold text-[#131A22]">Browse Services</div>
                    </Link>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="group p-4 rounded-lg bg-[#232F3E] hover:bg-[#2d3a4a] transition text-center border border-[#37475A] w-full"
                    >
                      <div className="text-2xl mb-2 text-white">📅</div>
                      <div className="font-semibold text-white">My Bookings</div>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#131A22] rounded-xl border border-[#232F3E] p-6">
              <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📭</div>
                  <p className="text-lg font-semibold text-white mb-2">No bookings yet</p>
                  {user.role === 'customer' && (
                    <Link href="/marketplace" className="inline-block mt-4 px-6 py-3 rounded-lg font-semibold text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] transition">
                      Browse Services →
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg bg-[#232F3E] border border-[#37475A] hover:border-[#FEBD69] transition">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{booking.service_title}</h4>
                        <div className="text-sm text-gray-300 space-y-1">
                          <p>📅 {formatDateTime(booking.booking_date, booking.booking_time).date} • 🕐 {formatDateTime(booking.booking_date, booking.booking_time).time}</p>
                          <p>{user.role === 'provider' ? `👤 ${booking.customer_name}` : `🛠️ ${booking.provider_name}`}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'confirmed' ? 'bg-green-900 text-green-200' :
                        booking.status === 'completed' ? 'bg-blue-900 text-blue-200' :
                        booking.status === 'cancelled' ? 'bg-red-900 text-red-200' :
                        'bg-yellow-900 text-yellow-200'
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Tabs Navigation */}
          <div className="space-y-8">
            {/* Tabs Navigation */}
            <div className="bg-[#131A22] rounded-xl border border-[#232F3E] p-6">
              <h3 className="text-xl font-bold text-white mb-4">Navigation</h3>
              <div className="space-y-2">
                {[
                  { id: 'overview', label: '📊 Overview', active: activeTab === 'overview' },
                  ...(user.role === 'provider' ? [{ id: 'services', label: `🛠️ My Services (${services.length})`, active: activeTab === 'services' }] : []),
                  { id: 'bookings', label: `📅 ${user.role === 'provider' ? 'Bookings Received' : 'My Bookings'} (${bookings.length})`, active: activeTab === 'bookings' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setTimeout(() => {
                        document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      tab.active
                        ? 'bg-[#FEBD69] text-[#131A22] font-semibold'
                        : 'text-gray-300 hover:bg-[#232F3E] hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-[#131A22] rounded-xl border border-[#232F3E] p-6">
              <h3 className="text-xl font-bold text-white mb-4">Need Help?</h3>
              <p className="text-gray-300 mb-4">
                {user.role === 'provider' 
                  ? 'Get tips on growing your service business and attracting more customers.'
                  : 'Learn how to book services and manage your appointments effectively.'
                }
              </p>
              <Link href="/guide" className="block w-full p-3 rounded-lg bg-[#FEBD69] text-[#131A22] hover:bg-[#e5a958] transition font-semibold text-center">
                View Guide →
              </Link>
            </div>
          </div>
        </div>

        {/* Services Tab Content */}
        {activeTab === 'services' && user.role === 'provider' && (
          <div id="services" className="mt-8 bg-[#131A22] rounded-xl border border-[#232F3E] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">My Services</h3>
              <Link href="/services/create" 
                className="px-6 py-3 rounded-lg font-semibold text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] transition"
              >
                ➕ Add Service
              </Link>
            </div>
            {services.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🔧</div>
                <h4 className="text-xl font-bold text-white mb-2">No services yet</h4>
                <p className="text-gray-300 mb-6">Create your first service to start receiving bookings</p>
                <Link href="/services/create" 
                  className="inline-block px-6 py-3 rounded-lg font-semibold text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] transition"
                >
                  Create Your First Service →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map(service => (
                  <div key={service.id} className="bg-[#232F3E] border border-[#37475A] rounded-xl p-6 hover:border-[#FEBD69] transition">
                    <h4 className="text-lg font-bold text-white mb-2">{service.title}</h4>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FEBD69] text-[#131A22] mb-3">
                      {service.category}
                    </span>
                    <p className="text-gray-300 mb-4 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-[#FEBD69]">₱{service.hourly_rate}/hr</div>
                      <Link href={`/services/${service.id}`}
                        className="px-4 py-2 rounded-lg font-semibold text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] transition"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab Content */}
        {activeTab === 'bookings' && (
          <div id="bookings" className="mt-8 bg-[#131A22] rounded-xl border border-[#232F3E] overflow-hidden">
            <div className="p-6 border-b border-[#232F3E]">
              <h3 className="text-2xl font-bold text-white">
                {user.role === 'provider' ? 'Bookings Received' : 'My Bookings'}
              </h3>
            </div>
            {bookings.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-5xl mb-4">📅</div>
                <p className="text-lg font-semibold text-white">No bookings yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#232F3E]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Service</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        {user.role === 'provider' ? 'Customer' : 'Provider'}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Date & Time</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                      {user.role === 'provider' && (
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                      )}
                      {user.role === 'customer' && bookings.some(b => b.status === 'completed') && (
                        <>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Work Photos</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Review</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#232F3E]">
                    {bookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-[#232F3E] transition">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{booking.service_title}</div>
                          {booking.notes && (
                            <div className="text-sm text-gray-300 mt-1">Note: {booking.notes}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">
                            {user.role === 'provider' ? booking.customer_name : booking.provider_name}
                          </div>
                          <div className="text-sm text-gray-300">
                            {user.role === 'provider' ? booking.customer_email : booking.provider_email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{formatDateTime(booking.booking_date, booking.booking_time).date}</div>
                          <div className="text-sm text-gray-300">{formatDateTime(booking.booking_date, booking.booking_time).time}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'confirmed' ? 'bg-green-900 text-green-200' :
                            booking.status === 'completed' ? 'bg-blue-900 text-blue-200' :
                            booking.status === 'cancelled' ? 'bg-red-900 text-red-200' :
                            'bg-yellow-900 text-yellow-200'
                          }`}>
                            {booking.status.toUpperCase()}
                          </span>
                        </td>
                        {user.role === 'provider' && (
                          <td className="px-6 py-4">
                            {booking.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                  className="px-3 py-1 rounded text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                  className="px-3 py-1 rounded text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => handleStatusUpdate(booking.id, 'completed')}
                                className="px-3 py-1 rounded text-sm font-semibold text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] transition"
                              >
                                Complete
                              </button>
                            )}
                            {booking.status === 'completed' && (
                              <div className="space-y-2">
                                <div className="text-xs text-gray-400 mb-2">Work Photos</div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handlePhotoUpload(booking.id, e.target.files[0])}
                                  className="text-xs text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#FEBD69] file:text-[#131A22] hover:file:bg-[#e5a958]"
                                  disabled={uploadingPhotos[booking.id]}
                                />
                                {uploadingPhotos[booking.id] && (
                                  <div className="text-xs text-[#FEBD69]">Uploading...</div>
                                )}
                                {workPhotos[booking.id] && workPhotos[booking.id].length > 0 && (
                                  <div className="text-xs text-green-400">
                                    {workPhotos[booking.id].length} photo{workPhotos[booking.id].length !== 1 ? 's' : ''} uploaded
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        )}
                        {user.role === 'customer' && bookings.some(b => b.status === 'completed') && (
                          <>
                            <td className="px-6 py-4">
                              {booking.status === 'completed' && workPhotos[booking.id] && workPhotos[booking.id].length > 0 ? (
                                <div className="flex gap-2 flex-wrap">
                                  {workPhotos[booking.id].slice(0, 3).map((photo, index) => (
                                    <img
                                      key={index}
                                      src={photo.photo_url}
                                      alt={`Work photo ${index + 1}`}
                                      className="w-12 h-12 rounded-lg object-cover border border-[#37475A] hover:border-[#FEBD69] transition cursor-pointer"
                                      onClick={() => window.open(photo.photo_url, '_blank')}
                                    />
                                  ))}
                                  {workPhotos[booking.id].length > 3 && (
                                    <div className="w-12 h-12 rounded-lg bg-[#232F3E] border border-[#37475A] flex items-center justify-center text-xs text-gray-300">
                                      +{workPhotos[booking.id].length - 3}
                                    </div>
                                  )}
                                </div>
                              ) : booking.status === 'completed' ? (
                                <div className="text-xs text-gray-400">No photos yet</div>
                              ) : null}
                            </td>
                            <td className="px-6 py-4">
                              {booking.status === 'completed' && (
                                <button
                                  onClick={() => setReviewModal({ open: true, booking })}
                                  className="px-3 py-1 rounded text-sm font-semibold text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] transition"
                                >
                                  Review
                                </button>
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Messages Tab Content */}
        {activeTab === 'messages' && (
          <div id="messages" className="mt-8 bg-[#131A22] rounded-xl border border-[#232F3E] overflow-hidden">
            <div className="p-6 border-b border-[#232F3E]">
              <h3 className="text-2xl font-bold text-white">Messages</h3>
            </div>
            <div className="flex h-96">
              {/* Conversations List */}
              <div className="w-1/3 border-r border-[#232F3E]">
                <div className="p-4 border-b border-[#232F3E]">
                  <h4 className="text-lg font-semibold text-white">Conversations</h4>
                </div>
                <div className="overflow-y-auto h-full">
                  {conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">
                      No conversations yet
                    </div>
                  ) : (
                    conversations.map((conversation, index) => (
                      <button
                        key={`${conversation.other_user_id}-${index}`}
                        onClick={() => {
                          setSelectedConversation(conversation);
                          fetchMessages(conversation.other_user_id);
                        }}
                        className={`w-full p-4 text-left hover:bg-[#232F3E] transition ${
                          selectedConversation?.other_user_id === conversation.other_user_id ? 'bg-[#FEBD69] text-[#131A22]' : 'text-white'
                        }`}
                      >
                        <div className="font-semibold">{conversation.other_user_name}</div>
                        <div className="text-sm opacity-75 truncate">{conversation.last_message}</div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <>
                    <div className="p-4 border-b border-[#232F3E]">
                      <h4 className="text-lg font-semibold text-white">{selectedConversation.other_user_name}</h4>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map(message => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              message.sender_id === user.id
                                ? 'bg-[#FEBD69] text-[#131A22]'
                                : 'bg-[#232F3E] text-white'
                            }`}
                          >
                            <p>{message.message}</p>
                            <p className="text-xs opacity-75 mt-1">
                              {new Date(message.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-[#232F3E]">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 p-3 rounded-lg bg-[#232F3E] border border-[#37475A] text-white placeholder-gray-400 focus:border-[#FEBD69] focus:outline-none"
                          disabled={sendingMessage}
                        />
                        <button
                          type="submit"
                          disabled={sendingMessage || !newMessage.trim()}
                          className="px-6 py-3 rounded-lg font-semibold text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] transition disabled:opacity-50"
                        >
                          {sendingMessage ? 'Sending...' : 'Send'}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-400">
                    Select a conversation to start messaging
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {reviewModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#131A22] rounded-xl border border-[#232F3E] p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Leave a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-white mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                        className={`text-2xl ${star <= reviewData.rating ? 'text-[#FEBD69]' : 'text-gray-400'} hover:text-[#FEBD69] transition`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-white mb-2">Comment</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full p-3 rounded-lg bg-[#232F3E] border border-[#37475A] text-white placeholder-gray-400 focus:border-[#FEBD69] focus:outline-none"
                    rows="4"
                    placeholder="Share your experience..."
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewModal({ open: false, booking: null })}
                    className="flex-1 px-4 py-2 rounded-lg font-semibold text-white bg-[#232F3E] hover:bg-[#2d3a4a] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex-1 px-4 py-2 rounded-lg font-semibold text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] transition disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}