'use client';

import React, { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import Sidebar from "@/app/components/instructor/instructor-sidebar/page";

interface CourseData {
  _id: string;
  title: string;
  description: string;
  category: string;
  created_by: string;
  average_rating: string;
}

const CoursePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, [searchQuery]);

  const fetchCourses = async () => {
    setError("");
    try {
      const response = await axiosInstance.get<CourseData[]>("http://localhost:3002/courses", {
        params: { title: searchQuery.trim() },
      });
      setCourses(response.data || []);
    } catch (err) {
      setError("Error fetching courses");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-100">
      <Sidebar />
      <header className="bg-teal-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">Courses</h1>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white text-gray-700 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-teal-300"
            placeholder="Search by title..."
          />
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-6">Search Results</h2>

        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course._id} className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition duration-300">
                <h3 className="font-bold text-lg text-blue-600">{course.title}</h3>
                <p className="text-gray-600">Category: {course.category}</p>
                <p className="text-gray-600">Instructor: {course.created_by}</p>
                <p className="text-gray-600">Average Rating: {course.average_rating || "N/A"}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No results found</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default CoursePage;
