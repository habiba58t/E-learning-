"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "@/app/utils/axiosInstance";
import mongoose from "mongoose";  // Import mongoose for ObjectId typing

interface ProfileData {
  username: string;
  courses: mongoose.Types.ObjectId[]; // Updated to ObjectId array
  rating?: number;
  email: string;
  role: "student" | "instructor" | "admin";
}

const ProfilePage = () => {
  const { username } = useParams(); // Dynamic parameter from the route
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const backendUrl = "http://localhost:3002"; // Replace with your actual backend URL

  // Fetch course titles based on ObjectIds
  const fetchCourseTitles = async (courseIds: mongoose.Types.ObjectId[]) => {
    try {
      const coursePromises = courseIds.map(async (courseId) => {
        const response = await axiosInstance.get(`${backendUrl}/courses/id/${courseId}`);
        return response.data.title; // Assuming the course has a 'title' field
      });
      return await Promise.all(coursePromises);
    } catch (err: any) {
      setError("Error fetching courses");
      return [];
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!username) {
          throw new Error("Username is required.");
        }

        const response = await axios.get(`${backendUrl}/users/${username}`);
        let userProfile = response.data;

        // Fetch course titles if courses exist
        if (userProfile.courses && userProfile.courses.length > 0) {
          const courseTitles = await fetchCourseTitles(userProfile.courses);
          userProfile.courses = courseTitles; // Replace course IDs with titles
        }

        setProfile(userProfile);
      } catch (err: any) {
        setError(err.message || "Error fetching profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.message}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>Error: {error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.container}>
        <p style={styles.message}>No profile found for {username}.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Profile of {profile.username}</h1>
        <p style={styles.info}>
          <strong>Role:</strong> {profile.role}
        </p>
        <p style={styles.info}>
          <strong>Email:</strong> {profile.email}
        </p>

        {profile.role === "instructor" && (
          <>
            <p style={styles.info}>
              <strong>Courses Given:</strong>{" "}
              {profile.courses?.length
                ? profile.courses.join(", ")
                : "No courses available"}
            </p>
            <p style={styles.info}>
              <strong>Average Rating:</strong>{" "}
              {profile.rating !== undefined ? profile.rating : "No rating available"}
            </p>
          </>
        )}

        {profile.role === "student" && (
          <>
            <p style={styles.info}>
              <strong>Enrolled Courses:</strong>{" "}
              {profile.courses?.length
                ? profile.courses.join(", ")
                : "No courses enrolled"}
            </p>
            <button style={styles.button}>Message</button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f4f8",
    padding: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "20px 30px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center" as const,
  },
  heading: {
    color: "#007BFF",
    fontSize: "24px",
    marginBottom: "15px",
  },
  info: {
    fontSize: "16px",
    color: "#333",
    marginBottom: "10px",
  },
  message: {
    fontSize: "18px",
    color: "#555",
  },
  error: {
    fontSize: "18px",
    color: "red",
  },
  button: {
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.3s",
  },
};

export default ProfilePage;
