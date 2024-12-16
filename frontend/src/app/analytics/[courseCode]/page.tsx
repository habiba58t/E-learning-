'use client';
import Sidebar from "@/app/components/student-sidebar/page";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { useEffect, useState } from "react";
import { Progress } from "@/app/Progress/page";
import axiosInstance from "@/app/utils/axiosInstance";
import { Course } from "@/app/components/instructor/courses/[courseCode]/viewCourse/page";

const backend_url = "http://localhost:3002";

export interface Data {
    _id: string;
    course_code: string;
}

const PageAnal = () => {
    const [courses, setCourses] = useState<string[]>([]); // Change to string array for course codes
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

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

            // Log the full URL to check if it's correct
            const apiUrl = `${backend_url}/courses/coursesInstructor/${username}`;
            console.log("Fetching:", apiUrl);

            const coursesResponse = await axiosInstance.get(apiUrl);
            const coursesData: Course[] = coursesResponse.data;

            // Extract only course_code from coursesData
            const courseCodes = coursesData.map(course => course.course_code);
            setCourses(courseCodes); // Set the extracted course_codes
            
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load progress data. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCookieData();
    }, []);

    if (loading) {
        return <div>Loading progress data...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    // You can now use 'courses' to display the course codes or any other logic you need.
    return (
        <div>
            <h1>Course Codes:</h1>
            <ul>
                {courses.map(courseCode => (
                    <li key={courseCode}>{courseCode}</li>
                ))}
            </ul>
        </div>
    );
};
