// pages/courses.tsx

'use client';
import Sidebar from "@/app/components/student-sidebar/page";
import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import router from 'next/router';


async function fetchCookieData() {
    try {
      const cookieResponse = await fetch(`http://localhost:3002/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();

      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }
      const username = userData.payload.username;
      return username
    }
    catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load courses. Please try again.");
  
}
}


interface Course {
    course_code: string;
    title: string;
    description: string;
    category: string;
    level:string;
    created_by: string;

  }

  const StudentCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    

    const handleViewCourse = (courseCode: string) => {
      router.push(`${courseCode}`);
    };


    useEffect(() => {
        const fetchCourses = async () => {
            const username = await fetchCookieData();
            // Replace with actual student ID or username
          try {
            const response = await fetch(`http://localhost:3002/courses/${username}/courses`);
            if (!response.ok) {
              throw new Error('Failed to fetch courses');
            }
            const data = await response.json();
            setCourses(data);
          } catch (err) {
            setError('Error loading courses');
          } finally {
            setLoading(false);
          }
        };
    
        fetchCourses();
      }, []);


      if (loading) {
        return <div className="text-center">Loading...</div>;
      }
    
      if (error) {
        return <div className="text-center text-red-500">{error}</div>;
      }
    
      return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-semibold text-center mb-8 text-blue-600">My Courses</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div
                  key={course.course_code}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-lg p-6 hover:shadow-2xl transition-transform transform hover:-translate-y-1"
                >
                  <h2 className="text-xl font-bold text-blue-700 mb-2">{course.title}</h2>
                  <p className="text-gray-700 mb-2">Instructor: {course.description}</p>
                  <p className="text-gray-500 text-sm mb-4">{course.category}</p>
                  <button
                    className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-full hover:opacity-90 transition-all"
                    onClick={() => handleViewCourse(course.course_code)}
                  >
                    View Course
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No courses found.</div>
            )}
          </div>
        </div>
        </div>
      );
    };
    
    export default StudentCourses; 

    function setError(errorMessage: string) {
        throw new Error(errorMessage);
      }
