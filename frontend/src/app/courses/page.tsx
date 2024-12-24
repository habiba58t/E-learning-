'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/app/utils/axiosInstance';
import NavBar from '../sections/Navbar/page';
const backend_url = 'http://localhost:3002';
import { FaStar } from "react-icons/fa";

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
  averageRating: number;
}

interface InstructorData {
  _id: string;
  name?: string;
  username?: string;
  email?: string;
  averageRating?: number;
}
export default function MainPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState('');
  const [instructors, setInstructors] = useState<Record<string, InstructorData>>({}); // Map instructor data by their ID
  const [courseRatings, setCourseRatings] = useState<Record<string, number>>({}); // Store ratings by courseId

  // Function to fetch courses and associated instructor data
  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Fetch courses
      const response = await axiosInstance.get<Course[]>(`${backend_url}/courses`);
      const courses = response.data;
      setCourses(courses);
      setFilteredCourses(courses);

      // Fetch instructor data for each course
      const instructorPromises = courses.map(async (course) => {
        const instructorResponse = await axiosInstance.get<InstructorData>(`http://localhost:3002/users/${course.created_by}`);
        const instructorData = instructorResponse.data;
        return { courseId: course._id, instructorData };
      });

      // Resolve all instructor data promises concurrently
      const instructorResults = await Promise.all(instructorPromises);

      // Create a mapping of instructor data by course ID
      const instructorsData: Record<string, InstructorData> = {};
      instructorResults.forEach(({ courseId, instructorData }) => {
        instructorsData[courseId] = instructorData;
      });

      setInstructors(instructorsData);

      // Fetch ratings for each course
      const ratingPromises = courses.map(async (course) => {
        const response = await fetch(`http://localhost:3002/courses/getavg/${course._id}`);
        const averageRating = await response.json();
        return { courseId: course._id, averageRating };
      });

      // Resolve all rating fetches concurrently
      const ratingResults = await Promise.all(ratingPromises);

      // Create a mapping of ratings by course ID
      const ratingsData: Record<string, number> = {};
      ratingResults.forEach(({ courseId, averageRating }) => {
        ratingsData[courseId] = averageRating;
      });

      setCourseRatings(ratingsData);

    } catch (error) {
      console.error('Error fetching courses, instructor data, or ratings:', error);
      setMessage('Error fetching courses, instructor data, or ratings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(); // Fetch data on component mount
  }, []); // Empty dependency array to fetch data only on mount

    

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
          {filteredCourses.map(course => {
            const instructor = instructors[course._id];

            return (
              <div
                key={course._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-xl font-semibold text-blue-700">{course.title}</h2>
                <p className="text-blue-600 mb-4">{course.description}</p>
              {/* Display Course Rating */}
<p className="text-sm text-gray-600 flex items-center mb-4">
  <strong className="mr-2">Course Rating:</strong>
  {courseRatings[course._id] !== undefined && !isNaN(courseRatings[course._id]) ? (
    <>
      {Number.isInteger(courseRatings[course._id])
        ? courseRatings[course._id].toString()
        : (courseRatings[course._id] as number).toFixed(2)}
      <FaStar className="ml-1 text-yellow-500" />
    </>
  ) : (
    "Loading..."
  )}
</p>
{/* Display Instructor and Rating */}
{instructor ? (
  <div className="flex items-center mb-4">
    <p className="text-sm text-gray-600 mr-4">
      <strong className="mr-2">Instructor:</strong>
      {instructor.username || 'Unknown'} {/* Display instructor's username */}
    </p>
    <p className="text-sm text-gray-600 flex items-center">
      <span className="mr-2">Rating:</span>
      {instructor.averageRating !== undefined && instructor.averageRating !== null ? (
        <>
          {Number.isInteger(instructor.averageRating)
            ? instructor.averageRating.toString()
            : instructor.averageRating.toFixed(2)}
          <FaStar className="ml-1 text-yellow-500" />
        </>
      ) : (
        "Not Rated"
      )}
    </p>
  </div>
) : (
  <p className="text-sm text-gray-600">Instructor data not available</p>
)}


                <button
                  onClick={handleEnroll}
                  className="mt-4 bg-blue-800 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition duration-200"
                >
                  Enroll
                </button>
              </div>
            );
          })}
        </div>
      )}


      </div>
    </div>
  );
}