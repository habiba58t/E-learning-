"use client";

import React from "react";

const ProfilePage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Welcome to the Profile Page</h1>
        <p style={styles.text}>
          Select a user to view their profile. Click on a username to get
          started.
        </p>
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
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px 30px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center" as const,
  },
  heading: {
    color: "#007BFF",
    fontSize: "28px",
    marginBottom: "15px",
  },
  text: {
    fontSize: "16px",
    color: "#555",
  },
};

export default ProfilePage;
