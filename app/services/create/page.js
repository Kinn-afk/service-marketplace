'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateService() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    hourly_rate: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'provider') {
      router.push('/dashboard');
      return;
    }
    setUser(parsedUser);
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          provider_id: user.id
        })
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Failed to create service');
      }
    } catch (err) {
      setError('Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0F1419] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 rounded-full animate-spin mb-4 border-[#FEBD69] border-t-transparent"></div>
          <p className="text-white text-xl font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1419] py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-[#131A22] border border-[#232F3E] p-8 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold bg-[#FEBD69] text-[#131A22]">
              SM
            </div>
            <h2 className="text-3xl font-bold text-white">Create New Service</h2>
          </div>
          
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-900 border border-red-700">
              <p className="text-red-200">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Service Title</label>
              <input
                type="text"
                className="w-full bg-[#232F3E] border border-[#37475A] text-white p-3 rounded-lg focus:border-[#FEBD69] focus:outline-none transition"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter service title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Category</label>
              <select
                className="w-full bg-[#232F3E] border border-[#37475A] text-white p-3 rounded-lg focus:border-[#FEBD69] focus:outline-none transition"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="" className="bg-[#232F3E]">Select category</option>
                <option value="Plumbing" className="bg-[#232F3E]">Plumbing</option>
                <option value="Electrical" className="bg-[#232F3E]">Electrical</option>
                <option value="Cleaning" className="bg-[#232F3E]">Cleaning</option>
                <option value="Tutoring" className="bg-[#232F3E]">Tutoring</option>
                <option value="Carpentry" className="bg-[#232F3E]">Carpentry</option>
                <option value="Other" className="bg-[#232F3E]">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Description</label>
              <textarea
                className="w-full bg-[#232F3E] border border-[#37475A] text-white p-3 rounded-lg focus:border-[#FEBD69] focus:outline-none transition"
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe your service in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Hourly Rate (₱)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full bg-[#232F3E] border border-[#37475A] text-white p-3 rounded-lg focus:border-[#FEBD69] focus:outline-none transition"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})}
                placeholder="0.00"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-[#FEBD69] text-[#131A22] p-4 rounded-lg font-bold hover:bg-[#e5a958] disabled:bg-[#37475A] disabled:text-gray-400 transition shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#131A22] border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Service'
                )}
              </button>
              <button 
                type="button"
                onClick={() => router.push('/dashboard')}
                className="flex-1 bg-[#232F3E] text-white p-4 rounded-lg font-bold border border-[#37475A] hover:bg-[#37475A] transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}