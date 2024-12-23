"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import Sidebar from "@/app/components/instructor/instructor-sidebar/page";
import { useRouter } from "next/navigation";

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

  // Limit displayed courses to the first three unless searching
  const displayedCourses =
    searchQuery.trim() === "" ? courses.slice(0, 3) : courses;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-100">
      <Sidebar />
      <section className="py-20" id="section_courses">
        <div className="container mx-auto px-4">
          <h2 className="text-gray-500 text-3xl font-bold text-center mb-10">
            Browse Courses
          </h2>

          {/* Search Bar */}
          <div className="flex justify-center mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white text-gray-700 rounded-full px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Search courses by title..."
            />
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayedCourses.length > 0 ? (
              displayedCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-3">
                No courses found
              </p>
            )}
          </div>

          {/* View More Button */}
          {searchQuery.trim() === "" && courses.length > 3 && (
            <div className="text-center mt-8">
              <button
                className="px-6 py-3 bg-blue-800 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300"
                onClick={() => setSearchQuery("*")}
              >
                View More
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

function CourseCard({ course }: { course: CourseData }) {
  return (
    <div className="relative bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-transform transform hover:scale-105">
      {/* Category Badge */}
      <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold rounded-full px-3 py-1">
        {course.category}
      </div>

      {/* Course Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{course.description}</p>
        <p className="text-sm text-gray-600">Instructor: {course.created_by}</p>
        <p className="text-sm text-gray-600">
          Average Rating: {course.average_rating || "N/A"} ⭐
        </p>
      </div>
    </div>
  );
}

export default CoursePage;
