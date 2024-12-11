// pages/home.tsx
'use client'
import Sidebar from "@/app/components/student-sidebar/page";

const Home = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ padding: '20px', flex: 1 }}>
        <h1>Welcome to the Home Page!</h1>
        <p>This is where your main content goes.</p>
      </div>
    </div>
  );
};

export default Home;
