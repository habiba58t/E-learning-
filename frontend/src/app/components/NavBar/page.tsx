'use client';

import React from 'react';
import { FaBell, FaUser, FaSignOutAlt } from 'react-icons/fa'; // Import icons

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center fixed top-0 left-0 w-full z-50">
      <div className="flex space-x-4 ml-auto">
        {/* Notification Icon */}
        <button
          className="p-2 hover:bg-gray-700 rounded"
          aria-label="Notifications"
        >
          <FaBell size={20} />
        </button>
        {/* Profile Icon */}
        <button
          className="p-2 hover:bg-gray-700 rounded"
          aria-label="Profile"
        >
          <FaUser size={20} />
        </button>
        {/* Logout Icon */}
        <button
          className="p-2 hover:bg-gray-700 rounded"
          aria-label="Logout"
        >
          <FaSignOutAlt size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
