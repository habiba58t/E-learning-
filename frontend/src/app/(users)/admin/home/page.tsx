'use client';

import AdminSidebar from '@/app/components/Admin-sidebar/page';
import React, { useState } from 'react';
 
import { FaUser, FaBookOpen, FaFileAlt } from 'react-icons/fa';

interface AdminHomePageProps {
  usersCount: number;
  coursesCount: number;
  logsCount: number;
}

const AdminHomePage: React.FC<AdminHomePageProps> = ({ usersCount, coursesCount, logsCount }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      <AdminSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-10 transition-all duration-300 ${isOpen ? 'ml-72' : ''}`}>
        {/* Main Content */}
        <main>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Total Users */}
            <div className="bg-gray-800 bg-opacity-80 p-8 rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300 text-center">
              <FaUser className="text-5xl text-blue-400 mb-4" />
              <h2 className="text-3xl font-semibold">Total Users</h2>
              <p className="mt-2 text-2xl font-bold">{usersCount}</p>
            </div>

            {/* Total Courses */}
            <div className="bg-gray-800 bg-opacity-80 p-8 rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300 text-center">
              <FaBookOpen className="text-5xl text-green-400 mb-4" />
              <h2 className="text-3xl font-semibold">Total Courses</h2>
              <p className="mt-2 text-2xl font-bold">{coursesCount}</p>
            </div>

            {/* Total Logs */}
            <div className="bg-gray-800 bg-opacity-80 p-8 rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300 text-center">
              <FaFileAlt className="text-5xl text-yellow-400 mb-4" />
              <h2 className="text-3xl font-semibold">Total Logs</h2>
              <p className="mt-2 text-2xl font-bold">{logsCount}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminHomePage;
