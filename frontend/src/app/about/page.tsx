'use client';
import NavBar from '../sections/Navbar/page';

import React from 'react';

export default function About() {
  return (
    <div>
      <NavBar />
      <section className="bg-gradient-to-r from-blue-800 to-teal-400 min-h-screen py-16" id="about">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">About Us</h2>
            <p className="text-lg text-white mb-8">
              Welcome to Academiq! Our mission is to make learning accessible to everyone.
              We are passionate about empowering learners worldwide by offering a platform
              where knowledge knows no boundaries.
            </p>
          </div>
          <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Our Vision</h3>
            <p className="text-blue-700 mb-6">
              At <strong>Academiq</strong>, we believe in a future where knowledge and education are accessible to everyone, 
              regardless of their background or location. Our vision is to create a global learning community that fosters 
              curiosity, innovation, and lifelong learning. We aim to empower individuals by providing them with the tools, 
              resources, and opportunities to grow both personally and professionally. Through our platform, we envision 
              transforming the way people learn, teach, and connect—helping learners unlock their full potential and inspiring 
              them to become the leaders of tomorrow.
            </p>
            <p className="text-blue-700 mb-6">
              Together, we are building a world where education transcends barriers and creates endless possibilities for growth and success.
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Our Values</h3>
            <ul className="list-disc pl-5 text-blue-700">
              <li>Inclusivity and diversity in education.</li>
              <li>Commitment to innovation and excellence.</li>
              <li>Building a global community of learners.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
