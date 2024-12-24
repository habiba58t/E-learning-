"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/student-sidebar/page";

interface CourseData {
  _id: string;
  title: string;
  description: string;
  category: string;
  created_by: string;
  average_rating?: string;
  course_code: string;
}

const CoursesPage = () => {
  const [allCourses, setAllCourses] = useState<CourseData[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseData[]>([]);
  const [notEnrolledCourses, setNotEnrolledCourses] = useState<CourseData[]>([]);
  const [displayCategory, setDisplayCategory] = useState<"enrolled" | "notEnrolled">("enrolled");
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchCookieData();
  }, []);

  useEffect(() => {
    if (username) fetchCourses();
  }, [searchQuery, username]);


  
  const fetchCookieData = async () => {
    try {
      const response = await fetch("http://localhost:3002/auth/get-cookie-data", {
        credentials: "include",
      });
      const { userData } = await response.json();

      if (!userData?.payload?.username) {
        console.error("No cookie data found");
        setError("No cookie data found");
        return;
      }

      setUsername(userData.payload.username);
    } catch (err) {
      console.error("Error fetching cookie data:", err);
      setError("Error fetching cookie data");
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get<CourseData[]>("http://localhost:3002/courses", {
        params: { title: searchQuery.trim() },
      });
      const courses = response.data || [];
      setAllCourses(courses);

      const enrolled = [];
      const notEnrolled = [];

      for (const course of courses) {
        const enrollmentStatus = await checkEnrollment(course._id);
        if (enrollmentStatus === "yes") enrolled.push(course);
        else notEnrolled.push(course);
      }

      setEnrolledCourses(enrolled);
      setNotEnrolledCourses(notEnrolled);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Error fetching courses");
    }
  };

  const checkEnrollment = async (courseId: string): Promise<string> => {
    try {
      const response = await axiosInstance.get<string>(
        `http://localhost:3002/student/isenrolled/${courseId}`
      );
      return response.data; // "yes" or "no"
    } catch (err) {
      console.error("Error checking enrollment status:", err);
      return "no";
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await axiosInstance.put(`http://localhost:3002/student/enroll/${courseId}`);
      alert("You have successfully enrolled in the course!");
      fetchCourses(); // Refresh the course list and enrollment status
    } catch (err) {
      console.error("Error enrolling in course:", err);
      alert("Failed to enroll in course.");
    }
  };

  const handleClick = async (course_code: string) =>{
     const course = course_code
    router.push(`/student/${course}`)
  }

  const displayedCourses =
    displayCategory === "enrolled"
      ? enrolledCourses.slice(0, 3)
      : notEnrolledCourses.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Sidebar />
      <section className="py-20" id="section_courses">
        <div className="container mx-auto px-4">
          <h2 className="text-gray-500 text-3xl font-bold text-center mb-10">
            Explore Courses
          </h2>
          {/* Buttons for category selection */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setDisplayCategory("enrolled")}
              className={`px-6 py-3 font-bold rounded-full ${
                displayCategory === "enrolled"
                  ? "bg-blue-800 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              Enrolled Courses
            </button>
            <button
              onClick={() => setDisplayCategory("notEnrolled")}
              className={`px-6 py-3 font-bold rounded-full ${
                displayCategory === "notEnrolled"
                  ? "bg-blue-800 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              Enroll in New Courses
            </button>
          </div>

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
                <CourseCard
                  key={course._id}
                  course={course}
                  username={username}
                  displayCategory={displayCategory}
                  handleEnroll={handleEnroll}
                  handleClick={handleClick}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-3">
                No courses found
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

function CourseCard({
  course,
  username,
  displayCategory,
  handleEnroll,
  handleClick,
}: {
  course: CourseData;
  username: string | null;
  displayCategory: "enrolled" | "notEnrolled";
  handleEnroll: (courseId: string) => void;
  handleClick: (course_code: string) => void;
}) {
  return (
    <div className="relative bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-transform transform hover:scale-105">
      {/* Course Details */}
      <div className="p-6">
        <h5 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h5>
        <p className="text-sm text-gray-600">Category: {course.category}</p>
        <p className="text-sm text-gray-600">Instructor: {course.created_by}</p>
        <p className="text-sm text-gray-600">
          Average Rating: {course.average_rating || "N/A"}
        </p>
        <p className="text-sm text-gray-600">{course.description}</p>
      </div>

      {/* Enroll Button */}
      <div className="flex justify-center pb-4">
        {displayCategory === "enrolled" ? (

        <button
            onClick={() => handleClick(course.course_code)}
            className="mt-4 px-4 py-2 bg-blue-800 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300"
          >            Go to courses
          </button>
        ) : (
          <button
            onClick={() => handleEnroll(course._id)}
            className="mt-4 px-4 py-2 bg-blue-800 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300"
          >
            Enroll
          </button>
        )}
      </div>
    </div>
  );
}

export default CoursesPage;
