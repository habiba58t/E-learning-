'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from "@/app/utils/axiosInstance";
import * as mongoose from 'mongoose';

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
  modules: mongoose.Types.ObjectId[]; // Updated for simplicity
  totalRating?: number;
  totalStudents?: number;
  averageRating?: number;
  isOutdated: boolean;
  threads: mongoose.Types.ObjectId[];
}

const backend_url = "http://localhost:3002";

export default function Homepage() {
  const [search, setSearch] = useState<string>('');
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    course_code: '',
    description: '',
    category: '',
    level: 'easy',
  });

  const router = useRouter();

  // Fetch courses on load
  async function fetchCookieData() {
    try {
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();

      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }

      const username = userData.payload.username;

      const response = await axiosInstance.get<Course[]>(`${backend_url}/courses/coursesInstructor/${username}`);
      const courses = response.data;

      setCourseList(courses);
      setFilteredCourses(courses); // Initial filter
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCookieData();
  }, []);

  // Handle search
  const handleSearchChange = async () => {
    if (search === "") {
      setFilteredCourses(courseList); // Reset filtered list
      return;
    }

    try {
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();

      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }

      const username = userData.payload.username;

      // Perform search based on search term
      const response = await axiosInstance.get<Course[]>(`${backend_url}/courses/coursesbytitle/${username}/${search}`);
      const filteredCourses = response.data.filter((course) =>
        course.title.toLowerCase().includes(search)
      );

      setFilteredCourses(filteredCourses);
    } catch (err) {
      console.error("Error searching courses:", err);
      setError("Failed to search for courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    try {
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();

      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }

      const username = userData.payload.username;

      const response = await axiosInstance.post(`${backend_url}/courses/createCourse`, {
        ...newCourse,
        created_by: username,
      });
      const createdCourse = response.data;
      setCourseList((prev) => [...prev, createdCourse]);
      setFilteredCourses((prev) => [...prev, createdCourse]);

      setNewCourse({
        title: '',
        course_code: '',
        description: '',
        category: '',
        level: 'easy',
      });
      setShowCreateForm(false);
      fetchCookieData(); // Refresh course list
    } catch (err) {
      console.error("Error creating course:", err);
      setError("Failed to create course. Please try again.");
    }
  };

  const handleToggleOutdated = async (course_code: string) => {
    try {
      // Fetch user data from cookie
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();

      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }

      const username = userData.payload.username;

      const response = await axiosInstance.get<Course[]>(`${backend_url}/courses/coursesInstructor/${username}`);
      const courses = response.data;

      setCourseList(courses);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourse = (courseCode: string) => {
    router.push(`/components/instructor/courses/${courseCode}/viewCourse`);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-8 text-blue-600">Courses</h1>

      {/* Search Bar */}
      <div className="mb-6 flex items-center">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
        />
        <button
          className="px-6 py-2  bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-all"
          onClick={handleSearchChange} // Call handleSearch on button click
        >
          Search
        </button>
        <button
          className="px-6 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-lg hover:opacity-90 transition-all"
          onClick={() => setShowCreateForm((prev) => !prev)}
        >
          {showCreateForm ? "Cancel" : "Create Course"}
        </button>
      </div>

      {/* Create Course Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Create New Course</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="course_code"
              value={newCourse.course_code}
              onChange={handleFormChange}
              placeholder="Course Code"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="title"
              value={newCourse.title}
              onChange={handleFormChange}
              placeholder="Title"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="description"
              value={newCourse.description}
              onChange={handleFormChange}
              placeholder="Description"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="category"
              value={newCourse.category}
              onChange={handleFormChange}
              placeholder="Category"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="difficulty_level"
              value={newCourse.level}
              onChange={handleFormChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="mt-4 flex justify-end gap-4">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:opacity-90 transition-all"
              onClick={() => {
                if (!newCourse.course_code || !newCourse.title || !newCourse.description || !newCourse.category || !newCourse.level) {
                  alert("All fields are required to create a course.");
                  return; // Exit if any field is missing
                }
                handleCreateCourse(); // Call the function to create the course
              }}
            >
              Confirm Create
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:opacity-90 transition-all"
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course._id}
            className="bg-white p-4 rounded-lg shadow-lg transition transform hover:scale-105 cursor-pointer"
            onClick={() => handleViewCourse(course.course_code)}
          >
            <h2 className="text-xl font-semibold mb-2 text-blue-600">{course.title}</h2>
            <p className="text-gray-600 mb-2">{course.description}</p>
            <p className="text-sm text-gray-500">Category: {course.category}</p>
            <p className="text-sm text-gray-500">Difficulty: {course.level}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
