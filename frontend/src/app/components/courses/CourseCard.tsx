// src/app/components/Courses/CourseCard.tsx

import React from 'react';

interface CourseCardProps {
  course: {
    id: string;
    name: string;
    description: string;
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="course-card">
      <h3>{course.name}</h3>
      <p>{course.description}</p>
    </div>
  );
};

export default CourseCard;
