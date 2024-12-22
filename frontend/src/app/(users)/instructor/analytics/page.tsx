'use client';

import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { jsPDF } from "jspdf"; // Import jsPDF

import axiosInstance from "@/app/utils/axiosInstance";

import { Course } from "../courses/[courseCode]/viewCourse/page";
import Navbar from "@/app/components/NavBar/page";

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

            // Fetch analytics data for all courses in parallel using Promise.all
            const coursesWithAnalytics = await Promise.all(coursesData.map(async (course) => {
                try {
                    const [
                        enrolledStudentsResponse,
                        completedStudentsResponse,
                        avgCompletionResponse,
                        avgScoreResponse,
                        ratingResponse,
                        studentsBelowAvgResponse,
                        studentsAvgResponse,
                        studentsAboveAvgResponse,
                    ] = await Promise.all([
                        axiosInstance.get(`${backend_url}/progress/enrolled/${course.course_code}`),
                        axiosInstance.get(`${backend_url}/progress/completedNumber/${course.course_code}`),
                        axiosInstance.get(`${backend_url}/progress/completedNumber/${course.course_code}`),
                        axiosInstance.get(`${backend_url}/courses/${course.course_code}/average-score`),
                        axiosInstance.get(`${backend_url}/courses/getavg/${course._id}`),
                        axiosInstance.get(`${backend_url}/student/levelEasy/${course._id}`),
                        axiosInstance.get(`${backend_url}/student/mediumLevel/${course._id}`),
                        axiosInstance.get(`${backend_url}/student/hardLevel/${course._id}`),
                    ]);

                    // Combine course data with the additional fetched analytics data
                    return {
                        _id: course._id,
                        course_code: course.course_code,
                        enrolledStudents: enrolledStudentsResponse.data,
                        completedStudents: completedStudentsResponse.data,
                        avgCompletion: avgCompletionResponse.data,
                        avgScore: avgScoreResponse.data.avgScore,
                        avgRatingCourse: ratingResponse.data, // Course rating instead of instructor rating
                        numberOfStudentsbelowAvg: studentsBelowAvgResponse.data,
                        numberOfStudentsAvg: studentsAvgResponse.data,
                        numberOfStudentsAboveAvg: studentsAboveAvgResponse.data,
                    };
                } catch (error) {
                    console.error(`Error fetching data for course ${course.course_code}:`, error);
                    return null; // Return null or handle error case
                }
            }));

            // Filter out any null values (in case of errors in some course data)
            const validCoursesWithAnalytics = coursesWithAnalytics.filter(course => course !== null);

            console.log("Courses With Analytics:", validCoursesWithAnalytics);
            setAnalytics(validCoursesWithAnalytics); // Set the final analytics data
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

    const downloadDataAsPDF = (data: AnalyticsData) => {
        const doc = new jsPDF();

        // Add title to the PDF
        doc.setFontSize(18);
        doc.text(`Course Analytics for ${data.course_code}`, 20, 20);

        // Add course details to the PDF
        doc.setFontSize(12);
        doc.text(`Course Code: ${data.course_code}`, 20, 30);
        doc.text(`Enrolled Students: ${data.enrolledStudents}`, 20, 40);
        doc.text(`Completed Students: ${data.completedStudents}`, 20, 50);
        doc.text(`Average Completion: ${data.avgCompletion}%`, 20, 60);
        doc.text(`Average Score: ${data.avgScore}%`, 20, 70);
        doc.text(`Average Course Rating: ${data.avgRatingCourse}`, 20, 80);
        doc.text(`Students Below Average: ${data.numberOfStudentsbelowAvg}`, 20, 90);
        doc.text(`Students at Average: ${data.numberOfStudentsAvg}`, 20, 100);
        doc.text(`Students Above Average: ${data.numberOfStudentsAboveAvg}`, 20, 110);

        // Add charts (optional) - You can render charts to images and add them to the PDF
        // doc.addImage(chartImage, 'JPEG', 20, 120, 180, 160);

        // Download the PDF
        doc.save(`${data.course_code}_analytics.pdf`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex">
            {/* Sidebar */}
            <Navbar />

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
                                        labels: ["Course Rating"],
                                        datasets: [
                                            {
                                                label: "Ratings",
                                                data: [data.avgRatingCourse],
                                                backgroundColor: ["#36A2EB"],
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

                            {/* Download Button */}
                            <button
                                onClick={() => downloadDataAsPDF(data)}
                                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            >
                                Download Analytics as PDF
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics;