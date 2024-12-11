import axiosInstance from "@/app/utils/axiosInstance";
import {jwtDecode} from "jwt-decode"; // Import the library

const backend_url = "http://localhost:3002";

export enum UserRole {
  Student = "student",
  Instructor = "instructor",
  Admin = "admin",
}

interface LoginResponse {
  access_token: string;
  user: {
    username: string;
    role: UserRole;
  };
}

interface DecodedToken {
  username: string;
  role: UserRole;
  exp: number;
}

export const handleLogin = async (username: string, password: string) => {
  try {
    console.log("Attempting login with:", { username, password });

    const response = await axiosInstance.post<LoginResponse>(`${backend_url}/auth/login`, {
      username,
      password,
    });

    if (response.status === 200 || response.status === 201) {
      const { access_token } = response.data;

      if (access_token) {
        // Use jwtDecode from the library
        const decodedToken: DecodedToken = jwtDecode<DecodedToken>(access_token);

        console.log("Decoded token:", decodedToken);

        if (decodedToken.username && decodedToken.role !== undefined) {
          return {
            success: true,
            token: access_token,
            user: decodedToken,
          };
        } else {
          throw new Error("Invalid token structure");
        }
      } else {
        throw new Error("No access token received");
      }
    } else {
      throw new Error("Login failed. Invalid response.");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};


