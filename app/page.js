'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  // ===== STATE MANAGEMENT =====
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ===== EFFECTS =====
  useEffect(() => {
    // Check for logged-in user
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch services data
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data.services || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ===== EVENT HANDLERS =====
  const scrollToServices = (e) => {
    e.preventDefault();
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-[#0F1419]">
      {/* ===== NAVIGATION ===== */}
      <nav className="bg-[#131A22] border-b border-[#232F3E] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold bg-[#FEBD69] text-[#131A22]">
              SM
            </div>
            <h1 className="text-2xl font-bold text-white">Service Marketplace</h1>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#232F3E]">
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={user.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg bg-[#FEBD69] text-[#131A22]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-white">
                    <div className="font-bold">{user.name}</div>
                    <div className="text-xs capitalize text-[#FEBD69]">{user.role}</div>
                  </div>
                </div>
                <Link href="/dashboard" className="px-6 py-2.5 rounded-lg font-semibold text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] transition">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/register" className="px-6 py-2.5 rounded-lg font-semibold border-2 border-[#FEBD69] text-[#FEBD69] hover:bg-[#FEBD69] hover:text-[#131A22] transition">
                  Register
                </Link>
                <Link href="/login" className="px-6 py-2.5 rounded-lg font-semibold text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] transition">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <div className="relative overflow-hidden bg-[#131A22] border-b border-[#232F3E]">
        <div className="absolute inset-0 opacity-10 bg-radial-gradient(circle at 20% 50%, #FEBD69 0%, transparent 50%)">
        </div>
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-block px-4 py-2 rounded-full mb-6 font-semibold text-sm bg-[#FEBD69] text-[#131A22]">
                🎯 #1 Service Marketplace
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Find <span className="text-[#FEBD69]">Premium</span> Local Services
              </h2>
              <p className="text-xl mb-8 text-gray-300">
                Connect with verified professionals in your area. Quality service providers for every need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href={user ? "/dashboard" : "/login"} 
                  className="text-center px-8 py-4 rounded-lg font-bold text-lg text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] hover:scale-105 transition shadow-xl"
                >
                  {user ? '→ Go to Dashboard' : '→ Get Started Free'}
                </Link>
                <Link
                  href="/marketplace"
                  className="px-8 py-4 rounded-lg font-bold text-lg bg-transparent border-2 border-[#FEBD69] text-white hover:bg-[#FEBD69] hover:text-[#131A22] transition"
                >
                  Browse Services
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-[#232F3E] border border-[#37475A] rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: '🔧', name: 'Plumbing', count: '120+' },
                    { icon: '⚡', name: 'Electrical', count: '95+' },
                    { icon: '🧹', name: 'Cleaning', count: '200+' },
                    { icon: '📚', name: 'Tutoring', count: '150+' }
                  ].map((cat, i) => (
                    <div key={i} className={`text-center p-5 rounded-xl cursor-pointer hover:scale-110 transition ${
                      i % 2 === 0 ? 'bg-[#37475A]' : 'bg-[#2d3a4a]'
                    }`}>
                      <div className="text-4xl mb-2">{cat.icon}</div>
                      <div className="font-bold text-lg text-white">{cat.name}</div>
                      <div className="text-sm font-semibold text-[#FEBD69]">{cat.count} Providers</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FEATURES SECTION ===== */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4 text-white">Why Choose Our Platform?</h3>
          <p className="text-xl text-gray-300">Premium features for the best experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '✓', title: 'Verified Experts', desc: 'Every provider is background-checked and verified', bg: 'bg-[#FEBD69]' },
            { icon: '💰', title: 'Best Prices', desc: 'Competitive rates with no hidden charges', bg: 'bg-[#232F3E]' },
            { icon: '⭐', title: 'Trusted Reviews', desc: 'Real feedback from verified customers', bg: 'bg-[#37475A]' }
          ].map((feature, i) => (
            <div key={i} className="group">
              <div className="bg-[#131A22] border border-[#232F3E] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2">
                <div className={`w-16 h-16 rounded-xl mx-auto mb-6 flex items-center justify-center text-3xl text-white ${feature.bg}`}>
                  {feature.icon}
                </div>
                <h4 className="text-2xl font-bold mb-3 text-center text-white">{feature.title}</h4>
                <p className="text-center text-gray-300">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Replace Services Section with this Promotional Section */}
      <div className="py-20 bg-[#131A22] border-y border-[#232F3E]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-5xl font-black mb-6 text-white">Ready to Find Your Perfect Service?</h3>
          <p className="text-2xl mb-12 text-gray-300">Join thousands of satisfied customers</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-[#232F3E] border border-[#37475A] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition hover:-translate-y-2">
              <div className="text-6xl mb-4">👥</div>
              <div className="text-4xl font-black mb-2 text-[#FEBD69]">500+</div>
              <div className="font-bold text-white">Verified Providers</div>
            </div>
            <div className="bg-[#37475A] border border-[#37475A] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition hover:-translate-y-2">
              <div className="text-6xl mb-4">📅</div>
              <div className="text-4xl font-black mb-2 text-[#FEBD69]">10K+</div>
              <div className="font-bold text-white">Bookings Completed</div>
            </div>
            <div className="bg-[#232F3E] border border-[#37475A] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition hover:-translate-y-2">
              <div className="text-6xl mb-4">⭐</div>
              <div className="text-4xl font-black mb-2 text-[#FEBD69]">4.9</div>
              <div className="font-bold text-white">Average Rating</div>
            </div>
          </div>

          <Link
            href="/marketplace"
            className="inline-block px-12 py-5 rounded-2xl font-black text-2xl text-[#131A22] hover:scale-105 transition shadow-2xl"
            style={{backgroundColor: '#FEBD69'}}
          >
            Explore Marketplace →
          </Link>
        </div>
      </div>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <div className="py-20 bg-[#0F1419]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold mb-4 text-white">How It Works</h3>
            <p className="text-xl text-gray-300">Three simple steps to quality service</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { num: '1', title: 'Browse & Compare', desc: 'Explore verified providers with transparent pricing and real reviews', icon: '🔍' },
              { num: '2', title: 'Book Instantly', desc: 'Choose your time slot and confirm your appointment in seconds', icon: '📅' },
              { num: '3', title: 'Get Quality Service', desc: 'Meet your provider and enjoy professional, reliable service', icon: '⭐' }
            ].map((step, i) => (
              <div key={i} className="text-center group">
                <div className="relative inline-block mb-8">
                  <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-5xl font-bold text-[#131A22] bg-[#FEBD69] transition transform group-hover:scale-110 group-hover:rotate-3">
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white bg-[#131A22]">
                    {step.num}
                  </div>
                </div>
                <h4 className="text-2xl font-bold mb-4 text-white">{step.title}</h4>
                <p className="text-lg text-gray-300">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CALL TO ACTION ===== */}
      <div className="py-24 relative overflow-hidden bg-[#131A22] border-t border-[#232F3E]">
        <div className="absolute inset-0 opacity-10 bg-radial-gradient(circle at 80% 20%, #FEBD69 0%, transparent 50%)">
        </div>
        <div className="max-w-5xl mx-auto px-4 text-center relative">
          <h3 className="text-5xl font-bold mb-6 text-white">Ready to Experience Premium Service?</h3>
          <p className="text-2xl mb-10 text-gray-300">
            Join thousands of satisfied customers today
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register" className="px-10 py-5 rounded-xl font-bold text-xl text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] hover:scale-105 transition shadow-2xl">
              Get Started Free →
            </Link>
            <Link href="/login" className="px-10 py-5 rounded-xl font-bold text-xl bg-transparent border-2 border-[#FEBD69] text-white hover:bg-[#FEBD69] hover:text-[#131A22] transition">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 bg-[#131A22] border-t border-[#232F3E]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold bg-[#FEBD69] text-[#131A22]">
              SM
            </div>
            <p className="text-2xl font-bold text-white">Service Marketplace</p>
          </div>
          <p className="text-center text-gray-400 mb-2">Premium local services at your fingertips</p>
          <p className="text-center text-sm text-gray-500">© 2024 Service Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}