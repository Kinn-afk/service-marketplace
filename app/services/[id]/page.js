'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ServiceDetail() {
  const router = useRouter();
  const params = useParams();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [bookingData, setBookingData] = useState({
    booking_date: '',
    booking_time: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        const foundService = data.services?.find(s => s.id === parseInt(params.id));
        setService(foundService);
        
        if (foundService) {
          fetch(`/api/reviews?providerId=${foundService.provider_id}`)
            .then(res => {
              if (res.ok) {
                return res.json();
              }
              return { reviews: [] };
            })
            .then(data => setReviews(data.reviews || []))
            .catch(() => setReviews([]));
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError('Failed to load service');
      });
  }, [params.id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: service.id,
          customer_id: user.id,
          ...bookingData
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Booking created successfully! Redirecting to dashboard...');
        setBookingData({ booking_date: '', booking_time: '', notes: '' });
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        setError(data.error || 'Booking failed');
      }
    } catch (err) {
      setError('Booking failed. Please try again.');
    }
  };

  const handleStartConversation = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setSendingMessage(true);
    try {
      // Send initial message
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: user.id,
          receiver_id: service.provider_id,
          message: `Hi! I'm interested in your service: ${service.title}`
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Service not found</h2>
          <Link href="/" className="text-blue-600 hover:underline">Go back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#F3F3F3'}}>
      <nav className="shadow-lg mb-8" style={{backgroundColor: '#131A22'}}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-white hover:opacity-80 transition font-bold">← Back to Home</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Service Details */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2" style={{borderColor: '#F3F3F3'}}>
            <h1 className="text-4xl font-black mb-4" style={{color: '#131A22'}}>{service.title}</h1>
            <p className="mb-4">
              <span className="inline-block px-4 py-2 rounded-lg text-sm font-bold text-white" style={{backgroundColor: '#232F3E'}}>
                {service.category}
              </span>
            </p>
            <p className="text-4xl font-black mb-6" style={{color: '#FEBD69'}}>₱{service.hourly_rate}/hour</p>
            <p className="text-lg mb-8" style={{color: '#37475A'}}>{service.description}</p>
            
            <div className="border-t-2 pt-6 mb-6" style={{borderColor: '#F3F3F3'}}>
              <h3 className="text-xl font-black mb-4" style={{color: '#131A22'}}>Provider Information</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold bg-[#FEBD69] text-[#131A22]">
                  {service.profile_image ? (
                    <img
                      src={service.profile_image}
                      alt={service.provider_name}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  ) : (
                    service.provider_name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg" style={{color: '#131A22'}}>{service.provider_name}</p>
                  {service.phone && <p className="text-sm" style={{color: '#37475A'}}>📞 {service.phone}</p>}
                </div>
              </div>

              {/* Message Provider Button */}
              {user && user.id !== service.provider_id && (
                <button
                  onClick={handleStartConversation}
                  disabled={sendingMessage}
                  className="w-full mt-4 px-6 py-4 rounded-xl font-black text-white hover:opacity-90 transition shadow-lg disabled:opacity-50"
                  style={{backgroundColor: '#232F3E'}}
                >
                  {sendingMessage ? '📤 Starting conversation...' : '💬 Message Provider'}
                </button>
              )}
            </div>

            {/* Reviews */}
            <div className="border-t-2 pt-6" style={{borderColor: '#F3F3F3'}}>
              <h3 className="text-2xl font-black mb-4" style={{color: '#131A22'}}>
                Customer Reviews ({reviews.length})
              </h3>
              {reviews.length === 0 ? (
                <div className="bg-gray-50 p-6 rounded-xl text-center">
                  <p className="font-semibold" style={{color: '#37475A'}}>No reviews yet. Be the first to book and review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold" style={{color: '#131A22'}}>{review.customer_name}</span>
                        <span className="text-yellow-500 text-lg">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                        </span>
                      </div>
                      {review.comment && <p style={{color: '#37475A'}}>{review.comment}</p>}
                      <p className="text-xs mt-2" style={{color: '#909EAE'}}>
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 h-fit sticky top-8 border-2" style={{borderColor: '#F3F3F3'}}>
            <h2 className="text-3xl font-black mb-6" style={{color: '#131A22'}}>Book This Service</h2>
            {error && (
              <div className="mb-6 p-4 rounded-lg border-2 border-red-200" style={{backgroundColor: '#FEE2E2'}}>
                <p className="text-red-700 font-bold">⚠️ {error}</p>
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 rounded-lg border-2 border-green-200" style={{backgroundColor: '#D1FAE5'}}>
                <p className="text-green-700 font-bold">✅ {success}</p>
              </div>
            )}
            
            {!user ? (
              <div className="text-center">
                <p className="mb-6 font-semibold" style={{color: '#37475A'}}>Please login to book this service</p>
                <Link href="/login" className="block px-6 py-4 rounded-xl font-bold text-black hover:scale-105 transition shadow-lg" style={{backgroundColor: '#FEBD69'}}>
                  Login to Book
                </Link>
                <p className="text-sm mt-4" style={{color: '#37475A'}}>
                  Don't have an account? <Link href="/register" className="font-bold hover:underline" style={{color: '#FEBD69'}}>Register here</Link>
                </p>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#131A22'}}>Select Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-yellow-500 transition"
                    style={{borderColor: '#E5E7EB'}}
                    value={bookingData.booking_date}
                    onChange={(e) => setBookingData({...bookingData, booking_date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#131A22'}}>Select Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-yellow-500 transition"
                    style={{borderColor: '#E5E7EB'}}
                    value={bookingData.booking_time}
                    onChange={(e) => setBookingData({...bookingData, booking_time: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#131A22'}}>Special Requests (Optional)</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-yellow-500 transition"
                    style={{borderColor: '#E5E7EB'}}
                    rows="4"
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                    placeholder="Any special requirements or notes for the provider..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 rounded-xl font-black text-lg text-black hover:scale-105 transition shadow-lg"
                  style={{backgroundColor: '#FEBD69'}}
                >
                  Confirm Booking →
                </button>

                <p className="text-xs text-center" style={{color: '#37475A'}}>
                  Rate: ₱{service.hourly_rate}/hour • You'll be charged based on actual service time
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}