'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/app/utils/axiosInstance';
import { Moon, Sun, ChevronDown, Home, LayoutDashboard, Users } from 'lucide-react';

const backend_url = 'http://localhost:3002';

type LogEntry = {
  id: number;
  username: {
    _id: string;
    username: string;
  }[];
  role: string;
  action: string;
  success: boolean;
  timestamp: string;
};

type UserData = {
  payload: {
    username: string;
    role: 'student' | 'instructor' | 'admin';
  };
};

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupMessage, setBackupMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'success' | 'failed'>('all');

  async function fetchDashboardData() {
    try {
      setLoading(true);
      setError(null);

      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: 'include',
      });

      if (!cookieResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const { userData } = await cookieResponse.json();

      if (!userData || !userData.payload?.username) {
        throw new Error('No valid user data found in cookies.');
      }

      setUserData(userData);

      const userResponse = await axiosInstance.get(`${backend_url}/users/count/users`);
      setTotalUsers(userResponse.data.count);

      const courseResponse = await axiosInstance.get(`${backend_url}/courses/count/getcourses`);
      setTotalCourses(courseResponse.data.count);

      const logResponse = await axiosInstance.get<LogEntry[]>(`${backend_url}/log`);
      setLogs(logResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }

  const triggerBackup = async () => {
    setBackupLoading(true);
    setBackupMessage('');
    try {
      const res = await axiosInstance.post(`${backend_url}/backup/trigger`);
      if (res.status === 200) {
        setBackupMessage(`Backup created successfully! Backup stored at: ${res.data.path}`);
      } else {
        setBackupMessage(`Backup failed: ${res.data.error}`);
      }
    } catch (error) {
      console.error('Error triggering backup:', error);
      setBackupMessage('An error occurred while triggering the backup.');
    } finally {
      setBackupLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getUsername = (usernameArray: LogEntry['username']): string => {
    if (Array.isArray(usernameArray) && usernameArray.length > 0) {
      return usernameArray[0].username;
    }
    return 'N/A';
  };

  const filteredLogs = logs.filter(log => {
    if (activeFilter === 'all') return true;
    return activeFilter === 'success' ? log.success : !log.success;
  }).slice(0, 10);

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-2xl text-blue-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-700">Error: {error}</div>
      </div>
    );
  }

  return  (
    <div className="bg-white min-h-screen">
      {/* Navbar */}
      <div className="fixed w-full z-30 flex bg-white p-2 items-center justify-between h-16 px-10 shadow-md">
        <div className="flex items-center space-x-6">
          <a href="/main-page" className="text-sm md:text-md font-medium text-gray-700 hover:text-gray-900">
            Home
          </a>
          <a href="/admin/homeA" className="text-sm md:text-md font-medium text-gray-700 hover:text-gray-900">
            Dashboard
          </a>
          <a href="/admin/courses" className="text-sm md:text-md font-medium text-gray-700 hover:text-gray-900">
            Courses
          </a>
        </div>
        <div className="flex-none h-full text-center flex items-center justify-center">
          <div className="flex space-x-3 items-center px-3">
            <div className="flex-none flex justify-center">
              <div className="w-8 h-8 flex">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShta_GXR2xdnsxSzj_GTcJHcNykjVKrCBrZ9qouUl0usuJWG2Rpr_PbTDu3sA9auNUH64&usqp=CAU"
                  alt="profile"
                  className="shadow rounded-full object-cover"
                />
              </div>
            </div>
            <div className="hidden md:block text-sm md:text-md text-black">
              {userData?.payload.username}
            </div>
          </div>
        </div>
      </div>

    {/* Content */}
    <div className="content transform ease-in-out duration-500 pt-20 px-2 md:px-5 pb-4">
      {/* Breadcrumb Navigation */}
  

        {/* Cards and Log Table */}

        <div className="flex flex-wrap my-5 -mx-2">
          <div className="w-full lg:w-1/3 p-2">
            <div className="flex items-center flex-row w-full bg-gradient-to-r dark:from-cyan-700 dark:to-blue-700 from-indigo-500 via-purple-500 to-pink-500 rounded-md p-3">
              <div className="flex text-indigo-500 dark:text-white items-center bg-white dark:bg-[#0F172A] p-2 rounded-md flex-none w-8 h-8 md:w-12 md:h-12 ">
                <Users className="object-scale-down transition duration-500" />
              </div>
              <div className="flex flex-col justify-around flex-grow ml-5 text-white">
                <div className="text-xs whitespace-nowrap">
                  Total Users
                </div>
                <div className="">
                  {totalUsers}
                </div>
              </div>
              <div className="flex items-center flex-none text-white">
                <ChevronDown className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 p-2 ">
            <div className="flex items-center flex-row w-full bg-gradient-to-r dark:from-cyan-700 dark:to-blue-700 from-indigo-500 via-purple-500 to-pink-500 rounded-md p-3">
              <div className="flex text-indigo-500 dark:text-white items-center bg-white dark:bg-[#0F172A] p-2 rounded-md flex-none w-8 h-8 md:w-12 md:h-12 ">
                <LayoutDashboard className="object-scale-down transition duration-500" />
              </div>
              <div className="flex flex-col justify-around flex-grow ml-5 text-white">
                <div className="text-xs whitespace-nowrap">
                  Total Courses
                </div>
                <div className="">
                  {totalCourses}
                </div>
              </div>
              <div className="flex items-center flex-none text-white">
                <ChevronDown className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 p-2">
            <div className="flex items-center flex-row w-full bg-gradient-to-r dark:from-cyan-700 dark:to-blue-700 from-indigo-500 via-purple-500 to-pink-500 rounded-md p-3">
              <div className="flex text-indigo-500 dark:text-white items-center bg-white dark:bg-[#0F172A] p-2 rounded-md flex-none w-8 h-8 md:w-12 md:h-12 ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="object-scale-down transition duration-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                </svg>
              </div>
              <div className="flex flex-col justify-around flex-grow ml-5 text-white">
                <div className="text-xs whitespace-nowrap">
                  Backup Status
                </div>
                <div className="">
                  {backupLoading ? 'In Progress' : 'Ready'}
                </div>
              </div>
              <div className="flex items-center flex-none text-white">
                <button
                  onClick={triggerBackup}
                  disabled={backupLoading}
                  className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
                >
                  {backupLoading ? 'Backing up...' : 'Trigger Backup'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800" role="alert">
          <span className="font-medium">Info alert!</span> {backupMessage || 'System is running normally.'}
        </div>

        {/* Log Section */}
        <div className="bg-white dark:bg-[#FFFFF] rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-semibold text-blue-700 dark:text-blue mb-6">Login Logs</h1>
          <div className="mb-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`mr-2 px-4 py-2 rounded ${activeFilter === 'all' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('success')}
              className={`mr-2 px-4 py-2 rounded ${activeFilter === 'success' ? 'bg-green-400 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Success
            </button>
            <button
              onClick={() => setActiveFilter('failed')}
              className={`px-4 py-2 rounded ${activeFilter === 'failed' ? 'bg-red-400 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Failed
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-gradient-to-r dark:from-cyan-500 dark:to-blue-500 from-indigo-500 via-purple-500 to-pink-500 rounded-lg overflow-hidden">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Username</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Action</th>
                  <th className="px-4 py-2 text-left">Success</th>
                  <th className="px-4 py-2 text-left">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className={`${
                      log.success ? 'bg-green-100 dark:bg-green-400' : 'bg-red-100 dark:bg-red-400'
                    } border-b dark:border-gray-700`}
                  >
                    <td className={`px-4 py-2 ${log.success ? 'text-green-100 dark:text-green-100' : 'text-red-100 dark:text-red-100'}`}>{getUsername(log.username)}</td>
                    <td className={`px-4 py-2 ${log.success ? 'text-green-100 dark:text-green-100' : 'text-red-100 dark:text-red-100'}`}>{log.role}</td>
                    <td className={`px-4 py-2 ${log.success ? 'text-green-100 dark:text-green-100' : 'text-red-100 dark:text-red-100'}`}>{log.action}</td>
                    <td className={`px-4 py-2 ${log.success ? 'text-green-100 dark:text-green-100' : 'text-red-100 dark:text-red-100'}`}>{log.success ? 'Yes' : 'No'}</td>
                    <td className={`px-4 py-2 ${log.success ? 'text-green-100 dark:text-green-100' : 'text-red-100 dark:text-red-100'}`}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

