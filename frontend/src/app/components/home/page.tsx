'use client';

import Navbar from "../NavBar/page";
import Sidebar from "../student-sidebar/page";

const Home = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Navbar is optional, uncomment if you want to use it */}
      {/* <Navbar /> */}

      <div
        style={{
          position: 'fixed',  // Keeps the sidebar fixed in place
          top: 0,             // Align to the top of the viewport
          left: 0,            // Align to the left of the viewport
          bottom: 0,          // Ensure it stretches till the bottom
          width: '250px',     // Sidebar width (adjust as needed)
          backgroundColor: '#003366', // Dark blue sidebar background
          paddingTop: '10px',  // Some padding for spacing
          zIndex: 60,         // Ensure the sidebar is above other content
        }}
      >
        <Sidebar />
      </div>

      <div style={{ marginLeft: '250px', padding: '20px', flex: 1 }}>
        {/* Main Content Area */}
        <h1>Welcome to the Home Page!</h1>
        <p>This is where your main content goes.</p>
      </div>
    </div>
  );
};

export default Home;
