
'use client'

import Navbar from "@/app/components/Navbar_s/page"
import Hero from "./hero"
import StudentPage from "./student"
import InstructorPage from "./instructor"
import CoursePage from "./coursePage"
import Footer from "@/app/sections/footer/page"




export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <Hero />
      <CoursePage/>
      <StudentPage/>
      <InstructorPage/>
        <Footer/>
    </main>
  )
}