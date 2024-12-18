'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from; // Import Navbar
import axiosInstance from '@/app/utils/axiosInstance';
interface Course {
  _id: string; // MongoDB ObjectId
  course_code: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  created_by: string;
  modules: string[];
  threads: string[];
}

export default function MainPage () {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get<Course[]>('cd/courses'); 
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
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Navbar */}
      <Navbar />

      <div style={{ marginTop: '60px', padding: '20px', flex: 1 }}>
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Available Courses</h1>
        {message && <div className="mb-4 text-red-600">{message}</div>}

        {/* Search Bar */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 mb-6 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search courses by title..."
        />

        {/* Courses List */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {filteredCourses.map(course => (
              <li key={course._id} className="mb-4 p-4 border rounded-lg">
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <p className="text-blue-600">{course.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};


