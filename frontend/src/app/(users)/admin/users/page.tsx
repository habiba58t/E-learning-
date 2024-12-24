"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string; // Added role field
}
type UserData = {
  payload: {
    username: string;
    role: 'student' | 'instructor' | 'admin';
  };
};
const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
   const [userData, setUserData] = useState<UserData | null>(null);
  

  useEffect(() => {
    const fetchCookieData = async () => {
      try {
        const response = await fetch("http://localhost:3002/auth/get-cookie-data", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cookie data");
        }

        const { userData } = await response.json();
        setUserData(userData);
        if (!userData?.payload?.username) {
          console.error("No cookie data found");
          setError("No cookie data found");
          return;
        }

        setLoggedInUsername(userData.payload.username);
        console.log("User logged in:", userData.payload.username);
      } catch (err) {
        console.error("Error fetching cookie data:", err);
        setError("Error fetching cookie data");
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3002/users/getAll", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Error fetching users");
      }
    };

    fetchCookieData();
    fetchUsers();
  }, []);

  const handleUsernameClick = (username: string) => {
    router.push(`/profile/${username}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="fixed w-full z-30 flex bg-white p-2 items-center justify-between h-16 px-10 shadow-md top-0 left-0">
        <div className="flex items-center space-x-6">
        <a href="/admin/users" className="text-sm md:text-md font-medium text-gray-700 hover:text-gray-900">
            Users
          </a>
          <a href="/admin/homeA" className="text-sm md:text-md font-medium text-gray-700 hover:text-gray-900">
            Dashboard
          </a>
          <a href="/admin/courses" className="text-sm md:text-md font-medium text-gray-700 hover:text-gray-900">
            Courses
          </a>
        </div>

        <div className="flex-none h-full text-center flex items-center justify-center">
          <div className="flex space-x-3 items-center px-3">
            <div className="flex-none flex justify-center">
              <div className="w-8 h-8 flex">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShta_GXR2xdnsxSzj_GTcJHcNykjVKrCBrZ9qouUl0usuJWG2Rpr_PbTDu3sA9auNUH64&usqp=CAU"
                  alt="profile"
                  className="shadow rounded-full object-cover"
                />
              </div>
            </div>
            <div className="hidden md:block text-sm md:text-md text-black">
              {userData?.payload.username}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10">
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Users Page</h1>

        {error && <div className="text-red-500">{error}</div>}

        {loggedInUsername && (
          <div className="text-gray-700 mb-6">
            Logged in as: <span className="font-bold">{loggedInUsername}</span>
          </div>
        )}

        <h2 className="text-xl font-semibold text-gray-700 mb-4">All Users:</h2>

        {users.length > 0 ? (
          <ul className="bg-white shadow rounded-md p-4">
            {users.map((user) => (
              <li
                key={user._id}
                className="py-2 border-b last:border-b-0 text-gray-600 flex justify-between items-center"
              >
                <span>{user.name}</span>
                <div>
                  <span 
                    className="text-blue-600 cursor-pointer hover:underline mr-4"
                    onClick={() => handleUsernameClick(user.username)}
                  >
                    {user.username}
                  </span>
                  <span className="text-gray-500">{user.role}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default UsersPage;