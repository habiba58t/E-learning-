'use client';

import React, { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import router, { useRouter } from "next/navigation";
import Sidebar from "@/app/components/instructor/instructor-sidebar/page";

interface UserData {
  _id: string;
  name: string;
  username: string;
  email: string;
}

const StudentPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<UserData[]>([]);
  const [error, setError] = useState("");
    const router = useRouter(); // Use the hook here

  useEffect(() => {
    fetchStudents();
  }, [searchQuery]);

  const fetchStudents = async () => {
    setError("");
    try {
      const response = await axiosInstance.get<UserData[]>("http://localhost:3002/users/search/private", {
        params: { role: "student", name: searchQuery.trim() },
      });
      setStudents(response.data || []);
    } catch (err) {
      setError("Error fetching students");
      console.error(err);
    }
  };

  const handleUsernameClick = (username: string) => {
    router.push(`/profile/${username}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-100">
      <Sidebar />
      <header className="bg-teal-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">Students</h1>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white text-gray-700 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-teal-300"
            placeholder="Search by name..."
          />
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-6">Search Results</h2>

        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.length > 0 ? (
            students.map((student) => (
              <div key={student._id} className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition duration-300">
                <h3 className="font-bold text-lg text-blue-600">{student.name}</h3>
                <p className="text-gray-600">Email: {student.email}</p>
                <p className="text-gray-600">
                  Username:{" "}
                  <span
                    className="font-bold text-blue-600 cursor-pointer hover:underline"
                    onClick={() => handleUsernameClick(student.username)}
                  >
                    {student.username}
                  </span>
                </p>
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

export default StudentPage;
