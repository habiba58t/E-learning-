'use client'; 

import Link from 'next/link'; 
import React from 'react'; 
import { FaHome, FaUser, FaBookOpen, FaBars } from 'react-icons/fa'; 

interface AdminSidebarProps { 
  isOpen: boolean; 
  toggleSidebar: () => void; 
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, toggleSidebar }) => { 
  return ( 
    <>
      <button 
        className="text-white p-2 fixed top-4 left-4 z-50" 
        onClick={toggleSidebar} 
      >
        <FaBars className="w-6 h-6" /> 
      </button>

      <div 
        className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 bg-gradient-to-t from-gray-900 via-gray-800 to-black text-white w-72 p-6 shadow-2xl border-r border-gray-700 z-40`} 
      >
        <h2 className="text-4xl text-center mb-10 font-extrabold text-white uppercase tracking-wider drop-shadow-neon"> 
          Admin Dashboard 
        </h2>

        <ul className="space-y-8"> 
          <li className="group flex flex-col"> 
            <Link href="/admin/home" className="flex items-center text-xl bg-gray-800 bg-opacity-70 hover:bg-blue-700 py-3 px-5 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg group-hover:shadow-blue-800"> 
              <FaHome className="w-7 h-7 mr-4 text-blue-300 group-hover:text-white transition-colors duration-300 ease-in-out" /> 
              <span className="group-hover:text-white transition-colors duration-300 ease-in-out">Home</span> 
            </Link> 
          </li>
          <li className="group flex flex-col"> 
            <Link href="/admin/profile" className="flex items-center text-xl bg-gray-800 bg-opacity-70 hover:bg-blue-700 py-3 px-5 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg group-hover:shadow-blue-800"> 
              <FaUser className="w-7 h-7 mr-4 text-blue-300 group-hover:text-white transition-colors duration-300 ease-in-out" /> 
              <span className="group-hover:text-white transition-colors duration-300 ease-in-out">Profile</span> 
            </Link> 
          </li>
          <li className="group flex flex-col"> 
            <Link href="/admin/courses" className="flex items-center text-xl bg-gray-800 bg-opacity-70 hover:bg-blue-700 py-3 px-5 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg group-hover:shadow-blue-800"> 
              <FaBookOpen className="w-7 h-7 mr-4 text-blue-300 group-hover:text-white transition-colors duration-300 ease-in-out" /> 
              <span className="group-hover:text-white transition-colors duration-300 ease-in-out">Courses</span> 
            </Link> 
          </li>
        </ul>
      </div>
    </>
  ); 
};

export default AdminSidebar;
