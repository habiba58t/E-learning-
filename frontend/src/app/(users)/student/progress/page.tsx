'use client';
import Sidebar from "@/app/components/student-sidebar/page";
import { useRouter } from 'next/navigation';
import axiosInstance from "@/app/utils/axiosInstance";
import { useState, useEffect } from 'react';
import Navbar from "@/app/components/Navbar_s/page";

export interface Progress {
    _id: string;
    Username: string;
    course_code: string;
    completion_percentage: number;
    last_accessed: Date;
    avgScore: number;
    level: string;
}

const backend_url = "http://localhost:3002";

export default function ProgressPage() {
    const [progress, setProgress] = useState<Progress[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [username, setUsername] = useState<string>('');

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
            setUsername(username)
            const courses = await axiosInstance.get(`http://localhost:3002/courses/${username}/courses`)
            const progresses = courses.data;

            console.log("Initial progress data:", progresses);

    


            // Collect progress data with additional information
            const progressWithAdditionalData: Progress[] = [];

            for (const course of progresses) {
                try {
                    const courseId = course._id

                    // Fetch avgScore and level for each course
                    const avgScoreResponse = await axiosInstance.get<number>(
                       // `${backend_url}/student/${username}/level/${course._id}`
                        `http://localhost:3002/student/${username}/score/${courseId}`
                    );
                    const levelResponse = await axiosInstance.get<string>(
                         `http://localhost:3002/student/${username}/level/${courseId}`
                        
                    );

                    const completionPercentage = await axiosInstance.get(`http://localhost:3002/progress/completionPercentage/${username}`)
                    

                    console.log("completetion Percentage", completionPercentage.data);
                    console.log("Average Score Response:", avgScoreResponse.data);
                    console.log("Level Response:", levelResponse.data);
                    console.log("completion Response:", completionPercentage.data);


                    // Check for null or undefined values
                    const avgScore = avgScoreResponse.data ?? "No score available";
                    const level = levelResponse.data ?? "No level available";
                    const completion_percentage = completionPercentage.data ?? "No percentage available";


                    console.log("Fetched score:", avgScore);
                    console.log("Fetched level:", level);
                    console.log("Fetched percentage:", completion_percentage);


                    progressWithAdditionalData.push({
                        ...course,
                        avgScore,  // Set avgScore from response
                        level,     // Set level from response
                        completion_percentage
                    });
                } catch (err) {
                    console.error(`Error fetching additional data for course:`, err);
                }
            }

            // Set the progress data after all async operations are complete
            setProgress(progressWithAdditionalData);
            console.log("Progress with additional data:", progressWithAdditionalData);
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
        <div>
            {/* Navbar at the top of the page */}
            <div className="sticky top-0 w-full z-50">
                <Navbar />
            </div>

            {/* Main Content */}
            <div className="text-black flex-1 p-6">
                <h1 className=" text-2xl font-bold mb-6">Courses Progress</h1>

                {progress.length === 0 ? (
                    <p>No progress data available.</p>
                ) : (
                    <div className="space-y-4">
                        {progress.map((course) => (
                            <div
                                key={course._id}
                                className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            {course.course_code}
                                        </h2>
                                        {/* <p className="text-gray-600">
                                            Last Accessed: {new Date(course.last_accessed).toLocaleDateString()}
                                        </p> */}
                                        <p className="text-gray-800">Average Score: {course.avgScore}</p>
                                        <p>Level: {course.level}</p>
                                    </div>
                                    <div className="text-gray-700 font-bold ">
                                        {course.completion_percentage}
                                    </div>
                                </div>

                                <div className="relative w-full h-4 bg-gray-300 rounded-full mt-4">
                                    {/* <div
                                        className="absolute h-4 bg-blue-500 rounded-full "
                                        style={{
                                            width: `${course.completion_percentage}%`,
                                        }}
                                    ></div> */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}