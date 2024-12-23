'use client'

import axiosInstance from '@/app/utils/axiosInstance';
import React, { useEffect, useState } from 'react';

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

const LogPage = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchCookieData() {
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
      console.log('Fetched username:', userData.payload.username);

      const response = await axiosInstance.get<LogEntry[]>(`${backend_url}/log`);
      setLogs(response.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCookieData();
  }, []);

  const getUsername = (usernameArray: LogEntry['username']): string => {
    if (Array.isArray(usernameArray) && usernameArray.length > 0) {
      return usernameArray[0].username;
    }
    return 'N/A';
  };

  if (loading) {
    return <div className="p-6 bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="text-2xl text-blue-700">Loading...</div>
    </div>;
  }

  if (error) {
    return <div className="p-6 bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="text-2xl text-red-700">Error: {error}</div>
    </div>;
  }

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-blue-700 mb-6">Login Logs</h1>
      {userData && (
        <div className="mb-4 text-blue-700">
          Logged in as: {userData.payload.username} (Role: {userData.payload.role})
        </div>
      )}
      <table className="min-w-full table-auto bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Username</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Action</th>
            <th className="px-4 py-2 text-left">Success</th>
            <th className="px-4 py-2 text-left">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr
              key={log.id}
              className={`${log.success ? 'bg-green-100' : 'bg-red-100'} border-b`}
            >
              <td className="px-4 py-2 text-blue-700">{getUsername(log.username)}</td>
              <td className="px-4 py-2 text-blue-700">{log.role}</td>
              <td className="px-4 py-2 text-blue-700">{log.action}</td>
              <td className="px-4 py-2 text-blue-700">{log.success ? 'Yes' : 'No'}</td>
              <td className="px-4 py-2 text-blue-700">{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogPage;