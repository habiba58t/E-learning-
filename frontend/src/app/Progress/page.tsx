'use client';
import Sidebar from "@/app/components/student-sidebar/page";
import { useRouter } from 'next/navigation';
import axiosInstance from "@/app/utils/axiosInstance";
import { useState, useEffect } from 'react';

export interface Progress {
    _id: string;
    Username: string;
    course_code: string;
    completion_percentage: number;
    last_accessed: Date;
}

const backend_url = "http://localhost:3002";

export default function ProgressPage() {
    const [progress, setProgress] = useState<Progress[]>([]);
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
            const apiUrl = `${backend_url}/progress/user/${username}`;
            console.log("Fetching progress from:", apiUrl);

            const response = await axiosInstance.get<Progress[]>(apiUrl);
            
            // Log the response data
            console.log("Progress data:", response.data);

            const progresses = response.data;

            setProgress(progresses);
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

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-6">Courses Progress</h1>

                {progress.length === 0 ? (
                    <p>No progress data available.</p>
                ) : (
                    <div className="space-y-4">
                        {progress.map((course, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            {course.course_code}
                                        </h2>
                                        <p className="text-gray-600">
                                            Last Accessed: {new Date(course.last_accessed).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-gray-700 font-bold">
                                        {course.completion_percentage}%
                                    </div>
                                </div>

                                <div className="relative w-full h-4 bg-gray-300 rounded-full mt-4">
                                    <div
                                        className="absolute h-4 bg-blue-500 rounded-full"
                                        style={{
                                            width: `${course.completion_percentage}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
