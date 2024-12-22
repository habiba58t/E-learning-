import React from 'react';
import Image from 'next/image';

const FeaturedSection = () => {
  return (
    <section className="bg-[#80d0c7] pb-20 rounded-b-[50px]">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4">

          {/* Web Design Card */}
          <div className="w-full lg:w-1/3 px-4 mb-6 lg:mb-0">
            <div className="bg-white shadow-lg rounded-[20px] p-6">
              <h5 className="text-[24px] font-semibold text-[#000] mb-4">Explore</h5>
              <p className="text-[20px] text-[#717275] mb-6">
                Explore our expertly curated course options. Learn everything from the basics to advanced skills in anything and everything you can imagine.
              </p>
              <a
                href="/courses"
                className="bg-[#80d0c7] text-white text-[18px] font-semibold py-2 px-6 rounded-full hover:bg-[#13547a] transition-all"
              >
                Start Learning
              </a>
            </div>
          </div>

          {/* Finance Card */}
          <div className="w-full lg:w-2/3 px-4">
            <div className="relative bg-black rounded-[20px] overflow-hidden shadow-lg">
              {/* Background Image */}
              <div className="absolute inset-0 bg-black bg-opacity-50 p-8 flex flex-col justify-between">
                {/* Text Content */}
                <div>
                  <h5 className="text-[24px] font-semibold text-white mb-4">Finance & Accounting</h5>
                  <p className="text-[20px] text-white mb-6">
                    Master the fundamentals of finance and accounting. Our platform offers courses that help you understand financial principles and skills.
                  </p>
                  <a
                    href="/courses/finance"
                    className="bg-[#80d0c7] text-white text-[18px] font-semibold py-2 px-6 rounded-full hover:bg-[#13547a] transition-all"
                  >
                    Explore Courses
                  </a>
                </div>
                {/* Social Links and Bookmark */}
                <div className="flex justify-between items-center mt-6">
                  <ul className="flex space-x-4">
                    <li>
                      <a href="#" className="text-white hover:text-[#536DFE]">
                        <i className="bi-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-white hover:text-[#536DFE]">
                        <i className="bi-facebook"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-white hover:text-[#536DFE]">
                        <i className="bi-pinterest"></i>
                      </a>
                    </li>
                  </ul>
                  <a href="#" className="text-white">
                    <i className="bi-bookmark"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
