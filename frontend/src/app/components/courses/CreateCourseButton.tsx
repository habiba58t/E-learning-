// src/app/components/Courses/CreateCourseButton.tsx

import React from 'react';

interface CreateCourseButtonProps {
  onCreate: () => void;
}

const CreateCourseButton: React.FC<CreateCourseButtonProps> = ({ onCreate }) => {
  return (
    <button className="create-course-button" onClick={onCreate}>
      Create Course
    </button>
  );
};

export default CreateCourseButton;
