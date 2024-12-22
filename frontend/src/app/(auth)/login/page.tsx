'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { handleLogin } from "./login.server";

const LoginPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loginResult = await handleLogin(username, password);

      if (loginResult.success) {
        const { user } = loginResult;

        localStorage.setItem("username", user.username);
        localStorage.setItem("role", user.role.toString());

        if (user.role === "admin") {
          router.push("/admin/homeA");
        } else if (user.role === "instructor") {
          router.push("/instructor/home");
        } else {
          router.push("/student/home");
        }
      }
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-8 text-center text-gray-800">Welcome Back</h1>
            <p className="text-gray-700 text-center mb-8">Log in to access your account.</p>
            <form className="space-y-6" onSubmit={onLogin}>
              {/* Username Field */}
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                  placeholder="Enter Username"
                  required
                />
                <label
                  htmlFor="username"
                  className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                >
                  Username
                </label>
              </div>
              {/* Password Field */}
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                  placeholder="Enter Password"
                  required
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                >
                  Password
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-600 transition duration-300"
              >
                Login
              </button>
            </form>
            <p className="mt-6 text-center text-gray-700">
              Don't have an account?{" "}
              <Link href="/register" className="text-yellow-500 font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
