import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = ['Home', 'Movies', 'Series', 'My List'];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="text-2xl font-bold">Movie+</div>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        <div className="hidden md:flex space-x-6">
          {navItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`text-sm font-medium hover:text-blue-400 transition-colors`}
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black p-4 border-b border-gray-700">
          <div className="flex flex-col space-y-2">
            {navItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className="text-sm font-medium text-white hover:text-blue-400 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}

      
      <main className="flex-1">
        
        <div className="p-6 text-center text-gray-400 text-sm">
          Welcome to Movie+ Dashboard
        </div>
      </main>

      
      <footer className="bg-gray-900 text-gray-400 p-4 text-center text-sm border-t border-gray-700">
        <p>&copy; {new Date().getFullYear()} Movie+. All rights reserved.</p>
        <div className="mt-2 flex justify-center space-x-4 text-xs">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Help</a>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
