
'use client'
import Hero from '../sections/Hero/page'
import Navbar from '../sections/Navbar/page'
import Courses from '../sections/BrowseTopics/page'
import Footer from '../sections/footer/page'
import Category from '../sections/FeaturedSection/page'
import TimeLineSection from '../sections/TimeLine/page';


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <Hero />
       <Category />
       <Courses />
      <TimeLineSection />
      <Footer /> 
    </main>
  )
}