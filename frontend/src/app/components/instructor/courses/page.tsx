'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from "@/app/utils/axiosInstance";

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
  modules: string[]; // Updated for simplicity
  totalRating?: number;
  totalStudents?: number;
  averageRating?: number;
  isOutdated: boolean;
  threads: string[];
}

const backend_url = "http://localhost:3002";

export default function InstructorPage (){
  const [search, setSearch] = useState<string>('');
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

 // Fetch courses for the instructor on load
 async function fetchCookieData() {
    try {
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();

      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }

      const username = userData.payload.username;

      const response = await axiosInstance.get<Course[]>(
        `${backend_url}/courses/coursesInstructor/${username}`
      );
      const courses = response.data;

      setCourseList(courses);
      setFilteredCourses(courses); // Initial filter
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


  // Handle search
  const handleSearchChange = async () => {
    
  
    if (search === "") {
      setFilteredCourses(courseList); // Reset filtered list
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
  
        const username = userData.payload.username;
    try {
      // Perform search based on search term
      const response = await axiosInstance.get<Course[]>( `${backend_url}/courses/coursesbytitle/${username}/${search}`  // Adjust search endpoint
      );
  
      const filteredCourses = response.data.filter((course) =>
        course.title.toLowerCase().includes(search)
      );
  
      setFilteredCourses(filteredCourses);
    } catch (err) {
      console.error("Error searching courses:", err);
      setError("Failed to search for courses. Please try again.");
    }
} catch (err) {
    console.error("Error fetching data:", err);
    setError("Failed to load courses. Please try again.");
  } finally {
    setLoading(false);
  }

  };

  const handleToggleOutdated = async (course_code: string) => {
    try {
        // Fetch user data from cookie
        const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
          credentials: "include",
        });
        const { userData } = await cookieResponse.json();

        if (!userData || !userData.payload?.username) {
          throw new Error("No valid user data found in cookies.");
        }

        const username = userData.payload.username;

    
        const response = await axiosInstance.get<Course[]>(
          `${backend_url}/courses/coursesInstructor/${username}`
        );
        const courses = response.data;
  
        setCourseList(courses);

     // setCourseList(updatedCourses);
      // setFilteredCourses(
      //   updatedCourses.filter((course) =>
      //     course.title.toLowerCase().includes(search)
      //   )
      // );
    
} catch (err) {
    console.error("Error fetching data:", err);
    setError("Failed to load courses. Please try again.");
  } finally {
    setLoading(false);
  }

  };

  const handleViewCourse = (courseCode: string) => {
    router.push(`/components/instructor/courses/${courseCode}/viewCourse`);
  };

  if (loading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-8 text-blue-600">Courses</h1>
  
      {/* Search Bar */}
      <div className="mb-6 flex items-center">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
        />
        <button
          className="px-6 py-2  bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-all"
          onClick={handleSearchChange} // Call handleSearch on button click
        >
          Search
        </button>
      </div>
         
  
      {/* Courses List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course._id}
            className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-lg p-6 hover:shadow-2xl transition-transform transform hover:-translate-y-1"
          >
            <h2 className="text-xl font-bold text-blue-700 mb-2">{course.title}</h2>
           
  
            {/* Outdated Toggle */}
            <button
              onClick={() => handleToggleOutdated(course.course_code)}
              className={`w-full px-4 py-2 rounded-lg text-white ${course.isOutdated ? 'bg-red-500' : 'bg-green-500'} mb-4`}
            >
              {course.isOutdated ? 'Outdated' : 'Up-to-date'}
            </button>
  
            {/* View Course Button */}
            <button
              onClick={() => handleViewCourse(course.course_code)}
              className="w-full px-4 py-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-all"
            >
              View Course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
