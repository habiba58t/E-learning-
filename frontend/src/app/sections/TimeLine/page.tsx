import { Search, Bookmark, Book } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-800 to-teal-400 relative" id="section_3">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-center text-white mb-16">How does it work?</h2>
        <div className="relative max-w-4xl mx-auto">
          
          <Timeline />
        </div>
        <div className="text-center mt-16">
          <p className="text-white mb-4 text-lg">Want to See more?</p>
          <a
            href="#"
            className="bg-white text-blue-800 font-bold py-3 px-6 rounded-full hover:bg-blue-100 transition-all"
          >
            Check out courses
          </a>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-teal-400 opacity-60"></div>
    </section>
  );
}

function Timeline() {
  return (
    <div className="space-y-16">
      <TimelineItem
        icon={<Search className="w-6 h-6 text-blue-800" />}
        title="Search your favourite topic"
        description="Go and Explore the Courses in Our Website, Chat with the Instructors and more!"
      />
      <TimelineItem
        icon={<Bookmark className="w-6 h-6 text-blue-800" />}
        title="Enroll and start studying"
        description="Enroll to the course, Have Group Discussions, Group Chats, See your Progress and Challenge yourself!"
      />
      <TimelineItem
        icon={<Book className="w-6 h-6 text-blue-800" />}
        title="Enjoy"
        description="Don't forget to enjoy"
      />
    </div>
  );
}

function TimelineItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative flex items-center">
      {/* Timeline Indicator */}
      <div className="absolute left-1/6 transform -translate-x-1/4 flex flex-col items-center">
        <div className="flex justify-center items-center w-16 h-16 bg-white rounded-full border-4 border-blue-800">
          {icon}
        </div>
        <div className="w-1 h-full bg-white"></div>
      </div>

      {/* Content */}
      <div className="w-full pl-12 pr-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="text-xl font-semibold text-blue-800 mb-2">{title}</h4>
          <p className="text-gray-700">{description}</p>
        </div>
      </div>
    </div>
  );
}