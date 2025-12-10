'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [userData, setUserData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }

    fetchUserProfile();
  }, [params.id]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`/api/users/${params.id}`);
      const data = await res.json();

      if (res.ok) {
        setUserData(data);
      } else {
        setError(data.error || 'Failed to load user profile');
      }
    } catch (err) {
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = async () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setSendingMessage(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: currentUser.id,
          receiver_id: userData.user.id,
          message: `Hi ${userData.user.name}! I found your profile on the marketplace.`
        })
      });

      if (res.ok) {
        router.push('/messages');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setSendingMessage(false);
    }
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
          <p className="text-white text-xl font-semibold">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-[#0F1419]">
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
                <Link href="/dashboard" className="text-white hover:text-[#FEBD69] transition font-semibold">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="px-5 py-2.5 rounded-lg font-bold text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] transition">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-[#131A22] rounded-xl border border-[#232F3E] p-8 text-center">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-bold text-white mb-4">User Not Found</h2>
            <p className="text-gray-300 mb-6">{error || 'The user profile you are looking for does not exist.'}</p>
            <Link href="/marketplace" className="inline-block px-6 py-3 rounded-lg font-semibold text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] transition">
              Browse Services →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { user, services, reviews } = userData;

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
              {currentUser && (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#232F3E]">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg bg-[#FEBD69] text-[#131A22]">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-white">
                      <div className="font-bold">{currentUser.name}</div>
                      <div className="text-xs capitalize text-[#FEBD69]">{currentUser.role}</div>
                    </div>
                  </div>
                  <Link href="/dashboard" className="text-white hover:text-[#FEBD69] transition font-semibold">
                    Dashboard
                  </Link>
                  <Link href="/messages" className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white hover:bg-white hover:text-black transition">
                    <span>💬</span>
                    <span className="text-sm">Messages</span>
                  </Link>
                  <button onClick={handleLogout} className="px-5 py-2.5 rounded-lg font-bold text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] transition">
                    Logout
                  </button>
                </>
              )}
              {!currentUser && (
                <>
                  <Link href="/login" className="px-6 py-2.5 rounded-lg font-bold text-white hover:bg-white hover:text-black transition">
                    Login
                  </Link>
                  <Link href="/register" className="px-6 py-2.5 rounded-xl font-bold text-black hover:scale-105 transition" style={{backgroundColor: '#FEBD69'}}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-[#131A22] rounded-xl border border-[#232F3E] overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-40 bg-gradient-to-r from-[#232F3E] to-[#37475A]">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                {/* Profile Picture */}
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={user.name}
                    className="w-32 h-32 rounded-full border-4 object-cover border-[#FEBD69]"
                  />
                ) : (
                  <div
                    className="w-32 h-32 rounded-full border-4 flex items-center justify-center text-5xl font-black text-[#131A22] border-[#FEBD69]"
                    style={{backgroundColor: '#FEBD69'}}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 pb-8 px-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black mb-2 text-white">{user.name}</h2>
              <p className="text-lg font-semibold capitalize px-4 py-2 rounded-lg inline-block bg-[#FEBD69] text-[#131A22]">
                {user.role === 'provider' ? '⭐ Service Provider' : '👤 Customer'}
              </p>
            </div>

            {/* Profile Details */}
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-[#232F3E] rounded-xl border border-[#37475A] p-6">
                <h3 className="text-2xl font-black text-white mb-4">Profile Information</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-[#37475A] rounded-lg border border-[#455768]">
                    <span className="text-2xl">👤</span>
                    <div>
                      <p className="text-sm font-bold text-[#FEBD69]">Name</p>
                      <p className="text-lg font-bold text-white">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-[#37475A] rounded-lg border border-[#455768]">
                    <span className="text-2xl">📧</span>
                    <div>
                      <p className="text-sm font-bold text-[#FEBD69]">Email</p>
                      <p className="text-lg font-bold text-white">{user.email}</p>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="flex items-center gap-4 p-4 bg-[#37475A] rounded-lg border border-[#455768]">
                      <span className="text-2xl">📱</span>
                      <div>
                        <p className="text-sm font-bold text-[#FEBD69]">Phone</p>
                        <p className="text-lg font-bold text-white">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 p-4 bg-[#37475A] rounded-lg border border-[#455768]">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="text-sm font-bold text-[#FEBD69]">Member Since</p>
                      <p className="text-lg font-bold text-white">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services Section (for providers) */}
              {user.role === 'provider' && services.length > 0 && (
                <div className="bg-[#232F3E] rounded-xl border border-[#37475A] p-6">
                  <h3 className="text-2xl font-black text-white mb-4">Services Offered ({services.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map(service => (
                      <div key={service.id} className="bg-[#37475A] border border-[#455768] rounded-xl p-4 hover:border-[#FEBD69] transition">
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
                </div>
              )}

              {/* Reviews Section (for providers) */}
              {user.role === 'provider' && reviews.length > 0 && (
                <div className="bg-[#232F3E] rounded-xl border border-[#37475A] p-6">
                  <h3 className="text-2xl font-black text-white mb-4">Customer Reviews ({reviews.length})</h3>
                  <div className="space-y-4">
                    {reviews.slice(0, 5).map(review => (
                      <div key={review.id} className="bg-[#37475A] border border-[#455768] rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          {review.customer_image ? (
                            <img
                              src={review.customer_image}
                              alt={review.customer_name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-[#FEBD69]">
                              {review.customer_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-white">{review.customer_name}</p>
                            <div className="text-yellow-500 text-sm">
                              {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                            </div>
                          </div>
                        </div>
                        {review.comment && <p className="text-gray-300 mb-2">{review.comment}</p>}
                        <p className="text-xs text-[#FEBD69]">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                    {reviews.length > 5 && (
                      <p className="text-center text-gray-400 text-sm">
                        And {reviews.length - 5} more review{reviews.length - 5 !== 1 ? 's' : ''}...
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                {currentUser && currentUser.id !== user.id && (
                  <button
                    onClick={handleStartConversation}
                    disabled={sendingMessage}
                    className="flex-1 py-3 rounded-lg font-bold text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] transition disabled:opacity-50"
                  >
                    {sendingMessage ? '📤 Starting conversation...' : '💬 Message User'}
                  </button>
                )}
                <Link
                  href="/marketplace"
                  className="flex-1 py-3 rounded-lg font-bold text-white bg-[#232F3E] hover:bg-[#2d3a4a] transition text-center"
                >
                  Browse Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
