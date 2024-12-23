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
  modules: mongoose.Types.ObjectId[];
  totalRating?: number;
  totalStudents?: number;
  averageRating?: number;
  isOutdated: boolean;
  threads: mongoose.Types.ObjectId[];
}

const backend_url = "http://localhost:3002";

export default function AdminPage() {
  const [search, setSearch] = useState<string>('');
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newCourse, setNewCourse] = useState({
    course_code: '',
    title: '',
    description: '',
    category: '',
    level: 'easy',
    created_by: ''
  });

  const router = useRouter();

  // Fetch courses
  async function fetchCookieData() {
    try {
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();

      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }

      const response = await axiosInstance.get<Course[]>(`${backend_url}/courses/coursesAdmin`);
      const courses = response.data;

      setCourseList(courses);
      setFilteredCourses(courses);
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

  // Handle input change for search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      // Reset to full course list when search is cleared
      setFilteredCourses(courseList);
    } else {
      // Filter courses based on input
      const filtered = courseList.filter((course) =>
        course.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  };

  const handleCreateCourse = async () => {
    if (
      !newCourse.course_code ||
      !newCourse.title ||
      !newCourse.description ||
      !newCourse.category ||
      !newCourse.level ||
      !newCourse.created_by
    ) {
      alert("All fields are required to create a course.");
      return;
    }
    const isUsernameValid = await validateUsername(newCourse.created_by);
    if (!isUsernameValid) {
      alert("Invalid username. Please check the instructor username.");
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

      const response = await axiosInstance.post(`${backend_url}/courses/createCourse`, {
        ...newCourse,
        created_by: newCourse.created_by,
      });

      const createdCourse = response.data;
      setCourseList((prev) => [...prev, createdCourse]);
      setFilteredCourses((prev) => [...prev, createdCourse]);

      setNewCourse({
        course_code: '',
        title: '',
        description: '',
        category: '',
        level: 'easy',
        created_by: ''
      });

      setShowCreateForm(false);
      fetchCookieData(); // Refresh course list
      alert("Course created successfully!");
    } catch (err) {
      console.error("Error creating course:", err);
      setError("Failed to create course. Please try again.");
    }
  };

  const validateUsername = async (username: string) => {
    try {
      const response = await axiosInstance.get(`${backend_url}/users/${username}/validation`);
      const data = response.data;
      return data === true;
    } catch (error) {
      setError("Failed to validate username");
      return false;
    }
  };

  const handleToggleOutdated = async (course_code: string) => {
    try {
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();
      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }

      const updatedCourses = courseList.map((course) =>
        course.course_code === course_code
          ? { ...course, isOutdated: !course.isOutdated }
          : course
      );

      await axiosInstance.put(
        `${backend_url}/courses/upoutdated/${userData.payload.username}/${course_code}`,
        {
          isOutdated: !courseList.find((course) => course.course_code === course_code)?.isOutdated,
        }
      );

      setCourseList(updatedCourses);
      setFilteredCourses(updatedCourses.filter((course) =>
        course.title.toLowerCase().includes(search.toLowerCase())
      ));
    } catch (err) {
      console.error("Failed to update outdated status:", err);
      setError("Failed to update course status.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourse = (courseCode: string) => {
    router.push(`/admin/courses/${courseCode}/viewCourse`);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-slate-700">
        Loading courses...
      </div>
    );
  }

  if (error) {
    return <div className="text-blue-500 text-center mt-4 font-semibold">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 drop-shadow-md">
          Courses
        </h1>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <div className="flex flex-row w-full sm:max-w-md shadow-lg rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={handleInputChange}
              className="w-full px-4 py-2 text-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all"
              onClick={() => handleInputChange({ target: { value: "" } } as any)}
            >
              Clear
            </button>
          </div>
          <button
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all"
            onClick={() => setShowCreateForm((prev) => !prev)}
          >
            {showCreateForm ? "Cancel" : "Create Course"}
          </button>
        </div>

        {showCreateForm && (
          <div className="relative mb-8">
            <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-lg shadow-2xl rounded-lg p-6 border border-blue-200">
              <h2 className="text-3xl font-bold mb-4 text-blue-700 text-center drop-shadow-sm">
                Create New Course
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <input
                  type="text"
                  name="course_code"
                  value={newCourse.course_code}
                  onChange={handleFormChange}
                  placeholder="Course Code"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <input
                  type="text"
                  name="title"
                  value={newCourse.title}
                  onChange={handleFormChange}
                  placeholder="Title"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <input
                  type="text"
                  name="description"
                  value={newCourse.description}
                  onChange={handleFormChange}
                  placeholder="Description"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <input
                  type="text"
                  name="category"
                  value={newCourse.category}
                  onChange={handleFormChange}
                  placeholder="Category"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <select
                  name="level"
                  value={newCourse.level}
                  onChange={handleFormChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <input
                  type="text"
                  name="created_by"
                  value={newCourse.created_by}
                  onChange={handleFormChange}
                  placeholder="Instructor Username"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 hover:shadow-md transition-all"
                  onClick={handleCreateCourse}
                >
                  Confirm Create
                </button>
                <button
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 hover:shadow-md transition-all"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white/70 backdrop-blur-md shadow-xl rounded-lg p-6 border border-blue-100 transform hover:-translate-y-1 hover:shadow-2xl transition-all"
            >
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-sm text-gray-600 mb-4">{course.description}</p>
              <div className="flex justify-between items-center mt-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
                  onClick={() => handleViewCourse(course.course_code)}
                >
                  View Details
                </button>
                <button
                  className={`px-4 py-2 text-white rounded-lg font-semibold ${
                    course.isOutdated
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  } transition-all`}
                  onClick={() => handleToggleOutdated(course.course_code)}
                >
                  {course.isOutdated ? "Mark Current" : "Mark Outdated"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
