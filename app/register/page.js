'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', role: 'customer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #232F3E 0%, #37475A 100%)'}}>
      <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 70% 30%, #FEBD69 0%, transparent 50%)'}}>
      </div>
      
      <div className="w-full max-w-md mx-4 relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 hover:opacity-90 transition">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold" style={{backgroundColor: '#FEBD69', color: '#131A22'}}>
              SM
            </div>
          </Link>
          <h2 className="text-4xl font-bold text-white mb-2">Join Us Today</h2>
          <p className="text-gray-300">Create your account in seconds</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="mb-6 p-4 rounded-lg border-2 border-red-200" style={{backgroundColor: '#FEE2E2'}}>
              <p className="text-red-700 font-semibold">⚠️ {error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2" style={{color: '#131A22'}}>Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-yellow-500 transition"
                style={{borderColor: '#E5E7EB'}}
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{color: '#131A22'}}>Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-yellow-500 transition"
                style={{borderColor: '#E5E7EB'}}
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{color: '#131A22'}}>Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-yellow-500 transition"
                style={{borderColor: '#E5E7EB'}}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{color: '#131A22'}}>I want to...</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'customer'})}
                  className={`py-3 px-4 rounded-lg font-semibold border-2 transition ${formData.role === 'customer' ? 'text-black' : 'bg-gray-50 text-gray-600'}`}
                  style={formData.role === 'customer' ? {backgroundColor: '#FEBD69', borderColor: '#FEBD69'} : {borderColor: '#E5E7EB'}}
                >
                  Find Services
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'provider'})}
                  className={`py-3 px-4 rounded-lg font-semibold border-2 transition ${formData.role === 'provider' ? 'text-black' : 'bg-gray-50 text-gray-600'}`}
                  style={formData.role === 'provider' ? {backgroundColor: '#FEBD69', borderColor: '#FEBD69'} : {borderColor: '#E5E7EB'}}
                >
                  Offer Services
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-lg font-bold text-lg text-black transition hover:opacity-90 disabled:opacity-50 shadow-lg"
              style={{backgroundColor: '#FEBD69'}}
            >
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-bold hover:underline" style={{color: '#FEBD69'}}>
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-300 hover:text-white transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}