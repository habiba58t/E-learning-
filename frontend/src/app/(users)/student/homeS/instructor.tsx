"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import Sidebar from "@/app/components/student-sidebar/page";

interface InstructorData {
  _id: string;
  name?: string; // For instructors
  username?: string; // For instructors
  email?: string; // For instructors
}

const InstructorPage = () => {
  const [instructors, setInstructors] = useState<InstructorData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInstructors();
  }, [searchQuery]);

  const fetchInstructors = async () => {
    setError("");
    try {
      const response = await axiosInstance.get<InstructorData[]>(
        "http://localhost:3002/users/search/private",
        {
          params: {
            role: "instructor",
            name: searchQuery.trim(),
          },
        }
      );
      setInstructors(response.data || []);
    } catch (err) {
      console.error("Error fetching instructors:", err);
      setError("Error fetching instructors");
    }
  };

  // Limit displayed instructors to the first three unless searching
  const displayedInstructors =
    searchQuery.trim() === ""
      ? instructors.slice(0, 3) // Only show the first three instructors
      : instructors;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Sidebar />
      <section className="py-20" id="section_instructors">
        <div className="container mx-auto px-4">
          <h2 className="text-gray-500 text-3xl font-bold text-center mb-10">
            Meet your Instructors
          </h2>

          {/* Search Bar */}
          <div className="flex justify-center mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white text-gray-700 rounded-full px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Search instructors by name..."
            />
          </div>

          {/* Instructors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayedInstructors.length > 0 ? (
              displayedInstructors.map((instructor) => (
                <InstructorCard
                  key={instructor._id}
                  instructor={instructor}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-3">
                No instructors found
              </p>
            )}
          </div>

          {/* View More Button */}
          {searchQuery.trim() === "" && instructors.length > 3 && (
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

function InstructorCard({ instructor }: { instructor: InstructorData }) {
  return (
    <div className="relative bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-transform transform hover:scale-105">
      {/* Profile Image */}
      <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center">
        <img
          className="object-cover w-24 h-24 rounded-full shadow"
          src= "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
          alt={instructor.name || "Instructor"}
        />
      </div>

      {/* Instructor Details */}
      <div className="p-6">
        <h5 className="text-lg font-semibold text-gray-800 mb-2">
          {instructor.name}
        </h5>
        <p className="text-sm text-gray-600">Username: {instructor.username}</p>
        <p className="text-sm text-gray-600">Email: {instructor.email}</p>
      </div>
    </div>
  );
}

export default InstructorPage;
