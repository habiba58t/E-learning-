'use client';
import Sidebar from "@/app/components/student-sidebar/page";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { useState, useEffect } from 'react';
import { Course } from "../components/instructor/courses/[courseCode]/viewCourse/page";
import axiosInstance from "../utils/axiosInstance";

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const backend_url = "http://localhost:3002";

export interface AnalyticsData {
    _id: string;
    course_code: string;
    enrolledStudents: number;
    completedStudents: number;
    avgCompletion: number;
    avgScore: number;
    avgRatingInstructor: number;
    avgRatingCourse: number;
    numberOfStudentsbelowAvg: number;
    numberOfStudentsAvg: number;
    numberOfStudentsAboveAvg: number;
}

const Analytics = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    async function fetchAnalyticsData() {
        try {
            const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
                credentials: "include",
            });
            const { userData } = await cookieResponse.json();

            if (!userData || !userData.payload?.username) {
                throw new Error("No valid user data found in cookies.");
            }

            const username = userData.payload.username;

            // Fetch courses
            const apiGetCourses = `${backend_url}/courses/coursesInstructor/${username}`;
            const coursesResponse = await axiosInstance.get(apiGetCourses);
            const coursesData: Course[] = coursesResponse.data;

            // Fetch additional data for each course
            const coursesWithAnalytics = [];

for (let i = 0; i < coursesData.length; i++) {
    const course = coursesData[i];

    try {
        const enrolledStudentsResponse = await axiosInstance.get(`${backend_url}/progress/enrolled/${course.course_code}`);
        const completedStudentsResponse = await axiosInstance.get(`${backend_url}/progress/completedNumber/${course.course_code}`);
        const avgCompletionResponse = await axiosInstance.get(`${backend_url}/progress/completedNumber/${course.course_code}`);
        const avgScoreResponse = await axiosInstance.get(`${backend_url}/courses/${course.course_code}/average-score`);
        const ratingResponse = await axiosInstance.get(`${backend_url}/instructor/rating/${username}`);
        const studentsBelowAvgResponse = await axiosInstance.get(`${backend_url}/student/levelEasy/${course._id}`);
        const studentsAvgResponse = await axiosInstance.get(`${backend_url}/student/mediumLevel/${course._id}`);
        const studentsAboveAvgResponse = await axiosInstance.get(`${backend_url}/student/hardLevel/${course._id}`);

        console.log("Enrolled Students Response:", enrolledStudentsResponse.data);

        // Combine course data with the additional fetched analytics data
        coursesWithAnalytics.push({
            _id: course._id,
            course_code: course.course_code,
            enrolledStudents: enrolledStudentsResponse.data,
            completedStudents: completedStudentsResponse.data,
            avgCompletion: avgCompletionResponse.data,
            avgScore: avgScoreResponse.data.avgScore,
            avgRatingInstructor: ratingResponse.data,
            avgRatingCourse: ratingResponse.data, //nesheel rating instructor and call rating from course
            numberOfStudentsbelowAvg: studentsBelowAvgResponse.data,
            numberOfStudentsAvg: studentsAvgResponse.data,
            numberOfStudentsAboveAvg: studentsAboveAvgResponse.data,
        });
    } catch (error) {
        console.error(`Error fetching data for course ${course.course_code}:`, error);
    }
}

             console.log("Courses With Analytics:", coursesWithAnalytics);
            setAnalytics(coursesWithAnalytics); // Set the final analytics data
            console.log(analytics)
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load analytics data. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-6">Course Analytics</h1>

                <div className="space-y-6">
                    {analytics.map((data, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Course Code: {data.course_code}
                            </h2>

                            {/* Bar Chart for Completion Levels */}
                            <div style={{ width: "300px", height: "200px", margin: "auto" }}>
                                <Bar
                                    data={{
                                        labels: ["Easy", "Medium", "Hard"],
                                        datasets: [
                                            {
                                                label: "Completion Levels",
                                                data: [
                                                    data.avgCompletion, // Adjusted values based on your course data
                                                    data.avgCompletion,
                                                    data.avgCompletion,
                                                ],
                                                backgroundColor: [
                                                    "#FF6384",
                                                    "#36A2EB",
                                                    "#FFCE56",
                                                ],
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: "top",
                                            },
                                        },
                                    }}
                                />
                            </div>

                            {/* Pie Chart for Ratings */}
                            <div style={{ width: "200px", height: "200px", margin: "auto", marginTop: "1rem" }}>
                                <Pie
                                    data={{
                                        labels: ["Instructor Rating", "Course Rating"],
                                        datasets: [
                                            {
                                                label: "Ratings",
                                                data: [data.avgRatingInstructor, data.avgRatingCourse],
                                                backgroundColor: ["#FF6384", "#36A2EB"],
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: "top",
                                            },
                                        },
                                    }}
                                />
                            </div>

                            {/* Additional Stats */}
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <p className="text-gray-700">
                                    <strong>Completed Students:</strong> {data.completedStudents}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Average Completion:</strong> {data.avgCompletion}%
                                </p>
                                <p className="text-gray-700">
                                    <strong>Average Score:</strong> {data.avgScore}%
                                </p>
                                <p className="text-gray-700">
                                    <strong>Average Instructor Rating:</strong> {data.avgRatingInstructor}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Average Course Rating:</strong> {data.avgRatingCourse}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Students Below Average:</strong> {data.numberOfStudentsbelowAvg}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Students at Average:</strong> {data.numberOfStudentsAvg}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Students Above Average:</strong> {data.numberOfStudentsAboveAvg}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
