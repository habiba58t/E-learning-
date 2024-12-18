'use client';

import Link from 'next/link';
import React from 'react';
import { FaHome, FaBookOpen, FaClipboardList, FaFileAlt } from 'react-icons/fa';

const AdminSidebar = () => {
  return (
    <div className="w-64 h-screen bg-white text-blue-600 p-4 fixed shadow-lg border-r border-gray-200">
      {/* Dashboard Title */}
      <h2 className="text-2xl text-center mb-10 font-semibold text-blue-700">Admin Dashboard</h2>

      {/* Navigation Links */}
      <ul className="space-y-6">
        <li className="flex flex-col">
          <Link href="/admin/home" className="flex items-center text-lg hover:bg-blue-50 py-2 px-4 rounded transition-colors duration-200">
            <FaHome className="w-5 h-5 mr-3 text-blue-500" />
            Home
          </Link>
          <hr className="border-t border-gray-300 my-2" />
        </li>
        <li className="flex flex-col">
          <Link href="/admin/courses" className="flex items-center text-lg hover:bg-blue-50 py-2 px-4 rounded transition-colors duration-200">
            <FaBookOpen className="w-5 h-5 mr-3 text-blue-500" />
            All Courses
          </Link>
          <hr className="border-t border-gray-300 my-2" />
        </li>
        <li className="flex flex-col">
          <Link href="/admin/logs" className="flex items-center text-lg hover:bg-blue-50 py-2 px-4 rounded transition-colors duration-200">
            <FaFileAlt className="w-5 h-5 mr-3 text-blue-500" />
            Logs
          </Link>
          <hr className="border-t border-gray-300 my-2" />
        </li>
        <li className="flex flex-col">
          <Link href="/admin/forum" className="flex items-center text-lg hover:bg-blue-50 py-2 px-4 rounded transition-colors duration-200">
            <FaClipboardList className="w-5 h-5 mr-3 text-blue-500" />
            Forum
          </Link>
          <hr className="border-t border-gray-300 my-2" />
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
