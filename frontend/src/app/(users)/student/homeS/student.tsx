"use client"; // Ensure this is placed at the top of the file to indicate client-side rendering

import React, { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/student-sidebar/page";

interface UserorCourseData {
  _id: string;
  name?: string; // For users
  username?: string; // For users
  email?: string; // For users
}

const StudentPage = () => {
  const [students, setStudents] = useState<UserorCourseData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchCookieData();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [searchQuery]);

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
    } catch (err) {
      console.error("Error fetching cookie data:", err);
      setError("Error fetching cookie data");
    }
  };

  const fetchStudents = async () => {
    setError("");
    try {
      const response = await axiosInstance.get<UserorCourseData[]>(
        "http://localhost:3002/users/search/private",
        {
          params: {
            role: "student",
            name: searchQuery.trim(),
          },
        }
      );
      setStudents(response.data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Error fetching students");
    }
  };

  const handleUsernameClick = (username: string) => {
    router.push(`/profile/${username}`);
  };

  const handleRedirectToChat = (receiverUsername: string | undefined) => {
    if (username && receiverUsername) {
      router.push(`/student/private-chats/${username}/${receiverUsername}`);
    } else {
      setError("Unable to redirect to chat");
    }
  };

  // Limit displayed students to the first three unless searching
  const displayedStudents =
    searchQuery.trim() === ""
      ? students.slice(0, 3) // Only show the first three students
      : students;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Sidebar />
      <section className="py-20" id="section_students">
        <div className="container mx-auto px-4">
          <h2 className="text-gray-500 text-3xl font-bold text-center mb-10">
            Meet your colleagues
          </h2>
          {/* Search Bar */}
          <div className="flex justify-center mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white text-gray-700 rounded-full px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Search students by name..."
            />
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayedStudents.length > 0 ? (
              displayedStudents.map((student) => (
                <StudentCard
                  key={student._id}
                  student={student}
                  username={username}
                  handleRedirectToChat={handleRedirectToChat}
                  handleUsernameClick={handleUsernameClick} // Pass the function as a prop
                />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-3">
                No students found
              </p>
            )}
          </div>

          {/* View More Button */}
          {searchQuery.trim() === "" && students.length > 3 && (
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

interface StudentCardProps {
  student: UserorCourseData;
  username: string | null;
  handleUsernameClick: (username: string) => void;
  handleRedirectToChat: (receiverUsername: string | undefined) => void;
}

function StudentCard({
  student,
  username,
  handleRedirectToChat,
  handleUsernameClick,
}: StudentCardProps) {
  return (
    <div className="relative bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-transform transform hover:scale-105">
      {/* Profile Image */}
      <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center">
        <img
          className="object-cover w-24 h-24 rounded-full shadow"
          src="https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
          alt={student.name || "Student"}
        />
      </div>

      {/* Student Details */}
      <div className="p-6">
        <h5 className="text-lg font-semibold text-gray-800 mb-2">
          {student.name}
        </h5>
        <p className="text-gray-600">
          Username:{" "}
          <span
            className="font-bold text-blue-600 cursor-pointer hover:underline"
            onClick={() => handleUsernameClick(student.username || "")}
          >
            {student.username}
          </span>
        </p>         <p className="text-sm text-gray-600">Email: {student.email}</p>
      </div>

      {/* Chat Button */}
      <div className="flex justify-center pb-4">
        <button
          onClick={() => handleRedirectToChat(student.username)}
          className="mt-4 px-4 py-2 bg-blue-800 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300"
        >
          Message
        </button>
      </div>
    </div>
  );
}

export default StudentPage;
