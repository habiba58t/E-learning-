'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';

const InstructorSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle sidebar visibility
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
        className="fixed top-4 left-4 z-20 p-2 bg-teal-600 text-white rounded-full"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Menu size={24} />
      </motion.button>

      {/* Sidebar */}
      <motion.div
        className="fixed left-0 top-0 h-screen bg-teal-600 text-white p-6 z-10"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl text-center text-white mb-10">Instructor Dashboard</h2>
        <ul className="space-y-6">
          <li>
            <Link href="/instructor/home" className="block text-lg hover:bg-teal-700 py-2 px-4 rounded">
              Home
            </Link>
          </li>
          <li>
            <Link href="/instructor/courses" className="block text-lg hover:bg-teal-700 py-2 px-4 rounded">
              My Courses
            </Link>
          </li>
          <li>
            <Link href="/instructor/quizzes" className="block text-lg hover:bg-teal-700 py-2 px-4 rounded">
              My Quizzes
            </Link>
          </li>
          <li>
            <Link href="/instructor/questions" className="block text-lg hover:bg-teal-700 py-2 px-4 rounded">
              Question Bank
            </Link>
          </li>
          <li>
            <Link href="/instructor/analytics" className="block text-lg hover:bg-teal-700 py-2 px-4 rounded">
              Student Feedback
            </Link>
          </li>
          <li>
            <Link href="/discussion-forum" className="block text-lg hover:bg-teal-700 py-2 px-4 rounded">
              Forums
            </Link>
          </li>
        </ul>
      </motion.div>
    </>
  );
};

export default InstructorSidebar;