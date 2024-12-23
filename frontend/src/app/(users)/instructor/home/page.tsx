'use client';

import React, { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import router, { useRouter } from "next/navigation";
import Sidebar from "@/app/components/instructor/instructor-sidebar/page";

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
  const [notifications, setNotifications] = useState<any[]>([]); // State for storing notifications
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false); // State to control the sliding panel visibility

  const router = useRouter(); // Use the hook here

  useEffect(() => {
    if (selectedCategory === "course") {
      if (searchQuery) {
        filterCourses();  // If there's a search query, filter the courses
      } else {
        fetchAllCourses();  // Fetch all courses if no search query
      }
    } else {
      fetchResults();  // Always fetch results when category is not 'course'
    }
  }, [selectedCategory, searchQuery]); // Both selectedCategory and searchQuery will trigger this effect

  useEffect(() => {
    // Fetch user data on component mount
    fetchCookieData();
  }, []);


  const handleUsernameClick = (username: string) => {
    router.push(`/profile/${username}`);
  };


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
        "http://localhost:3002/courses/"
      );
      setAllCourses(response.data || []);
      setResults(response.data || []); // Initially display all courses
    } catch (err) {
      setError("Error fetching courses");
      console.error(err);
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

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get(`http://localhost:3002/notification/usernotifications/${username}`); 
      console.log("API Response:", response.data);
      
      setNotifications(response.data || []); 
     // setIsNotificationPanelOpen(true);
      console.log("Notifications fetched", response.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
    setIsNotificationPanelOpen(true); // Open the notification panel when notifications are fetched
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
          <p className="text-gray-600">
          Username:{" "}
          <span
            className="font-bold text-blue-600 cursor-pointer hover:underline"
            onClick={() => handleUsernameClick(item.username || "")}
          >
            {item.username}
          </span>
        </p>        
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-100">
      <Sidebar />
      {/* Header */}
      <header className="bg-teal-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">Home</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white text-gray-700 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-teal-300"
              placeholder="Search by name or title..."
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              <option value="student">Students</option>
              <option value="instructor">Instructors</option>
              <option value="course">Courses</option>
            </select>
            {/* Notification Button */}
            <button
              onClick={fetchNotifications}
              className="relative p-2 rounded-full bg-teal-700 hover:bg-teal-800"
            >
              <span className="text-white">🔔</span>
              {/* Notification Count Badge (if there are notifications) */}
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Notification Sliding Panel */}
      {isNotificationPanelOpen && (
        <div className="fixed top-0 right-0 w-80 bg-white shadow-lg h-full z-50 p-4">
          <button
            onClick={() => setIsNotificationPanelOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ❌
          </button>
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          <div className="space-y-4">
  {notifications.length > 0 ? (
    notifications.map((notification, index) => (
      <div key={index} className="bg-gray-100 p-2 rounded-lg shadow-sm">
        <h3 className="font-bold">{notification.title}</h3>
        <p>{notification.message}</p>
        <p className="text-sm text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
      </div>
    ))
  ) : (
    <p>No new notifications</p>
  )}
</div>;
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-6">
          Search Results
        </h2>

        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.length > 0 ? (
            results
              .filter(item => (item.username ? item.username !== username : item))
              .map(item => renderResult(item))) : (
            <p className="text-center text-gray-500">No results found</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
