'use client'
import Link from 'next/link';

const InstructorSidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-6">
      <h2 className="text-2xl text-center text-gray-200 mb-10">Instructor Dashboard</h2>
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
      </ul>
    </div>
  );
};

export default InstructorSidebar;
