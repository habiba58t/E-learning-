"use client"

import React, { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import router, { useRouter } from "next/navigation";

interface UserorCourseData {
  _id: string;
  name?: string; // For users
  username?: string; // For users
  email?: string; // For users
  title?: string; // For courses
  description?: string; // For courses
  created_by?: string; // For courses
  average_rating?: string; // For courses
  category?: string; // For courses
  course_code: string; // For courses
}

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("student");
  const [error, setError] = useState("");
  const [results, setResults] = useState<UserorCourseData[]>([]);
  const [allCourses, setAllCourses] = useState<UserorCourseData[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<Record<string, string>>({});

  const router = useRouter(); // Use the hook here

  useEffect(() => {
    if (selectedCategory === "course") {
      fetchAllCourses();
    } else {
      fetchResults();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory === "course") {
      filterCourses();
    } else {
      fetchResults();
    }
  }, [searchQuery]);

  useEffect(() => {
    // Fetch user data on component mount
    fetchCookieData();
  }, []);

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

      const user = userData.payload.username;
      setUsername(user);
      console.log("User logged in:", user);
    } catch (err) {
      console.error("Error fetching cookie data:", err);
      setError("Error fetching cookie data");
    }
  };

  const fetchResults = async () => {
    setError("");
    try {
      const apiEndpoint = getApiEndpoint(selectedCategory);
      const params: { name?: string; role?: string } = {};

      if (selectedCategory !== "course") {
        params.role = selectedCategory;
      }

      if (searchQuery) {
        params.name = searchQuery.trim();
      }

      const response = await axiosInstance.get<UserorCourseData[]>(apiEndpoint, { params });
      setResults(response.data || []);
    } catch (err) {
      setError("Error fetching results");
      console.error(err);
    }
  };

  const fetchAllCourses = async () => {
    setError("");
    try {
      const response = await axiosInstance.get<UserorCourseData[]>(
        "http://localhost:3002/courses/student"
      );
      setAllCourses(response.data || []);
      setResults(response.data || []); // Initially display all courses
    } catch (err) {
      setError("Error fetching courses");
      console.error(err);
    }
  };

  const handleEnroll = async (key: string) => {
    if (!username) {
      setError("User is not logged in");
      return;
    }

    try {
      const response = await axiosInstance.put(
        `http://localhost:3002/student/enroll/${key}`
      );
      alert("You enrolled successfully!")
      router.push("/student/courses");
    } catch (err) {
      console.error("Error enrolling in course:", err);
    }
  };

  const handleIsEnrolled = async (courseid: string) => {
    if (!username) {
      setError("User is not logged in");
      return "no";
    }

    try {
      const response = await axiosInstance.get<string>(
        `http://localhost:3002/student/isenrolled/${courseid}`
      );
      return response.data; // Returns "yes" or "no"
    } catch (err) {
      console.error("Error checking enrollment:", err);
      setError("Error checking enrollment");
      return "no";
    }
  };

  const filterCourses = () => {
    const filtered = allCourses.filter((course) =>
      course.title?.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
    setResults(filtered);
  };

  const getApiEndpoint = (category: string) => {
    switch (category) {
      case "student":
      case "instructor":
        return "http://localhost:3002/users/search/private";
      default:
        return "";
    }
  };

  const renderResult = (item: UserorCourseData) => {
    if (selectedCategory === "course") {
      return (
        <div
          key={item._id}
          className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition duration-300"
        >
          <h3 className="font-bold text-lg text-blue-600">{item.title}</h3>
          <p className="text-gray-600">Category: {item.category}</p>
          <p className="text-gray-600">Description: {item.description}</p>
          <p className="text-gray-600">Instructor: {item.created_by}</p>
          <p className="text-gray-600">Average Rating: {item.average_rating || "N/A"}</p>
          {username && (
            <div>
              {enrollmentStatus[item._id] === "yes" ? (
                <p className="text-blue-600">You are enrolled in the course!</p>
              ) : (
                <button
                  onClick={() => handleEnroll(item.course_code)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Enroll
                </button>
              )}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          key={item._id}
          className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition duration-300"
        >
          <h3 className="font-bold text-lg text-blue-600">{item.name}</h3>
          <p className="text-gray-600">Email: {item.email}</p>
          <p className="text-gray-600">Username: {item.username}</p>
        </div>
      );
    }
  };

  useEffect(() => {
    // Check enrollment status for all courses when data is available
    const fetchEnrollmentStatus = async () => {
      const status: Record<string, string> = {};
      for (const course of allCourses) {
        const enrollment = await handleIsEnrolled(course._id);
        status[course._id] = enrollment;
      }
      setEnrollmentStatus(status);
    };

    if (allCourses.length > 0 && username) {
      fetchEnrollmentStatus();
    }
  }, [allCourses, username]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">Home</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white text-gray-700 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Search by name or title..."
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="student">Students</option>
              <option value="instructor">Instructors</option>
              <option value="course">Courses</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-6">
          Search Results
        </h2>

        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.length > 0 ? (
            results.map((item) => renderResult(item))
          ) : (
            <p className="text-center text-gray-500">No results found</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;