"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import mongoose from "mongoose"; // For ObjectId typing
import axiosInstance from "@/app/utils/axiosInstance";
import InstructorSidebar from "@/app/components/instructor/instructor-sidebar/page";

interface ProfileData {
  name: string;
  username: string;
  courses: mongoose.Types.ObjectId[];
  rating?: number;
  email: string;
  role: "student" | "instructor" | "admin";
  pictureUrl?: string; // Optional picture URL field
  rated?: boolean; 
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
  const [isStudent, setStudent] = useState<boolean>(false);
  const [isRating, setIsRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hasRated, setHasRated] = useState<boolean>(false);


  const backendUrl = "http://localhost:3002"; // Replace with your backend URL

  const defaultProfilePicture =
    "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";

  const fetchCourseTitles = async (courseIds: mongoose.Types.ObjectId[]) => {
    try {
      const coursePromises = courseIds.map(async (courseId) => {
        const response = await axiosInstance.get(
          `${backendUrl}/courses/id/${courseId}`
        );
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

        const response = await axiosInstance.get(`${backendUrl}/users/${username}`);
        const userProfile = response.data;

        const loggedInRole = localStorage.getItem("role");
        setIsAdmin(loggedInRole === "admin");
        setStudent(loggedInRole==="student");

        const storedRatingStatus = localStorage.getItem("hasRated");
        setHasRated(storedRatingStatus === "true");

        if (userProfile.courses && userProfile.courses.length > 0) {
          const courseTitles = await fetchCourseTitles(userProfile.courses);
          userProfile.courses = courseTitles;
        }
        setProfile(userProfile);
        setUpdatedProfile(userProfile);

        if (userProfile.rating && userProfile.rating > 0) {
          setHasRated(true);
        }
        const loggedInUsername = localStorage.getItem("username");
        setIsOwnProfile(username === loggedInUsername);
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

      const response = await axiosInstance.put(
        `${backendUrl}/users/update/${updatedProfile.username}`,
        updatedData
      );
      setProfile(response.data);

      window.location.reload();
     
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedProfile(profile);
  };

  const handleMessage = () => {
    router.push(`/student/chat/private-chat`);
   
  };

  const handleDeleteStudentAndAdmin = async () => {
    try {
      await axiosInstance.delete(`${backendUrl}/users/delete/${profile?.username}`);
      alert("Account deleted successfully!");
      window.location.reload();
    } catch (err) {
      alert("Failed to delete account.");
    }
  };

  const handleDeleteInstructor = async () => {
    if (profile?.role === "instructor") {
      try {
        await axiosInstance.delete(
          `${backendUrl}/instructor/deleteInstructor/${profile?.username}`
        );
        alert("Instructor account deleted successfully!");
        window.location.reload();
      } catch (err) {
        alert("Failed to delete instructor account.");
      }
    } else {
      alert("Unauthorized action: Only instructors can perform this.");
    }
  };
  const handleSaveRating = async () => {
    const userResponse = await axiosInstance.get(`${backendUrl}/users/${username}`);
        const user = userResponse.data;
        console.log(user.username);
    if (selectedRating === 0) {
      alert("Please select a rating before saving.");
      return;
    }
  
    try {
      const response = await axiosInstance.put(`${backendUrl}/users/setRating/${user._id}/${selectedRating}`);
      setIsRating(false); // Exit rating mode after saving
      alert("instructor rating saved!");
      setHasRated(true);
      localStorage.setItem("hasRated", "true");
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error saving rating`);
      } else {
        alert('An unknown error occurred while saving the rating.');
      }
    }
  };
  
  const handleCancelRating = () => {
    const confirmation = confirm("Are you sure you want to cancel your rating?");
    if (confirmation) {
      setSelectedRating(0); // Reset the rating
      setIsRating(false); // Exit rating mode
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No profile found for {username}.</p>
      </div>
    );
  }

  return (
    <section className="relative pt-40 pb-24">
      
      <img
        src="https://pagedone.io/asset/uploads/1705473908.png"
        alt="cover-image"
        className="w-full absolute top-0 left-0 z-0 h-60 object-cover"
      />
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="flex items-center justify-center sm:justify-start mb-5">
          <img
            src={profile.pictureUrl || defaultProfilePicture}
            alt="user-avatar-image"
            className="border-4 border-solid border-white rounded-full object-cover w-32 h-32"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-black">{profile.name}</h1>
            <p className="text-2xl font-bold text-black">{profile.email}</p>
            {profile.role === "instructor" && (
              <p className="text-2xl font-bold text-black">
                <strong>Courses Given:</strong>{" "}
                {profile.courses.length ? profile.courses.join(", ") : "No courses"}
              </p>
            )}
            {profile.role === "student" && (
              <p className="text-2xl font-bold text-black">
                <strong>Enrolled Courses:</strong>{" "}
                {profile.courses.length ? profile.courses.join(", ") : "No courses"}
              </p>
            )}
          </div>

          <div className="mt-5 sm:mt-0">
            {isOwnProfile && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded mb-2"
              >
                Edit Profile
              </button>
            )}
            {!isOwnProfile && (
              <button
                onClick={handleMessage}
                className="bg-blue-500 text-white py-2 px-4 rounded mb-2"
              >
                Message
              </button>
            )}
          {!isOwnProfile && isStudent && profile.role === "instructor" && !hasRated && (
  <button
    onClick={() => setIsRating(true)} // Open the rating interface
    className="bg-blue-500 text-white py-2 px-4 rounded mb-2"
  >
    Rate Instructor
  </button>
)}

            {(profile.role === "instructor" && isOwnProfile) ||
            (isAdmin && !isOwnProfile && profile.role === "instructor") ? (
              <button
                onClick={handleDeleteInstructor}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Delete Account
              </button>
            ) : (
              (isOwnProfile && profile.role !== "instructor") ||
              (isAdmin && !isOwnProfile && profile.role !== "instructor") ? (
                <button
                  onClick={handleDeleteStudentAndAdmin}
                  className="bg-red-500 text-white py-2 px-4 rounded"
                >
                  Delete Account
                </button>
              ) : null
            )}
          </div>
        </div>

        {isEditing && (
          <div className="space-y-4">
            <label className="block">
              Profile Picture URL:
              <input
                type="text"
                name="pictureUrl"
                value={updatedProfile?.pictureUrl || ""}
                onChange={handleChange}
                className="border px-4 py-2 rounded w-full"
              />
            </label>

            <label className="block">
              Name:
              <input
                type="text"
                name="name"
                value={updatedProfile?.name || ""}
                onChange={handleChange}
                className="border px-4 py-2 rounded w-full"
              />
            </label>

            <label className="block">
              Email:
              <input
                type="email"
                name="email"
                value={updatedProfile?.email || ""}
                onChange={handleChange}
                className="border px-4 py-2 rounded w-full"
              />
            </label>

            <button
              onClick={handleSave}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        )}
  {isRating && !hasRated && (
  <div className="space-y-4">
    <label className="block">
      Rate Instructor:
      <div className="flex justify-center space-x-2 my-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setSelectedRating(star)}
            className={`text-3xl ${
              star <= selectedRating ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </label>

    <button
      onClick={handleSaveRating}
      className="bg-green-500 text-white py-2 px-4 rounded"
    >
      Save Rating
    </button>
    <button
      onClick={handleCancelRating}
      className="bg-gray-500 text-white py-2 px-4 rounded"
    >
      Cancel
    </button>
  </div>
)}

      </div>
    </section>
  );
};

export default ProfilePage;

