"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";

import axiosInstance from "@/app/utils/axiosInstance";
import { jsPDF } from "jspdf";

import { useParams } from "next/navigation";
import InstructorSidebar from "@/app/components/instructor/instructor-sidebar/page";
import Navbar from "@/app/components/NavBar/page";


ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const backend_url = "http://localhost:3002";

interface Module {
  _id: string;
  title: string;
  averageRating: number;
}

interface AnalyticsData {
  _id: string;
  course_code: string;
  enrolledStudents: number;
  completedStudents: number;
  avgCompletion: number;
  avgScore: number;
  avgRatingCourse: number;
  InstructorRating: number;
  modules: Module[];
  numberOfStudentsbelowAvg: number;
  numberOfStudentsAvg: number;
  numberOfStudentsAboveAvg: number;
}

const Analytics = () => {
  const { course_code } = useParams();
  
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchAnalyticsData() {
      try {
        if (!course_code) {
          throw new Error("No course code found in the URL.");
        }

        const courseResponse = await axiosInstance.get(`${backend_url}/courses/${course_code}`);
        const course = courseResponse.data;

        const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
          credentials: "include",
        });
        const { userData } = await cookieResponse.json();

        if (!userData || !userData.payload?.username) {
          throw new Error("No valid user data found in cookies.");
        }

        const username = userData.payload.username;

        const userResponse = await axiosInstance.get(`${backend_url}/users/${username}`);
        const user = userResponse.data;

        const [
          enrolledStudentsResponse,
          completedStudentsResponse,
          avgCompletionResponse,
          avgScoreResponse,
          ratingResponse,
          InstructorRatingResponse,
          modulesResponse,
          studentsBelowAvgResponse,
          studentsAvgResponse,
          studentsAboveAvgResponse,
        ] = await Promise.all([
          axiosInstance.get(`${backend_url}/progress/enrolled/${course_code}`),
          axiosInstance.get(`${backend_url}/progress/completedNumber/${course_code}`),
          axiosInstance.get(`${backend_url}/progress/avgCompletion/${course_code}`),
          axiosInstance.get(`${backend_url}/courses/${course_code}/average-score`),
          axiosInstance.get(`${backend_url}/courses/getavg/${course._id}`),
          axiosInstance.get(`${backend_url}/users/InstructorRating/${user._id}`),
        //  axiosInstance.get(`${backend_url}/users/InstructorRating/${user._id}`),
          axiosInstance.get(`${backend_url}/courses/${course_code}/modulesinstructor`), // Fetch modules for the course
          axiosInstance.get(`${backend_url}/student/levelEasy/${course._id}`),
          axiosInstance.get(`${backend_url}/student/mediumLevel/${course._id}`),
          axiosInstance.get(`${backend_url}/student/hardLevel/${course._id}`),
        ]);

        setAnalytics({
          _id: course._id,
          course_code: course.course_code,
          enrolledStudents: enrolledStudentsResponse.data,
          completedStudents: completedStudentsResponse.data,
          avgCompletion: avgCompletionResponse.data,
          avgScore: avgScoreResponse.data,
          avgRatingCourse: ratingResponse.data,
          InstructorRating: InstructorRatingResponse.data,
          modules: modulesResponse.data.map((module: any) => ({
            _id: module._id,
            title: module.title,
            averageRating: module.averageRating,
          })),
          numberOfStudentsbelowAvg: studentsBelowAvgResponse.data,
          numberOfStudentsAvg: studentsAvgResponse.data,
          numberOfStudentsAboveAvg: studentsAboveAvgResponse.data,
        });
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to load analytics data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyticsData();
  }, [course_code]);

  const downloadDataAsPDF = (data: AnalyticsData) => {
    const doc = new jsPDF();
    let yPosition = 20; // Start at y=20 for the first item
    doc.setFontSize(18);
    doc.text(`Course Analytics for ${data.course_code}`, 20, yPosition);
    yPosition += 10;
  
    doc.setFontSize(12);
    doc.text(`Course Code: ${data.course_code}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Enrolled Students: ${data.enrolledStudents}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Completed Students: ${data.completedStudents}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Average Completion: ${data.avgCompletion}%`, 20, yPosition);
    yPosition += 10;
    doc.text(`Average Score: ${data.avgScore}%`, 20, yPosition);
    yPosition += 10;
    doc.text(`Average Course Rating: ${data.avgRatingCourse}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Instructor Rating: ${data.InstructorRating}`, 20, yPosition);
    yPosition += 10;
    // Add modules and dynamically adjust the position
    data.modules.forEach((module, index) => {
      doc.text(`Module: ${module.title}, Average Rating: ${module.averageRating}`, 20, yPosition);
      yPosition += 10; // Increment y-position for the next module
    });
  
    // Adjust the position to avoid overlap with modules
    doc.text(`Students Below Average: ${data.numberOfStudentsbelowAvg}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Students at Average: ${data.numberOfStudentsAvg}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Students Above Average: ${data.numberOfStudentsAboveAvg}`, 20, yPosition);
  
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

  const barChartData = {
    labels: ["Below Avg", "Avg", "Above Avg"],
    datasets: [
      {
        label: "Number of Students",
        data: [
          analytics.numberOfStudentsbelowAvg,
          analytics.numberOfStudentsAvg,
          analytics.numberOfStudentsAboveAvg,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-0 z-10 bg-white shadow-md">
                <Navbar />
            </div>
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Course Analytics</h1>
        <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Course Code: {analytics.course_code}
          </h2>
          <div className="text-center mb-6">
            <p className="text-gray-700">Enrolled Students: {analytics.enrolledStudents}</p>
            <p className="text-gray-700">Completed Students: {analytics.completedStudents}</p>
            <p className="text-gray-700">Average Completion: {analytics.avgCompletion}%</p>
            <p className="text-gray-700">Average Course Rating: {analytics.avgRatingCourse}</p>
            <p className="text-gray-700">Average Instructor Rating: {analytics.InstructorRating}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Student Performance</h3>
            <div className="mx-auto" style={{ maxWidth: "300px", maxHeight: "200px" }}>
              <Bar data={barChartData} options={{ maintainAspectRatio: false }} width={250} height={150} />
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2">Modules</h3>
          <ul>
          {analytics.modules.map((module) => (
  <li key={module._id}>
    <p style={{ color: "#333" }}>{module.title}: {module.averageRating}</p> {/* Darker text color */}
  </li>
))}
          </ul>

          <button
            onClick={() => downloadDataAsPDF(analytics)}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Download Analytics as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
