'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  const [currentUsername, setCurrentUsername] = useState('');
  const [error, setError] = useState('');

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

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-6">
      <h2 className="text-2xl text-center text-gray-200 mb-10">Student Dashboard</h2>
      <ul className="space-y-6">
        <li>
          <Link href="/student/home" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
            Home
          </Link>
        </li>
        <li>
          <Link href="/student/courses" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
            My Courses
          </Link>
        </li>
        <li>
          <Link href="/student/quizzes" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
            Quizzes
          </Link>
        </li>
        <li>
          <Link href="/progress" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
            Progress
          </Link>
        </li>
        <li>
          <Link href="/forum" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
            Forum
          </Link>
        </li>
        <li>
          {/* Check if currentUsername exists before rendering dynamic link */}
          {currentUsername ? (
            <Link
              href={`/student/private-chats/${currentUsername}`} 
              className="block text-lg hover:bg-gray-700 py-2 px-4 rounded"
            >
              Chats
            </Link>
          ) : (
            <span className="block text-lg text-gray-400 py-2 px-4 rounded">Loading Chats...</span>
          )}
        </li>
      </ul>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Sidebar;
