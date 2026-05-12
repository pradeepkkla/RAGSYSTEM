import React from 'react';
import { motion } from 'framer-motion';

const TypingAnimation = () => {
  const dotVariants = {
    hidden: { opacity: 0.5, y: 0 },
    visible: { opacity: 1, y: -8 },
  };

  const transition = {
    duration: 0.6,
    repeat: Infinity,
    repeatType: 'reverse',
  };

  return (
    <div className="flex gap-1 items-center">
      <motion.span
        variants={dotVariants}
        initial="hidden"
        animate="visible"
        transition={{ ...transition, delay: 0 }}
        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
      />
      <motion.span
        variants={dotVariants}
        initial="hidden"
        animate="visible"
        transition={{ ...transition, delay: 0.2 }}
        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
      />
      <motion.span
        variants={dotVariants}
        initial="hidden"
        animate="visible"
        transition={{ ...transition, delay: 0.4 }}
        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
      />
    </div>
  );
};

export default TypingAnimation;
