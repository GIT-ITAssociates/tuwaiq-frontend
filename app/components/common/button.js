'use client';
import{ useState } from 'react';
import { motion } from "framer-motion";
const Button = ({children,onClick,type = 'button',loadingText = 'Loading...',className,link,loading}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (event) => {
    if (type == 'submit') {
      setIsLoading(true);
    }
    if (onClick) {
      await onClick(event);
    }
    if (type == 'submit') {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: "static", zIndex: "150" }}>
      <motion.button
        whileTap={{ scale: 0.85 }}
        type={type}
        onClick={handleClick}
        className={` ${className} button text-white hover:!bg-[#C7A87D]  bg-primary lg:px-8 text-textMain !font-poppins md:px-4 h-fit py-2 px-2 whitespace-pre rounded-[8px] transition-all !font-medium duration-700 ease-in-out sm:text-base capitalize text-sm ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary text-white'}  glassy-hover`}
        disabled={isLoading}
      >
        {loading ? loadingText : children}
      </motion.button>
    </div>
  );
};

export default Button;