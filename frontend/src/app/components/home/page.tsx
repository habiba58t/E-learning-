// pages/home.tsx
'use client';

import Navbar from "../NavBar/page";
import Sidebar from "../student-sidebar/page";


const Home = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <Sidebar />
      <div style={{ padding: '20px', flex: 1 }}>
        <h1>Welcome to the Home Page!</h1>
        <p>This is where your main content goes.</p>
      </div>
    </div>
  );
};

export default Home;
