'use client';

import Link from 'next/link';
import React from 'react';
import { FaBell, FaUser, FaSignOutAlt, FaSearch } from 'react-icons/fa';

const NavBar: React.FC = () => {
  return (
    <nav className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg border-b border-gray-200 fixed w-full z-10 top-0 left-0">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex items-center w-1/2">
          <input
            type="text"
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search..."
          />
          <button className="ml-2 text-blue-600">
            <FaSearch className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex items-center space-x-6">
          <button className="text-blue-600 hover:text-blue-800">
            <FaBell className="w-6 h-6" />
          </button>
          <Link href="/profile" className="text-blue-600 hover:text-blue-800">
            <FaUser className="w-6 h-6" />
          </Link>
          <button className="text-blue-600 hover:text-blue-800">
            <FaSignOutAlt className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;