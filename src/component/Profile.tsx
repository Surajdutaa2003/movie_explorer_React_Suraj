import React, { useState, useEffect, useRef } from 'react';
import { updateProfilePicture, getProfilePicture, cancelSubscription } from '../services/Api';
import { getSubscriptionStatus } from '../services/subApi';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
  current_period_end?: string;
}

const backgroundUrl = 'https://i.pinimg.com/736x/00/21/a2/0021a2a1d7b1446a163b000abcc36a9e.jpg';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [subscriptionMessage, setSubscriptionMessage] = useState<string | null>(null);
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string | null>(null);
  const [isAvatarLoading, setIsAvatarLoading] = useState<boolean>(false); // New state for avatar loading
  const boxRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      // Start rotation animation immediately
      setIsRotating(true);
      setIsAvatarLoading(true); // Start avatar loading
      setTimeout(() => {
        setIsRotating(false);
      }, 1000);

      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser: User = JSON.parse(userData);
          setUser(parsedUser);
          if (parsedUser.current_period_end && parsedUser.role !== 'supervisor') {
            setCurrentPeriodEnd(parsedUser.current_period_end);
          }
        }

        // Fetch profile picture URL from API
        try {
          const response = await getProfilePicture();
          if (userData) {
            const parsedUser: User = JSON.parse(userData);
            const updatedUser = { ...parsedUser, avatar_url: response.profile_picture_url };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        } catch (error: any) {
          console.error('Error fetching profile picture:', error.message);
          toast.error(error.message || 'Failed to fetch profile picture');
        } finally {
          setIsAvatarLoading(false); // Stop avatar loading
        }

        // Fetch subscription status from API
        try {
          const subResponse = await getSubscriptionStatus();
          if (subResponse.current_period_end && userData) {
            const parsedUser: User = JSON.parse(userData);
            if (parsedUser.role !== 'supervisor') {
              setCurrentPeriodEnd(subResponse.current_period_end);
              const updatedUser = { ...parsedUser, current_period_end: subResponse.current_period_end };
              setUser(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }
          }
        } catch (error: any) {
          console.error('Error fetching subscription status:', error.message);
          // Error is already handled by toast in getSubscriptionStatus
        }
      } catch (error) {
        console.error('Error retrieving user from localStorage:', error);
        toast.error('Error retrieving user data');
      }
    };

    fetchUserData();
  }, []);

  const handleGoBack = () => {
    window.location.href = '/';
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadMessage(null);
      setIsAvatarLoading(true); // Start avatar loading
      const response = await updateProfilePicture(file);
      setUploadMessage(response.message);

      if (user) {
        const updatedUser = { ...user, avatar_url: response.profile_picture_url };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error: any) {
      setUploadMessage(error.message || 'Failed to update profile picture');
      toast.error(error.message || 'Failed to update profile picture');
    } finally {
      setIsAvatarLoading(false); // Stop avatar loading
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setSubscriptionMessage(null);
      const response = await cancelSubscription();
      setSubscriptionMessage(response.message);
      if (user && user.role !== 'supervisor') {
        setCurrentPeriodEnd(response.current_period_end);
        const updatedUser = { ...user, current_period_end: response.current_period_end };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      toast.success(response.message);
    } catch (error: any) {
      setSubscriptionMessage(error.message || 'Failed to cancel subscription');
      toast.error(error.message || 'Failed to cancel subscription');
    }
  };

  const defaultAvatarUrl = 'https://i.pinimg.com/736x/d0/cb/d1/d0cbd1380c72ddf3750c896433b2dea1.jpg';

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
        >
          <h2 className="text-2xl font-semibold text-white mb-3">No Profile Found</h2>
          <p className="text-gray-200 mb-4">Please log in to view your profile.</p>
          <button
            onClick={handleGoBack}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition transform hover:scale-105 hover:shadow-lg text-sm"
          >
            Go Back Home
          </button>
          <style>{`
            @keyframes coinFlip {
              0% {
                transform: perspective(1000px) rotateY(0deg);
                opacity: 0.8;
              }
              100% {
                transform: perspective(1000px) rotateY(360deg);
                opacity: 1;
              }
            }
            .animate-coinFlip {
              animation: coinFlip 1s cubic-bezier(0.4, 0, 0.2, 1);
              animation-fill-mode: forwards;
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
      >
        <h2 className="text-xl font-semibold text-white mb-6">Profile</h2>
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden transition-transform duration-300 hover:scale-110 hover:shadow-lg cursor-pointer relative"
            onClick={handleAvatarClick}
          >
            {isAvatarLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="loader"></div> {/* Loader spinner */}
              </div>
            ) : (
              <>
                <img
                  src={user.avatar_url || defaultAvatarUrl}
                  alt={`${user.first_name}'s avatar`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-medium">Change</span>
                </div>
              </>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="mt-2 flex flex-col items-center">
            <span className="text-white font-medium">
              {user.first_name} {user.last_name}
            </span>
            <span className="text-sm text-gray-300 capitalize">{user.role}</span>
          </div>
        </div>
        {uploadMessage && (
          <div
            className={`mt-4 p-2 rounded text-center ${
              uploadMessage.includes('Failed') ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {uploadMessage}
          </div>
        )}
        {subscriptionMessage && user.role !== 'supervisor' && (
          <div
            className={`mt-4 p-2 rounded text-center ${
              subscriptionMessage.includes('Failed') ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {subscriptionMessage}
          </div>
        )}
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
          {currentPeriodEnd && user.role !== 'supervisor' && (
            <div className="flex justify-between items-center">
              <label className="text-gray-300 text-sm w-1/3">SUBSCRIPTION ENDS</label>
              <input
                type="text"
                value={new Date(currentPeriodEnd).toLocaleString()}
                readOnly
                className="w-2/3 p-2 border rounded text-white bg-transparent border-gray-400 shadow-sm"
              />
            </div>
          )}
        </div>
        <div className="flex space-x-4 mt-6">
          {user.role !== 'supervisor' && (
            <button
              onClick={handleCancelSubscription}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <CloseIcon sx={{ width: 20, height: 20 }} />
              <span>Cancel Subscription</span>
            </button>
          )}
          <button
            onClick={handleGoBack}
            className="flex-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition transform hover:scale-105 hover:shadow-lg text-sm flex items-center justify-center space-x-2"
          >
            <ArrowBackIcon sx={{ width: 16, height: 16 }} />
            <span>Go Back</span>
          </button>
        </div>
        <style>{`
          @keyframes coinFlip {
            0% {
              transform: perspective(1000px) rotateY(0deg);
              opacity: 0.8;
            }
            100% {
              transform: perspective(1000px) rotateY(360deg);
              opacity: 1;
            }
          }
          .animate-coinFlip {
            animation: coinFlip 1s cubic-bezier(0.4, 0, 0.2, 1);
            animation-fill-mode: forwards;
          }
          .loader {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid #ffffff;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Profile;