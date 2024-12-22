import React from 'react';
import Image from 'next/image';
import image2 from './undraw_Remote_design_team_re_urdx.png';
import image1 from './table.jpg';

const FeaturedSection = () => {
  return (
    <section className="bg-[#80d0c7] pb-20 rounded-b-[50px]">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center -mx-4">
          {/* Web Design Card */}
          <div className="w-full lg:w-1/3 px-4 mb-6 lg:mb-0">
            <div className="bg-white shadow-lg rounded-[20px] p-6">
              <h5 className="text-[24px] font-semibold text-[#000] mb-4">Web Design</h5>
              <p className="text-[20px] text-[#717275] mb-6">
                When you search for free CSS templates, you will notice that TemplateMo is one of the best websites.
              </p>
              <Image
                src={image2}
                alt="Web Design"
                layout="responsive"
                width={500}
                height={300}
                className="rounded-[20px]"
              />
            </div>
          </div>
          {/* Finance Card */}
          <div className="w-full lg:w-1/3 px-4 mb-6 lg:mb-0 mt-20"> {/* Added mt-8 here */}
            <div className="relative bg-black rounded-[20px] overflow-hidden shadow-lg">
              {/* Background Image */}
              <Image
                src={image1}
                alt="Finance"
                layout="responsive"
                width={500}
                height={300}
                className="object-cover"
              />
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-black bg-opacity-50 p-8 flex flex-col justify-between">
                {/* Text Content */}
                <div>
                  <h5 className="text-[24px] font-semibold text-white mb-4">Finance</h5>
                  <p className="text-[20px] text-white mb-6">
                    Topic Listing Template includes homepage, listing page, detail page, and contact page. You can feel free to edit and adapt for your CMS requirements.
                  </p>
                  <a
                    href="topics-detail.html"
                    className="bg-[#80d0c7] text-white text-[18px] font-semibold py-2 px-6 rounded-full hover:bg-[#13547a] transition-all"
                  >
                    Learn More
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