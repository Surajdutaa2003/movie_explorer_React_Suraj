import React, { Component } from 'react';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface ProfileState {
  user: User | null;
}

class Profile extends Component<{}, ProfileState> {
  state: ProfileState = {
    user: null,
  };

  componentDidMount() {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user: User = JSON.parse(userData);
        this.setState({ user });
      }
    } catch (error) {
      console.error('Error retrieving user from localStorage:', error);
    }
  }

  formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  handleGoBack = () => {
    window.location.href = '/home'; // Or use navigate() if using React Router
  };

  render() {
    const { user } = this.state;

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
          <div className="text-center p-8 bg-white rounded-xl shadow-md border border-blue-100">
            <h2 className="text-2xl font-semibold text-blue-800 mb-3">No Profile Found</h2>
            <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
            <button
              onClick={this.handleGoBack}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go Back Home
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 py-12 px-4">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl border border-blue-100 p-10 space-y-8 transform hover:scale-[1.01] transition-all duration-300 ease-in-out ring-1 ring-blue-200 ring-opacity-40">
          <h2 className="text-3xl font-bold text-blue-800 text-center">👤 User Profile</h2>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Full Name</span>
              <span className="text-blue-900 font-semibold">{`${user.first_name} ${user.last_name}`}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Email</span>
              <span className="text-blue-900 font-semibold">{user.email}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Mobile Number</span>
              <span className="text-blue-900 font-semibold">{user.mobile_number}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Role</span>
              <span className="text-blue-900 font-semibold capitalize">{user.role}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Account Created</span>
              <span className="text-blue-900 font-semibold">{this.formatDate(user.created_at)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Last Updated</span>
              <span className="text-blue-900 font-semibold">{this.formatDate(user.updated_at)}</span>
            </div>
          </div>

          <div className="pt-6 text-center">
            <button
              onClick={this.handleGoBack}
              className="inline-block px-5 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition"
            >
              🔙 Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
