'use client';

import { useState, useEffect } from 'react';
import axiosInstance from "@/app/utils/axiosInstance";
import { useRouter } from "next/navigation"; // Use the App Router's navigation hook
import Link from 'next/link';

const backend_url = "http://localhost:3002";

export default function RegisterPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const router = useRouter();

    // Prevent hydration errors by rendering only after the component is mounted
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null; // Render nothing (or a loading spinner) until mounted
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`${backend_url}/auth/register`, {
                name,
                email,
                username,
                password,
                role
            });
            const { status } = response;
            if (status === 201) {
                setTimeout(() => {
                    router.push('/login');
                }, 1000);
            }
        } catch (err) {
            alert('Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <h1 className="text-2xl font-semibold mb-8 text-center text-gray-800">Register</h1>
                        <div className="divide-y divide-gray-200">
                        <form onSubmit={handleRegister}>
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                {/* Name */}
                                <div className="relative">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                                        placeholder="Enter Name"
                                        required
                                    />
                                    <label
                                        htmlFor="name"
                                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                                    >
                                        Name
                                    </label>
                                </div>
                                {/* Email */}
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                                        placeholder="Enter Email"
                                        required
                                    />
                                    <label
                                        htmlFor="email"
                                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                                    >
                                        Email Address
                                    </label>
                                </div>
                                {/* Username */}
                                <div className="relative">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUserName(e.target.value)}
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
                                {/* Password */}
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
                                {/* Role */}
                                <div className="relative">
                                    <select
                                        id="role"
                                        name="role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                                        required
                                    >
                                        <option value="" disabled>Select a Role</option>
                                        <option value="student">Student</option>
                                        <option value="instructor">Instructor</option>
                                   {/* //     <option value="admin">Admin</option> */}
                                    </select>
                                    <label
                                        htmlFor="role"
                                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                                    >
                                        Role
                                    </label>
                                </div>

                                <div className="relative mt-8">
                                    <button
                                        type="submit"
                                        className="w-full py-2 px-4 text-white bg-blue-500 rounded-md focus:outline-none hover:bg-blue-600"
                                    >
                                        Register
                                    </button>

                                    <p className="mt-4 text-center text-gray-600">
                                                                    Have an account?{' '}
                                                                    <Link
                                                                        href="/login"
                                                                        className="text-orange-500 hover:text-blue-600 font-semibold"
                                                                    >
                                                                        Login
                                                                    </Link>
                                                                </p>



                                </div>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
