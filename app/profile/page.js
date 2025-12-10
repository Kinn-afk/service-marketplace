'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData({
      name: parsedUser.name,
      email: parsedUser.email,
      phone: parsedUser.phone || ''
    });
    setLoading(false);
  }, [router]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Upload failed');
      }

      // Update user profile with new image
      const updateRes = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          profile_image: uploadData.url
        })
      });

      if (updateRes.ok) {
        const updatedUser = { ...user, profile_image: uploadData.url };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('userProfileUpdated'));
        setSuccess('Profile picture updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: formData.name,
          phone: formData.phone
        })
      });

      const data = await res.json();

      if (res.ok) {
        const updatedUser = { ...user, name: formData.name, phone: formData.phone };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('userProfileUpdated'));
        setSuccess('Profile updated successfully!');
        setEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Update failed');
      }
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1419]">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 rounded-full animate-spin mb-4 border-[#FEBD69] border-t-transparent"></div>
          <p className="text-white text-xl font-semibold">Loading your profile...</p>
        </div>
      </div>
    );
  }

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

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
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

                {/* Upload Button */}
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition bg-[#FEBD69]"
                >
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-[#131A22] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="text-xl">📷</span>
                  )}
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
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
            {!editing ? (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-[#232F3E] rounded-xl border border-[#37475A] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-black text-white">Profile Information</h3>
                    <button
                      onClick={() => setEditing(true)}
                      className="px-6 py-2 rounded-lg font-bold text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] transition"
                    >
                      ✏️ Edit Profile
                    </button>
                  </div>

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

                    <div className="flex items-center gap-4 p-4 bg-[#37475A] rounded-lg border border-[#455768]">
                      <span className="text-2xl">📱</span>
                      <div>
                        <p className="text-sm font-bold text-[#FEBD69]">Phone</p>
                        <p className="text-lg font-bold text-white">
                          {user.phone || 'Not provided'}
                        </p>
                      </div>
                    </div>

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

                {/* Quick Links */}
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href="/dashboard"
                    className="p-6 rounded-xl text-center font-bold text-white hover:scale-105 transition shadow-lg"
                    style={{background: 'linear-gradient(135deg, #232F3E, #37475A)'}}
                  >
                    <div className="text-4xl mb-2">📊</div>
                    <div>Go to Dashboard</div>
                  </Link>
                  <Link 
                    href="/messages"
                    className="p-6 rounded-xl text-center font-bold text-white hover:scale-105 transition shadow-lg"
                    style={{background: 'linear-gradient(135deg, #37475A, #232F3E)'}}
                  >
                    <div className="text-4xl mb-2">💬</div>
                    <div>My Messages</div>
                  </Link>
                </div>
              </div>
            ) : (
              // Edit Form
              <form onSubmit={handleUpdateProfile} className="max-w-2xl mx-auto space-y-6">
                <div className="bg-[#232F3E] rounded-xl border border-[#37475A] p-6">
                  <h3 className="text-2xl font-black mb-6 text-white">Edit Profile</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-white">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border-2 bg-[#37475A] border-[#455768] text-white focus:outline-none focus:border-[#FEBD69] transition font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-white">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        className="w-full px-4 py-3 rounded-lg border-2 bg-[#455768] border-[#455768] text-gray-400 font-semibold"
                        disabled
                      />
                      <p className="text-xs mt-1 text-[#FEBD69]">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-white">Phone (Optional)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 rounded-lg border-2 bg-[#37475A] border-[#455768] text-white focus:outline-none focus:border-[#FEBD69] transition font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-lg font-bold text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] transition"
                    >
                      💾 Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: user.name,
                          email: user.email,
                          phone: user.phone || ''
                        });
                      }}
                      className="flex-1 py-3 rounded-lg font-bold bg-[#455768] text-white hover:bg-[#37475A] transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}