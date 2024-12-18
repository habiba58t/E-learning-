'use client';

import { useState } from 'react';
import Navbar from "../navbar/page"; // Import Navbar
import Sidebar from "../adminsidebar/page"; // Adjust the path as needed

interface Course {
  course_code: string;
  title: string;
  description: string;
  category: string;
  level: string;
  created_by: string;
  modules: string[];
  threads: string[];
}

const AdminPage: React.FC = () => {
  const [formData, setFormData] = useState<Course>({
    course_code: '',
    title: '',
    description: '',
    category: '',
    level: 'easy',
    created_by: '',
    modules: [],
    threads: []
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to submit the form data
    setMessage('New course created successfully!');
    console.log(formData); // Logging form data for now
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="flex">
        <div
          className="fixed top-16 left-0 bottom-0 w-64 bg-blue-900 text-white py-4 px-6"
        >
          <Sidebar />
        </div>

        <div className="ml-64 mt-16 p-8 w-full">
          {message && <div className="mb-4 text-green-500">{message}</div>}

          <h2 className="text-3xl font-bold text-blue-700 mb-6">Create New Course</h2>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Course Details</h2>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="course_code">Course Code</label>
              <input
                type="text"
                id="course_code"
                name="course_code"
                value={formData.course_code}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="level">Difficulty Level</label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="created_by">Created By</label>
              <input
                type="text"
                id="created_by"
                name="created_by"
                value={formData.created_by}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              Confirm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
