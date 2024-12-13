'use client';

import React from 'react';
import { FaSearch, FaUserCircle, FaBell } from 'react-icons/fa'; // Example icons, use the ones you prefer

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 p-4" style={{ backgroundColor: '#003366' }}>
      <div className="flex justify-between items-center">
        {/* Website name aligned to the left */}
        <div>
          <h1 className="text-white text-xl font-semibold">Academiq</h1>
        </div>

        {/* Right-aligned icons and search bar */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 border rounded-md border-gray-300"
          />
          <FaSearch className="text-white text-xl cursor-pointer" />
          <FaUserCircle className="text-white text-xl cursor-pointer" />
          <FaBell className="text-white text-xl cursor-pointer" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
