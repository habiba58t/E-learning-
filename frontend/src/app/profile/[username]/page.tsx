"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import mongoose from "mongoose"; // For ObjectId typing
import axiosInstance from "@/app/utils/axiosInstance";

interface ProfileData {
  name: string;
  username: string;
  courses: mongoose.Types.ObjectId[];
  rating?: number;
  email: string;
  role: "student" | "instructor" | "admin";
  pictureUrl?: string; // Optional picture URL field
}

const ProfilePage = () => {
  const { username } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedProfile, setUpdatedProfile] = useState<ProfileData | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const backendUrl = "http://localhost:3002"; // Replace with your backend URL

  // Default profile picture URL
  const defaultProfilePicture = "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";

  const fetchCourseTitles = async (courseIds: mongoose.Types.ObjectId[]) => {
    try {
      const coursePromises = courseIds.map(async (courseId) => {
        const response = await axiosInstance.get(`${backendUrl}/courses/id/${courseId}`);
        return response.data.title;
      });
      return await Promise.all(coursePromises);
    } catch (err) {
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
        const userProfile = response.data;

        const loggedInRole = localStorage.getItem("role"); // Assuming role is stored in localStorage
        setIsAdmin(loggedInRole === "admin");

        if (userProfile.courses && userProfile.courses.length > 0) {
          const courseTitles = await fetchCourseTitles(userProfile.courses);
          userProfile.courses = courseTitles;
        }
        setProfile(userProfile);
        setUpdatedProfile(userProfile);
        const loggedInUsername = localStorage.getItem("username");
        setIsOwnProfile(username === loggedInUsername);
        // if(username.role=="admin"){
        //   setISAdmin(userProfile);
        // }
       
      } catch (err: any) {
        setError(err.message || "Error fetching profile.");
      } finally {
        setLoading(false);
      }
      
    };

    fetchProfile();
  }, [username]);

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (updatedProfile) {
      setUpdatedProfile({
        ...updatedProfile,
        [name]: value || "",
      });
    }
  };

  const handleSave = async () => {
    try {
      if (!updatedProfile) return;
  
      const { name, email, pictureUrl } = updatedProfile;
      const updatedData = { name, email, pictureUrl };
  
      const response = await axiosInstance.put(`${backendUrl}/users/update/${updatedProfile.username}`, updatedData);
      setProfile(response.data);
  
      // Reload the page to reflect changes
      window.location.reload();
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedProfile(profile); // Revert to original profile data
  };

  const handleMessage = () => {
    // Open messaging interface or handle messaging logic here
    alert("Message feature not implemented.");
  };

  const handleDeleteStudentAndAdmin = async () => {
    try {
      // Handle account deletion (admin only)
      await axiosInstance.delete(`${backendUrl}/users/delete/${profile?.username}`);
      alert("Account deleted successfully!");
      window.location.reload(); // Redirect after deletion (or wherever needed)
    } catch (err) {
      alert("Failed to delete account.");
    }
  };

  const handleDeleteInstructor = async () => {
    // Ensure the profile exists and the role is 'instructor'
    if (profile?.role === "instructor") {
      try {
        // Call the backend API to delete the instructor
        await axiosInstance.delete(
          `${backendUrl}/instructor/deleteInstructor/${profile?.username}`
        );
        alert("Instructor account deleted successfully!");
        
        // Optionally redirect to another page after successful deletion
        window.location.reload(); // Refreshes the page
      } catch (err) {
        // Handle any errors
        // console.error(err); // Log the error for debugging
        alert("Failed to delete instructor account.");
      }
    } else {
      alert("Unauthorized action: Only instructors can perform this.");
    }
  };
  

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
        <h1 style={styles.heading}>
          Profile of {isEditing ? "Editing..." : profile.name}
        </h1>
        {isEditing ? (
          <> 
            <label style={styles.label}>
              Profile Picture URL:
              <input
                type="text"
                name="pictureUrl"
                value={updatedProfile?.pictureUrl || ""}
                onChange={handleChange}
                style={styles.input}
              />
            </label>
            
            <label style={styles.label}>
              Name:
              <input
                type="text"
                name="name"
                value={updatedProfile?.name || ""}
                onChange={handleChange}
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Email:
              <input
                type="email"
                name="email"
                value={updatedProfile?.email || ""}
                onChange={handleChange}
                style={styles.input}
              />
            </label>
            
            <button onClick={handleSave} style={styles.saveButton}>
              Save
            </button>
            <button onClick={handleCancel} style={styles.cancelButton}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <p style={styles.info}>
              <strong>Name:</strong> {profile.name}
            </p>
            <p style={styles.info}>
              <strong>Email:</strong> {profile.email}
            </p>
            {profile.role === "instructor" && (
              <p style={styles.info}>
                <strong>Courses Given:</strong>{" "}
                {profile.courses?.length
                  ? profile.courses.join(", ")
                  : "No courses available"}
              </p>
            )}
            {profile.role === "student" && (
              <p style={styles.info}>
                <strong>Enrolled Courses:</strong>{" "}
                {profile.courses?.length
                  ? profile.courses.join(", ")
                  : "No courses enrolled"}
              </p>
            )}
            <img 
              src={profile.pictureUrl || defaultProfilePicture} 
              alt="Profile Picture" 
              style={styles.profilePicture} 
            />
            {isOwnProfile&& (
              <button onClick={() => setIsEditing(true)} style={styles.editButton}>
                Edit Profile
              </button>
            )}
            {!isOwnProfile&& (
              <button onClick={handleMessage} style={styles.messageButton}>
                Message
              </button>
            )}
  <>
  {
  (profile.role === "instructor" && isOwnProfile) ||
  (isAdmin && !isOwnProfile && profile.role === "instructor") ? (
    <button onClick={handleDeleteInstructor} style={styles.deleteButton}>
      Delete Instructor Account
    </button>
  ) : (
    (isOwnProfile && profile.role !== "instructor") ||
    (isAdmin && !isOwnProfile && profile.role !== "instructor") ? (
      <button onClick={handleDeleteStudentAndAdmin} style={styles.deleteButton}>
        Delete Account
      </button>
    ) : null
  )
}

  </>

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
    padding: "40px 60px",  // Increased padding for more space inside the card
    boxShadow: "0px 8px 16px rgba(8, 10, 49, 0.1)", // A larger shadow to match the size increase
    maxWidth: "800px", // Increased maxWidth for a much larger card
    width: "100%",
    textAlign: "center" as const,
  },
  profilePicture: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    marginBottom: "100px",
  },
  heading: {
    color: "#007BFF",
    fontSize: "24px",
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "10px",
    fontSize: "14px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
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
  editButton: {
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: "pointer",
    marginTop: "10px",
  },
  saveButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: "pointer",
    marginRight: "10px",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: "pointer",
  },
  messageButton: {
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: "pointer",
    marginTop: "10px",
  },
   deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default ProfilePage;