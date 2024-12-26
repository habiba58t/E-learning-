'use client';
import { useState, useEffect } from 'react';
import NavBar from '../NavBar/page';
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
  const [enrollMessage, setEnrollMessage] = useState('');
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get<Course[]>('/courses');
        setCourses(response.data);
        setFilteredCourses(response.data); // Initialize filteredCourses with all courses
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
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Navbar */}
      <NavBar searchTerm={searchTerm} handleSearch={handleSearch} />
      <div style={{ marginTop: '60px', padding: '20px', flex: 1 }}>
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Available Courses</h1>
        {message && <div className="mb-4 text-red-600">{message}</div>}
        {enrollMessage && <div className="mb-4 text-blue-600">{enrollMessage}</div>}
        {/* Courses List */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {filteredCourses.map(course => (
              <li key={course._id} className="mb-4 p-4 border border-blue-300 rounded-lg">
                <h2 className="text-xl font-semibold text-blue-700">{course.title}</h2>
                <p className="text-blue-600">{course.description}</p>
                {course.created_by && (
                  <p className="text-blue-500">Instructor: {course.created_by}</p>
                )}
                <button
                  onClick={handleEnroll}
                  className="mt-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                >
                  Enroll
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};