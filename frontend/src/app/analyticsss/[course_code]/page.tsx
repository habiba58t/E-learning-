"use client";

import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { useState, useEffect } from "react";

import axiosInstance from "@/app/utils/axiosInstance";
import { jsPDF } from "jspdf"; // Import jsPDF
import InstructorSidebar from "@/app/components/instructor/instructor-sidebar/page";

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

interface AnalyticsProps {
    params: {
        course_code: string;
    };
}

const Analytics = ({ params }: AnalyticsProps) => {
    const { course_code } = params; // Access dynamic route parameter
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    async function fetchAnalyticsData() {
        try {
            if (!course_code) {
                throw new Error("No course code found in the URL.");
            }

            const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
                credentials: "include",
            });
            const { userData } = await cookieResponse.json();

            if (!userData || !userData.payload?.username) {
                throw new Error("No valid user data found in cookies.");
            }

            const username = userData.payload.username;

            // Fetch course analytics data for the selected course
            const apiGetAnalytics = `${backend_url}/courses/analyticsss/${course_code}`;
            const analyticsResponse = await axiosInstance.get(apiGetAnalytics);
            const analyticsData = analyticsResponse.data;

            setAnalytics(analyticsData); // Set the analytics data for the specific course
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load analytics data. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAnalyticsData();
    }, [course_code]); // Fetch data whenever course_code changes

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

        // Download the PDF
        doc.save(`${data.course_code}_analytics.pdf`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!analytics) {
        return <div>No analytics data available for this course.</div>;
    }

    return (
        <div className="flex">
            {/* Sidebar */}
            <InstructorSidebar />

            {/* Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-6">Course Analytics</h1>

                <div className="space-y-6">
                    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Course Code: {analytics.course_code}
                        </h2>

                        {/* Additional content remains unchanged */}

                        {/* Download Button */}
                        <button
                            onClick={() => downloadDataAsPDF(analytics)}
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Download Analytics as PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
