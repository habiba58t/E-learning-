"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { FaUserCircle, FaBell, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Sidebar from "../student-sidebar/page";

import { useRouter } from "next/navigation"; // Import useRouter

const Navbar = () => {
  const [notifications, setNotifications] = useState<any[]>([]); 
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false); 
  const [notificationCount, setNotificationCount] = useState(0); 
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState("");

  const router = useRouter();
  
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

  useEffect(() => {
    const fetchInitialNotifications = async () => {
      try {
        const response = await axiosInstance.get(
          `http://localhost:3002/notification/usernotifications/${username}`
        );
        setNotifications(response.data || []);
        setNotificationCount(response.data.length); 
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    if (username) {
      fetchInitialNotifications();
    }
  }, [username]);

  const handleNotificationClick = async () => {
    setIsNotificationPanelOpen(true); 
    setNotificationCount(0); 

    // Call the backend API to mark notifications as read
    try {
      await axiosInstance.get(
        `http://localhost:3002/notification/mark-as-read/${username}`
      );
      console.log("Notifications marked as read");
    } catch (error) {
      console.error("Error marking notifications as read", error);
    }
  };

  const handleProfileRedirect = () => {
    router.push(`/profile/${username}`);
  };
  

  return (
    <div className="sticky top-0 bg-blue-800 text-white p-4 shadow-md z-50">
      <Sidebar />
      <div className="container mx-auto flex justify-end items-center space-x-6">
        <motion.div
          className="cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={handleProfileRedirect} // Add onClick for redirection

        >
          <FaUserCircle size={24} className="text-white" />
        </motion.div>

        <motion.div
          className="relative cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={handleNotificationClick}
        >
          <FaBell size={24} className="text-white" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs rounded-full px-2">
              {notificationCount}
            </span>
          )}
        </motion.div>

        <motion.div
          className="cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <FaSignOutAlt size={24} className="text-white" />
        </motion.div>
      </div>

      {isNotificationPanelOpen && (
        <div className="fixed top-0 right-0 w-80 bg-white shadow-lg h-full z-50 p-4">
          <button
            onClick={() => setIsNotificationPanelOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ❌
          </button>
          <h2 className="text-xl font-bold mb-4" style={{ color: "black" }}>
            Notifications
          </h2>
          <div className="space-y-4">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-2 rounded-lg shadow-sm"
                >
                  <h3 className="font-bold text-black">{notification.title}</h3>
                  <p className="text-gray-700">{notification.message}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
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
