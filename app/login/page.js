'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{background: 'linear-gradient(135deg, #232F3E 0%, #37475A 100%)'}}>
      <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 30% 50%, #FEBD69 0%, transparent 50%)'}}>
      </div>
      
      <div className="w-full max-w-md mx-4 relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 hover:opacity-90 transition">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold" style={{backgroundColor: '#FEBD69', color: '#131A22'}}>
              SM
            </div>
          </Link>
          <h2 className="text-4xl font-bold text-white mb-2">Welcome Back!</h2>
          <p className="text-gray-300">Sign in to access your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="mb-6 p-4 rounded-lg border-2 border-red-200" style={{backgroundColor: '#FEE2E2'}}>
              <p className="text-red-700 font-semibold">⚠️ {error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-lg font-bold text-lg text-black transition hover:opacity-90 disabled:opacity-50 shadow-lg"
              style={{backgroundColor: '#FEBD69'}}
            >
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-bold hover:underline" style={{color: '#FEBD69'}}>
                Create one now
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