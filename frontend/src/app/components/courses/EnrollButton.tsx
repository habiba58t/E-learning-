// src/app/components/Courses/EnrollButton.tsx

import React from 'react';

interface EnrollButtonProps {
  onEnroll: () => void;
}

const EnrollButton: React.FC<EnrollButtonProps> = ({ onEnroll }) => {
  return (
    <button className="enroll-button" onClick={onEnroll}>
      Enroll
    </button>
  );
};

export default EnrollButton;
