"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import Sidebar from "@/app/components/instructor/instructor-sidebar/page";
import { useRouter } from "next/navigation";

interface UserData {
  _id: string;
  name: string;
  username: string;
  email: string;
}

const StudentPage = () => {
  const [students, setStudents] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const router = useRouter(); // Use the hook here

  useEffect(() => {
    fetchStudents();
  }, [searchQuery]);

  const fetchStudents = async () => {
    setError("");
    try {
      const response = await axiosInstance.get<UserData[]>(
        "http://localhost:3002/users/search/private",
        {
          params: { role: "student", name: searchQuery.trim() },
        }
      );
      setStudents(response.data || []);
    } catch (err) {
      setError("Error fetching students");
      console.error(err);
    }
  };

  // Limit displayed students to the first three unless searching
  const displayedStudents =
    searchQuery.trim() === "" ? students.slice(0, 3) : students;

  const handleUsernameClick = (username: string) => {
    router.push(`/profile/${username}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-100">
      <Sidebar />
      <section className="py-20" id="section_students">
        <div className="container mx-auto px-4">
          <h2 className="text-gray-500 text-3xl font-bold text-center mb-10">
            Meet the Students
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
                  onUsernameClick={handleUsernameClick}
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

function StudentCard({
  student,
  onUsernameClick,
}: {
  student: UserData;
  onUsernameClick: (username: string) => void;
}) {
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
        <p className="text-sm text-gray-600">Username: {student.username}</p>
        <p className="text-sm text-gray-600">Email: {student.email}</p>
        <p className="text-sm text-gray-600">
          Username:{" "}
          <span
            className="font-bold text-blue-600 cursor-pointer hover:underline"
            onClick={() => onUsernameClick(student.username)}
          >
            {student.username}
          </span>
        </p>
      </div>
    </div>
  );
}

export default StudentPage;
