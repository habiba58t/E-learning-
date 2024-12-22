'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/app/utils/axiosInstance';
import NavBar from '../sections/Navbar/page';
const backend_url = 'http://localhost:3002';

interface Course {
  _id: string;
  course_code: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  created_by: string;
  modules: string[];
  threads: string[];
}

export default function MainPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get<Course[]>(`${backend_url}/courses`);
        setCourses(response.data);
        setFilteredCourses(response.data); 
      } catch (error) {
        console.error('Error fetching courses:', error);
        setMessage('Error fetching courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const lowerCaseSearchTerm = e.target.value.toLowerCase();
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      (course.created_by && course.created_by.toLowerCase().includes(lowerCaseSearchTerm))
    );
    setFilteredCourses(filtered);
  };

  const handleEnroll = () => {
    setEnrollMessage('Please log in to enroll in the course.');
    setTimeout(() => setEnrollMessage(''), 3000); // Clear message after 3 seconds
  };

  return (
    <div className="bg-gradient-to-r from-blue-800 to-teal-400 min-h-screen">
      {/* Navbar */}
      <NavBar />

      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Available Courses</h1>

        {/* Pop-up messages */}
        {message && (
          <div className="fixed top-5 right-5 bg-red-600 text-white py-4 px-8 text-2xl rounded-lg shadow-lg transition-all duration-300 transform translate-x-0 opacity-100">
            {message}
          </div>
        )}
        
        {enrollMessage && (
          <div className="fixed bottom-5 right-5 bg-blue-600 text-white py-4 px-8 text-2xl rounded-lg shadow-lg transition-all duration-300 transform translate-x-0 opacity-100">
            {enrollMessage}
          </div>
        )}

        {/* Search Bar */}
        <div className="text-gray-400 mb-6 flex justify-center">
          <div className="relative w-2/3">
            <input
              type="text"
              placeholder="Search for courses..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-3 rounded-full border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Courses List */}
        {loading ? (
          <div className="text-center text-white">Loading...</div>
        ) : (
          <div className="space-y-6">
            {filteredCourses.map(course => (
              <div
                key={course._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-xl font-semibold text-blue-700">{course.title}</h2>
                <p className="text-blue-600 mb-4">{course.description}</p>
                  <p className="text-blue-500 mb-4">Instructor: {course.created_by}</p>
                <button
                  onClick={handleEnroll}
                  className="mt-4 bg-blue-800 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition duration-200"
                >
                  Enroll
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
