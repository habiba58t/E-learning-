import { motion } from 'framer-motion';
import { FaUserCircle, FaBell, FaSignOutAlt } from 'react-icons/fa'; // Icons for profile, notifications, and logout
import InstructorSidebar from '../instructor/instructor-sidebar/page';

const Navbar = () => {
    return (
      <div className="sticky top-0 bg-teal-600 text-white p-4 shadow-md z-50">
         <InstructorSidebar />
        <div className="container mx-auto flex justify-end items-center space-x-6">
          {/* Profile Icon with framer-motion */}
          <motion.div
            className="cursor-pointer"
            whileHover={{ scale: 1.1 }} // Slightly enlarge on hover
            whileTap={{ scale: 0.9 }} // Shrink slightly on click
            transition={{ duration: 0.2 }} // Quick, smooth transition
          >
            <FaUserCircle size={24} />
          </motion.div>
  
          {/* Notification Icon with framer-motion */}
          <motion.div
            className="cursor-pointer"
            whileHover={{ scale: 1.1 }} // Slightly enlarge on hover
            whileTap={{ scale: 0.9 }} // Shrink slightly on click
            transition={{ duration: 0.2 }} // Quick, smooth transition
          >
            <FaBell size={24} />
          </motion.div>
  
          {/* Logout Icon with framer-motion */}
          <motion.div
            className="cursor-pointer"
            whileHover={{ scale: 1.1 }} // Slightly enlarge on hover
            whileTap={{ scale: 0.9 }} // Shrink slightly on click
            transition={{ duration: 0.2 }} // Quick, smooth transition
          >
            <FaSignOutAlt size={24} />
          </motion.div>
        </div>
      </div>
    );
  };
export default Navbar;
