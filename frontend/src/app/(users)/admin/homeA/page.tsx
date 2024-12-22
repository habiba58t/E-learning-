'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
const backend_url ='http://localhost:3002';

export default function Dashboard() {
  // Example state variables
  const [totalUsers, setTotalUsers] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch user data function
  async function fetchUserData() {
    setLoading(true);
    setError(' ');

    try {
      // Fetch the user data
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: 'include',
      });

      const { userData } = await cookieResponse.json();

      // Check if user data is valid
      if (!userData || !userData.payload?.username) {
        throw new Error('No valid user data found in cookies.');
      }

      const username = userData.payload.username;
      console.log('Fetched username:', username);

      // Now fetch the total users count (assuming the API endpoint exists)
      const response = await axios.get(`${backend_url}/users/count`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Add your JWT token here if required
        },
      });

      // Assuming the response contains a "count" property for total users
      setTotalUsers(response.data.count);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Fetch data when the component mounts
  useEffect(() => {
    fetchUserData();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className="bg-white dark:bg-[#0F172A] min-h-screen">
      {/* Navbar */}
      <div className="fixed w-full z-30 flex bg-white dark:bg-[#0F172A] p-2 items-center justify-center h-16 px-10">
        <div className="grow h-full flex items-center justify-center"></div>
        <div className="flex-none h-full text-center flex items-center justify-center">
          <div className="flex space-x-3 items-center px-3">
            <div className="flex-none flex justify-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="text-gray-800 dark:text-white font-semibold">User</div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="pt-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Users Card */}
          <div className="bg-white dark:bg-[#1E293B] rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white">Total Users</h3>
            {loading ? (
              <p className="text-xl font-bold text-gray-900 dark:text-white">Loading...</p>
            ) : error ? (
              <p className="text-xl font-bold text-red-500">{error}</p>
            ) : (
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
