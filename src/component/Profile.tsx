
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // For API calls

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  role: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
}

const backgroundUrl = 'https://i.pinimg.com/736x/00/21/a2/0021a2a1d7b1446a163b000abcc36a9e.jpg';
const defaultAvatarUrl = 'https://i.pinimg.com/736x/d0/cb/d1/d0cbd1380c72ddf3750c896433b2dea1.jpg';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null); // State for image preview
  const boxRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser: User = JSON.parse(userData);
        setUser(parsedUser);
        setAvatarPreview(parsedUser.avatar_url || defaultAvatarUrl); // Set initial avatar
      }
    } catch (error) {
      console.error('Error retrieving user from localStorage:', error);
    }

    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 2000);
  }, []);

  const handleGoBack = () => {
    window.location.href = '/';
  };

  const handleBoxClick = () => {
    if (!isRotating) {
      setIsRotating(true);
      setTimeout(() => setIsRotating(false), 1000);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Please upload a JPEG or PNG image.');
        return;
      }
      // Generate preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      // Optional: Upload to backend
      uploadImage(file);
    }
  };

  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('user[avatar]', file);
      const token = localStorage.getItem('token'); // JWT token

      const response = await axios.patch<{ avatar_url: string }>(
        'http://localhost:3000/api/v1/users/update_profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Update user with new avatar_url
      const updatedUser = { ...user!, avatar_url: response.data.avatar_url };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image.');
      // Optionally revert to previous avatar
      setAvatarPreview(user?.avatar_url || defaultAvatarUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundUrl})`,
        }}
      >
        <div
          ref={boxRef}
          className={`text-center p-8 rounded-lg shadow-2xl ${isRotating ? 'animate-coinFlip' : ''}`}
          style={{
            backgroundColor: 'rgba(128, 128, 128, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          }}
          onClick={handleBoxClick}
        >
          <h2 className="text-2xl font-semibold text-white mb-3">No Profile Found</h2>
          <p className="text-gray-200 mb-4">Please log in to view your profile.</p>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition transform hover:scale-105 hover:shadow-lg"
          >
            Go Back Home
          </button>
          <style>{`
            @keyframes coinFlip {
              0% { transform: perspective(1000px) rotateY(0deg); }
              100% { transform: perspective(1000px) rotateY(360deg); }
            }
            .animate-coinFlip {
              animation: coinFlip 1s ease-in-out;
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundUrl})`,
      }}
    >
      <div
        ref={boxRef}
        className={`w-full max-w-md rounded-lg shadow-2xl p-6 relative ${isRotating ? 'animate-coinFlip' : ''}`}
        style={{
          backgroundColor: 'rgba(128, 128, 128, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        }}
        onClick={handleBoxClick}
      >
        <h2 className="text-xl font-semibold text-white mb-6">Profile</h2>
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden transition-transform duration-300 hover:scale-110 hover:shadow-lg relative">
            <img
              src={avatarPreview || defaultAvatarUrl}
              alt={`${user.first_name}'s avatar`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600 transition"
              title="Change Profile Picture"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <input
              type="file"
              accept="image/jpeg,image/png"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div className="mt-2 flex flex-col items-center">
            <span className="text-white font-medium">
              {user.first_name} {user.last_name}
            </span>
            <span className="text-sm text-gray-300 capitalize">{user.role}</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-gray-300 text-sm w-1/3">NAME</label>
            <input
              type="text"
              value={`${user.first_name} ${user.last_name}`}
              readOnly
              className="w-2/3 p-2 border rounded text-white bg-transparent border-gray-400 shadow-sm"
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-gray-300 text-sm w-1/3">EMAIL</label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-2/3 p-2 border rounded text-white bg-transparent border-gray-400 shadow-sm"
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-gray-300 text-sm w-1/3">PHONE</label>
            <input
              type="text"
              value={user.mobile_number}
              readOnly
              className="w-2/3 p-2 border rounded text-white bg-transparent border-gray-400 shadow-sm"
            />
          </div>
        </div>
        <button
          onClick={handleGoBack}
          className="w-full mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Go Back</span>
        </button>
        <style>{`
          @keyframes coinFlip {
            0% { transform: perspective(1000px) rotateY(0deg); }
            100% { transform: perspective(1000px) rotateY(360deg); }
          }
          .animate-coinFlip {
            animation: coinFlip 1s ease-in-out;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Profile;
          // 