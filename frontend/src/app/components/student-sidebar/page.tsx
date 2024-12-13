'use client'
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-6">
      <h2 className="text-2xl text-center text-gray-200 mb-10">Student Dashboard</h2>
      <ul className="space-y-6">
        <li>
          <Link href="/" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
            Home
          </Link>
        </li>
        <li>
          <Link href="/my-courses" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
            My Courses
          </Link>
        </li>
        <li>
          <Link href="/quizzes" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
            Quizzes
          </Link>
        </li>
        <li>
          <Link href="/progress" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
           My Progress
          </Link>
        </li>
        <li>
          <Link href="/forum" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
            Discussions
          </Link>
        </li>
        <li>
          <Link href="/forum" className="block text-lg hover:bg-gray-700 py-2 px-4 rounded">
            Chats
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
