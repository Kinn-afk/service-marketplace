'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Marketplace() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data.services || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const categories = ['all', 'Plumbing', 'Electrical', 'Cleaning', 'Tutoring', 'Carpentry', 'Other'];

  const filteredServices = services.filter(service => {
    const matchesFilter = filter === 'all' || service.category === filter;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0F1419]">
      {/* Navigation */}
      <nav className="shadow-xl sticky top-0 z-50" style={{backgroundColor: '#131A22'}}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black" style={{backgroundColor: '#FEBD69', color: '#131A22'}}>
                SM
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Service Marketplace</h1>
                <p className="text-xs font-semibold" style={{color: '#FEBD69'}}>Browse Services</p>
              </div>
            </Link>

            <div className="flex items-center gap-6">
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
                  <Link href="/dashboard" className="px-6 py-2.5 rounded-lg font-bold text-white hover:bg-white hover:text-black transition">
                    Dashboard
                  </Link>
                  <Link href="/messages" className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white hover:text-[#FEBD69] transition">
                    <span>💬</span>
                    <span className="text-sm">Messages</span>
                  </Link>
                  <Link href="/profile" className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white hover:text-[#FEBD69] transition">
                    <span>👤</span>
                    <span className="text-sm">Profile</span>
                  </Link>
                  <button onClick={handleLogout} className="px-5 py-2.5 rounded-lg font-bold text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] transition">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/register" className="px-6 py-2.5 rounded-lg font-bold bg-white hover:opacity-90 transition" style={{color: '#131A22'}}>
                    Register
                  </Link>
                  <Link href="/login" className="px-6 py-2.5 rounded-xl font-bold text-black hover:scale-105 transition" style={{backgroundColor: '#FEBD69'}}>
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-16 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #232F3E 0%, #37475A 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <h2 className="text-5xl font-black text-white mb-4">🏪 Service Marketplace</h2>
          <p className="text-xl text-gray-300 mb-8">Browse and book from hundreds of verified service providers</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="🔍 Search services, providers, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-xl text-lg font-semibold text-white focus:outline-none focus:ring-4 shadow-lg"
              style={{borderColor: '#FEBD69'}}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-2xl font-black mb-4 text-white">Categories</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-3 rounded-xl font-bold transition hover:scale-105 ${
                  filter === cat ? 'text-black shadow-lg' : 'bg-[#232F3E] text-white border border-[#37475A] hover:bg-[#37475A]'
                }`}
                style={filter === cat ? {backgroundColor: '#FEBD69'} : {}}
              >
                {cat === 'all' ? '🏪 All Services' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-lg font-bold text-gray-300">
            Showing {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 rounded-full animate-spin mb-4" style={{borderColor: '#FEBD69', borderTopColor: 'transparent'}}></div>
            <p className="text-xl font-bold" style={{color: '#37475A'}}>Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-[#232F3E] rounded-2xl shadow-lg border border-[#37475A]">
            <div className="text-8xl mb-6">🔍</div>
            <h4 className="text-3xl font-black mb-4 text-white">No Services Found</h4>
            <p className="text-xl mb-8 text-gray-300">
              {searchQuery ? 'Try a different search term' : 'Be the first to list a service!'}
            </p>
            {!searchQuery && (
              <Link href="/register" className="inline-block px-8 py-4 rounded-xl font-bold text-black hover:scale-105 transition shadow-lg" style={{backgroundColor: '#FEBD69'}}>
                Register as Provider →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group border-2 hover:border-yellow-400 hover:-translate-y-2"
                style={{borderColor: '#E5E7EB'}}
              >
                <div className="h-2 group-hover:h-3 transition-all" style={{background: 'linear-gradient(90deg, #FEBD69, #FFD700)'}}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-2xl font-black group-hover:text-yellow-600 transition" style={{color: '#131A22'}}>
                      {service.title}
                    </h4>
                    <span className="px-3 py-1.5 rounded-lg text-xs font-black text-white whitespace-nowrap" style={{backgroundColor: '#232F3E'}}>
                      {service.category}
                    </span>
                  </div>
                  
                  <p className="mb-6 line-clamp-2 text-gray-600 font-semibold">{service.description}</p>
                  
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b-2" style={{borderColor: '#F3F3F3'}}>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg bg-[#FEBD69] text-[#131A22]">
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
                      <Link href={`/users/${service.provider_id}`} className="font-bold hover:underline" style={{color: '#131A22'}}>
                        {service.provider_name}
                      </Link>
                      <div className="text-sm font-semibold" style={{color: '#37475A'}}>⭐ Verified Provider</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-black" style={{color: '#FEBD69'}}>₱{service.hourly_rate}</div>
                      <div className="text-sm font-bold" style={{color: '#37475A'}}>per hour</div>
                    </div>
                    <Link 
                      href={`/services/${service.id}`} 
                      className="px-6 py-3 rounded-lg font-black text-black hover:scale-105 transition shadow-lg"
                      style={{backgroundColor: '#FEBD69'}}
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-12 mt-20" style={{backgroundColor: '#131A22'}}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold" style={{backgroundColor: '#FEBD69', color: '#131A22'}}>
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