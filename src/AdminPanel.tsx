import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock data for movies, users, and reports
const mockMovies = [
  { id: 1, title: "Movie A", poster: "https://via.placeholder.com/150x200?text=Movie+A" },
  { id: 2, title: "Movie B", poster: "https://via.placeholder.com/150x200?text=Movie+B" },
  { id: 3, title: "Movie C", poster: "https://via.placeholder.com/150x200?text=Movie+C" },
  { id: 4, title: "Movie D", poster: "https://via.placeholder.com/150x200?text=Movie+D" },
];

const mockUsers = [
  { id: 1, name: "John Doe", type: "Frequent Viewer" },
  { id: 2, name: "Jane Smith", type: "Critic" },
  { id: 3, name: "Alex Johnson", type: "Casual Viewer" },
];

const mockReports = [
  { id: 1, title: "Content Review", status: "Pending" },
  { id: 2, title: "User Complaint", status: "In Progress" },
  { id: 3, title: "Bug Report", status: "Resolved" },
];

const AdminPanel: React.FC = () => {
  const [activeNav, setActiveNav] = useState("Movies");

  const navItems = [
    { icon: "📽️", label: "Movies", path: "/admin/movies" },
    { icon: "👤", label: "Users", path: "/admin/users" },
    { icon: "📊", label: "Analytics", path: "/admin/analytics" },
    { icon: "🚨", label: "Moderation", path: "/admin/moderation" },
    { icon: "⚙️", label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {/* Sidebar */}
      <aside className="w-16 lg:w-64 bg-gray-800 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-2xl">🎬</span>
            <span className="hidden lg:block text-xl font-bold">Movie Explorer</span>
          </div>
          <nav>
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setActiveNav(item.label)}
                className={`flex items-center space-x-2 p-2 rounded-lg w-full text-left mb-2 ${
                  activeNav === item.label ? "bg-teal-500 text-white" : "hover:bg-gray-700"
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          <img
            src="https://via.placeholder.com/40?text=User"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <div className="hidden lg:block">
            <p className="text-sm">Admin User</p>
            <p className="text-xs text-gray-400">admin@moviex.com</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-gray-800">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-700">
              <span className="text-xl">🔍</span>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-700">
              <span className="text-xl">🔔</span>
            </button>
            <div className="flex items-center space-x-2">
              <img
                src="https://via.placeholder.com/32?text=User"
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden md:block">Admin User</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Total Movies */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">Total Movies</h2>
              <p className="text-4xl font-bold mt-2">1,200K</p>
              <p className="text-sm text-teal-400 mt-1">+2.1% from last month</p>
              <button className="mt-4 text-sm text-gray-400 hover:text-teal-400">
                View chart
              </button>
            </div>

            {/* User Ratings */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">User Ratings</h2>
              <div className="h-40 flex items-center justify-center text-gray-400">
                [Line Chart Placeholder]
              </div>
            </div>

            {/* Platform Distribution */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">Platform Distribution</h2>
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Netflix</span>
                  <div className="flex-1 h-2 bg-gray-600 rounded">
                    <div className="w-3/4 h-full bg-teal-500 rounded"></div>
                  </div>
                  <span className="text-sm">75%</span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-sm">Amazon</span>
                  <div className="flex-1 h-2 bg-gray-600 rounded">
                    <div className="w-1/2 h-full bg-blue-500 rounded"></div>
                  </div>
                  <span className="text-sm">50%</span>
                </div>
              </div>
            </div>

            {/* Genre Distribution */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">Genre Distribution</h2>
              <div className="h-40 flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 opacity-50"></div>
                  <div className="absolute inset-4 rounded-full bg-gray-800 flex items-center justify-center">
                    <span className="text-3xl font-bold">720</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Movie Types */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">Movie Types</h2>
              <div className="flex space-x-4 mt-4">
                <div>
                  <p className="text-3xl font-bold">70.23</p>
                  <p className="text-sm text-gray-400">Feature Films</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">32%</p>
                  <p className="text-sm text-gray-400">Documentaries</p>
                </div>
              </div>
            </div>

            {/* Completed Reports */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">Completed Reports</h2>
              <p className="text-sm text-gray-400 mt-1">7/10 tasks completed</p>
              <div className="mt-4 space-y-2">
                {mockReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-2 bg-gray-700 rounded"
                  >
                    <span>{report.title}</span>
                    <span
                      className={`text-sm ${
                        report.status === "Resolved"
                          ? "text-green-400"
                          : report.status === "Pending"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Movies */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg col-span-1 lg:col-span-2">
              <h2 className="text-lg font-semibold">Top Movies</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {mockMovies.map((movie) => (
                  <img
                    key={movie.id}
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* Top Users */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">Top Users</h2>
              <div className="mt-4 space-y-4">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <img
                      src={`https://via.placeholder.com/40?text=${user.name[0]}`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;