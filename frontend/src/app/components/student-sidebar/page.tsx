'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';

const Sidebar = () => {
  const [currentUsername, setCurrentUsername] = useState('');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Fetch currentUsername from the server-side cookie
  const fetchCookieData = async () => {
    try {
      const response = await fetch('http://localhost:3002/auth/get-cookie-data', {
        credentials: 'include', // Include credentials (cookies) in the request
      });
      const { userData } = await response.json();

      if (!userData?.payload?.username) {
        console.error('No cookie data found');
        setError('No cookie data found');
        return;
      }

      setCurrentUsername(userData.payload.username); // Set the username from cookie
    } catch (error) {
      console.error('Error fetching cookie data:', error);
      setError('Error fetching cookie data');
    }
  };

  useEffect(() => {
    fetchCookieData(); // Fetch data when component mounts
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      {/* Button to toggle sidebar */}
      <motion.button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-20 p-2 bg-blue-800 text-white rounded-full"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Menu size={24} />
      </motion.button>

      {/* Sidebar */}
      <motion.div
        className="fixed left-0 top-0 h-screen bg-blue-800 text-white p-6 z-10"
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl text-center text-white mb-10">Student Dashboard</h2>
        <ul className="space-y-6">
          <li>
            <Link href="/student/home" className="block text-lg hover:bg-blue-700 py-2 px-4 rounded">
              Home
            </Link>
          </li>
          <li>
            <Link href="/student/studentCourses" className="block text-lg hover:bg-blue-700 py-2 px-4 rounded">
              My Courses
            </Link>
          </li>
          <li>
            <Link href="/student/quizzes" className="block text-lg hover:bg-blue-700 py-2 px-4 rounded">
              Quizzes
            </Link>
          </li>
          <li>
            <Link href="/student/progress" className="block text-lg hover:bg-blue-700 py-2 px-4 rounded">
              Progress
            </Link>
          </li>
          <li>
            <Link href="/discussion-forum" className="block text-lg hover:bg-blue-700 py-2 px-4 rounded">
              Forum
            </Link>
          </li>
          <li>
            {/* Check if currentUsername exists before rendering dynamic link */}
            {currentUsername ? (
              <Link
                href={`/student/private-chats/${currentUsername}`} 
                className="block text-lg text-blue-600 hover:bg-blue-700 py-2 px-4 rounded"
              >
                Chats
              </Link>
            ) : (
              <span className="block text-lg text-gray-400 py-2 px-4 rounded">Loading Chats...</span>
            )}
          </li>
        </ul>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </motion.div>
    </>
  );
};

export default Sidebar;
