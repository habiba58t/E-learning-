'use client'
import Link from 'next/link';
import { useState } from 'react';

const backend_url = "http://localhost:3002";

const AdminSideBar = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const triggerBackup = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${backend_url}/backup/trigger`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Backup created successfully! Backup stored at: ${data.path}`);
      } else {
        setMessage(`Backup failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error triggering backup:', error);
      setMessage('An error occurred while triggering the backup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-6">
      <h2 className="text-2xl text-center text-gray-200 mb-10">Admin Dashboard</h2>
      <ul className="space-y-6">
        <li>
          <Link href="/" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
            Home
          </Link>
        </li>
        <li>
          <Link href="/admin/courses" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
            My Courses
          </Link>
        </li>
        <li>
          <Link href="/create-quiz" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
            Create Quiz
          </Link>
        </li>
        <li>
          <Link href="/manage-students" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
            Manage Students
          </Link>
        </li>
        <li>
          <Link href="/question-bank" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
            Question Bank
          </Link>
        </li>
        <li>
          <Link href="/feedback" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
            Student Feedback
          </Link>
        </li>
        {/* Trigger Backup Button */}
        <li>
          <button
            onClick={triggerBackup}
            className="w-full text-lg bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded text-white"
            disabled={loading}
          >
            {loading ? 'Triggering Backup...' : 'Trigger Backup'}
          </button>
          {message && <p className="text-sm text-center mt-2 text-green-400">{message}</p>}
        </li>
      </ul>
    </div>
  );
};

export default AdminSideBar;