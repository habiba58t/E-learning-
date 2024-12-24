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

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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
  );
};

export default UsersPage;