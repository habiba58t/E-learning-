'use client';

import { useRouter } from 'next/navigation';
import axiosInstance from "@/app/utils/axiosInstance";

import { Course } from "../courses/[courseCode]/viewCourse/page";
import InstructorSidebar from "@/app/components/instructor/instructor-sidebar/page";


import { useState, useEffect } from 'react';

const backend_url = "http://localhost:3002";

export interface viewCourses {
  _id: string;
  title: string; // Changed from courseTitle to title
  course_code: string; // Changed from courseCode to course_code
}

const AnalyticsPage = () => {
  const [courses, setCourses] = useState<viewCourses[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Function to fetch courses for the logged-in instructor
  async function fetchCourses() {
    try {
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();

      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }

      const username = userData.payload.username;

      const apiGetCourses = `${backend_url}/courses/coursesInstructor/${username}`;
      const coursesResponse = await axiosInstance.get(apiGetCourses);
      const coursesData: viewCourses[] = coursesResponse.data;

      setCourses(coursesData); // Set courses state with the fetched data
      setLoading(false); // Stop loading spinner
    } catch (err) {
      setError("Failed to fetch courses.");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses(); // Call fetchCourses when the component mounts
  }, []);

  // Handle redirection to analytics page for each course
  const viewCourseAnalytics = (course_code: string) => {
    router.push(`/instructor/analytics/${course_code}`); // Navigate to the instructor's analytics page
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Your Courses</h1>
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {courses.map((course) => (
          <li key={course._id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f4f4f4',
            padding: '15px',
            margin: '10px 0',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{ fontWeight: 'bold', color: 'black' }}>{course.title}</span>
           
            <button
              style={{
                padding: '8px 15px',
                backgroundColor: '#007BFF',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background-color 0.3s'
              }}
              onClick={() => viewCourseAnalytics(course.course_code)}
            >
              View Analytics
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnalyticsPage;
