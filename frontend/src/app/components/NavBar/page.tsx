'use client';

import React, { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { FaUserCircle, FaBell, FaSignOutAlt } from 'react-icons/fa'; // Icons for profile, notifications, and logout
import { motion } from 'framer-motion';
import InstructorSidebar from '../instructor/instructor-sidebar/page';
import { useRouter } from "next/navigation"; // Import useRouter

const Navbar = () => {
  const [notifications, setNotifications] = useState<any[]>([]); // State for storing notifications
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false); // State to control the sliding panel visibility
  const [notificationCount, setNotificationCount] = useState(0); // State to store the notification count
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState("");


  const router = useRouter();

  // useEffect(() => {
  //   // Fetch user data on component mount
  //   fetchCookieData();
  // }, []);
  useEffect(() => {
  const fetchCookieData = async () => {
    try {
      const response = await fetch("http://localhost:3002/auth/get-cookie-data", {
        credentials: "include",
      });
      const { userData } = await response.json();

      if (!userData?.payload?.username) {
        console.error("No cookie data found");
        setError("No cookie data found");
        return;
      }

      const user = userData.payload.username;
      setUsername(user);
      console.log("User logged in:", user);
    } catch (err) {
      console.error("Error fetching cookie data:", err);
      setError("Error fetching cookie data");
    }
  };
  fetchCookieData();
  }, []);

  // const fetchNotifications = async () => {
  //   if (!username) return;
  //   try {
  //     const response = await axiosInstance.get(`http://localhost:3002/notification/usernotifications/${username}`); 
  //     setNotifications(response.data || []); 
  //     setNotificationCount(response.data.length); // Set notification count
  //   //  setIsNotificationPanelOpen(true); // Open the notification panel when notifications are fetched
  //     console.log("Notifications fetched", response.data);
  //   } catch (error) {
  //     console.error("Error fetching notifications", error);
  //   }
  //   setIsNotificationPanelOpen(true); // Open the notification panel when notifications are fetched
  // };

  useEffect(() => {
    const fetchInitialNotifications = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:3002/notification/usernotifications/${username}`);
        setNotifications(response.data || []); 
        setNotificationCount(response.data.length); // Set notification count after fetching
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    if (username) {
      fetchInitialNotifications(); // Only fetch notifications if the username is available
    }
  }, [username]); 

  // useEffect(() => {
  //   // Fetch user data on component mount
  //   fetchNotifications();
  // }, []);


  const handleNotificationClick = () => {
    setIsNotificationPanelOpen(true); // Open the notification panel
    setNotificationCount(0); // Hide the notification count when the panel is opened
  };
  
  const handleProfileRedirect = () => {
    router.push(`/profile/${username}`);
  };
  

  return (
    <div className="sticky top-0 bg-teal-600 text-white p-4 shadow-md z-50">
      <InstructorSidebar />
      <div className="container mx-auto flex justify-end items-center space-x-6">
        {/* Profile Icon with framer-motion */}
        <motion.div
          className="cursor-pointer"
          whileHover={{ scale: 1.1 }} // Slightly enlarge on hover
          whileTap={{ scale: 0.9 }} // Shrink slightly on click
          transition={{ duration: 0.2 }} // Quick, smooth transition
          onClick={handleProfileRedirect} // Add onClick for redirection
       >
          <FaUserCircle size={24} />
        </motion.div>

        {/* Notification Icon with framer-motion */}
        <motion.div
          className="relative cursor-pointer"
          whileHover={{ scale: 1.1 }} // Slightly enlarge on hover
          whileTap={{ scale: 0.9 }} // Shrink slightly on click
          transition={{ duration: 0.2 }} // Quick, smooth transition
          onClick={handleNotificationClick} // Fetch notifications on click
        >
          <FaBell size={24} />
          {/* Notification Count Badge */}
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
              {notificationCount}
            </span>
          )}
        </motion.div>

        {/* Logout Icon with framer-motion */}
        <motion.div
          className="cursor-pointer"
          whileHover={{ scale: 1.1 }} // Slightly enlarge on hover
          whileTap={{ scale: 0.9 }} // Shrink slightly on click
          transition={{ duration: 0.2 }} // Quick, smooth transition
        >
          <FaSignOutAlt size={24} />
        </motion.div>
      </div>

      {/* Notification Sliding Panel */}
      {isNotificationPanelOpen && (
        <div className="fixed top-0 right-0 w-80 bg-white shadow-lg h-full z-50 p-4">
          <button
            onClick={() => setIsNotificationPanelOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ❌
          </button>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'black' }}>Notifications</h2>
          <div className="space-y-4">
          {notifications && notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div key={index} className="bg-gray-100 p-2 rounded-lg shadow-sm">
            <h3 className="font-bold text-black">{notification.title}</h3>
            <p className="text-gray-700">{notification.message}</p>
            <p className="text-sm text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No new notifications</p>
      )}
    </div>
  </div>
      )}
    </div>
  );
};

export default Navbar;
