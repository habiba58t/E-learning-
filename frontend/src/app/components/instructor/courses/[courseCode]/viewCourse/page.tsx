'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from "@/app/utils/axiosInstance";
import { Types } from 'mongoose';
import axios, { AxiosError } from 'axios';

export interface Course {
  _id: string;
  course_code: string;
  title: string;
  description: string;
  category: string;
  level: 'easy' | 'medium' | 'hard';
  created_by: string;
  created_at: Date;
  Unavailable?: boolean;
  modules: string[];
  totalRating?: number;
  totalStudents?: number;
  averageRating?: number;
  isOutdated: boolean;
  threads: string[];
}

export interface Module {
  _id: string;
  title: string;
  level: 'easy' | 'medium' | 'hard';
  content?: Types.ObjectId[];
  created_at: Date;
  isOutdated: boolean;
}

const backend_url = "http://localhost:3002";

const CourseDetails = () => {
  const params = useParams();
  const courseCode = params.courseCode;

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const router = useRouter();

  async function fetchCourseAndModules() {
    try {
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();
  
      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }
  
      const username = userData.payload.username;
  
      // Fetch course data (handle potential 404)
      try {
        const courseResponse = await axiosInstance.get<Course>(`${backend_url}/courses/${courseCode}`);
        setCourse(courseResponse.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          // Check for Axios-specific error
          if (err.response?.status === 404) {
            console.error("Course not found:", err);
            setError("Course not found. Please check the course code and try again.");
          } else {
            console.error("Error fetching course:", err);
            setError("Failed to load the course. Please try again.");
          }
        } else if (err instanceof Error) {
          // Handle other errors (non-Axios errors)
          console.error("Unknown error:", err);
          setError("An unknown error occurred.");
        }
        // Set course to null or an empty object
        setCourse(null);
      }
      
  
      // Fetch modules data, but allow for the possibility of an empty module array
      const modulesResponse = await axiosInstance.get<Module[]>(`${backend_url}/courses/${username}/${courseCode}/modulesInstructor`);
  
      if (modulesResponse.data && modulesResponse.data.length > 0) {
        setModules(modulesResponse.data);
      } else {
        setModules([]); // No modules available, set empty array
      }
    } catch (err) {
      console.error("Error fetching modules:", err);
      setError("Failed to load the modules. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchCourseAndModules();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  if (loading) {
    return <div>Loading course details...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {course ? (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-semibold text-blue-600 mb-4">{course.title}</h1>
          <div className="text-gray-700 mb-6">
            <p><strong>Code:</strong> {course.course_code}</p>
            <p><strong>Description:</strong> {course.description}</p>
            <p><strong>Category:</strong> {course.category}</p>
            <p><strong>Level:</strong> {course.level}</p>
            <p><strong>Average Rating:</strong> {course.averageRating ?? 'N/A'}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push(`/courses/${courseCode}/update`)}
              className="px-4 py-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white rounded-lg shadow-md hover:opacity-90 transition-all"
            >
              Update Course
            </button>
            <button
              onClick={() => router.push(`/courses/${courseCode}/delete`)}
              className="px-4 py-2 bg-gradient-to-r from-red-400 via-pink-500 to-orange-500 text-white rounded-lg shadow-md hover:opacity-90 transition-all"
            >
              Delete Course
            </button>
            <button
              onClick={() => router.push(`/courses/${courseCode}/create-module`)}
              className="px-4 py-2 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 text-white rounded-lg shadow-md hover:opacity-90 transition-all"
            >
              Create Module
            </button>
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="px-4 py-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white rounded-lg shadow-md hover:opacity-90 transition-all"
              >
                Enrolled Students
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md">
                  <button
                    onClick={() => router.push(`/courses/${courseCode}/students`)}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    View Enrolled Students
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>No course found with the specified code.</div>
      )}

      {/* Modules Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modules</h2>
        {modules.length > 0 ? (
          modules.map((module) => (
            <div key={module._id} className="border-b border-gray-300 py-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-800">{module.title}</span>
                <span className="text-sm text-gray-500">{module.level}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No modules available.</p>
        )}
      </div>
    </div>
  );
};
export default CourseDetails;
