import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Goodbye: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000); // Redirect to login after 3 seconds
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [navigate]);

  // Animation variants for the checkmark SVG
  const checkmarkVariants = {
    initial: { 
      pathLength: 0, 
      scale: 1,
      opacity: 0,
    },
    animate: {
      pathLength: 1,
      scale: [1, 1.1, 1], // Gentle pulse
      opacity: 1,
      transition: {
        pathLength: { duration: 0.8, ease: 'easeInOut' },
        scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
        opacity: { duration: 0.3 },
      },
    },
  };

  // Animation variants for the goodbye text
  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.5 }, // Slight delay to sync with checkmark
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
      <div className="text-center">
        <motion.svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-600 mb-4"
          initial="initial"
          animate="animate"
        >
          <motion.path
            d="M20 6L9 17l-5-5"
            variants={checkmarkVariants}
          />
        </motion.svg>
        <motion.h1
          variants={textVariants}
          initial="initial"
          animate="animate"
          className="text-4xl font-bold text-gray-800"
        >
          Goodbye! See you soon!
        </motion.h1>
      </div>
    </div>
  );
};

export default Goodbye;