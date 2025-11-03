"use client"
import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import animation from '../../public/dumble.json';

const Preloader = () => {
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateOut(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`preloader ${animateOut ? 'slide-out' : ''}`}>
      <Lottie 
        animationData={animation} 
        loop={true} 
        style={{ width: '70%', height: '70%' }}
      />
      <style jsx>{`
        .preloader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #fff;
          z-index: 9999;
          transition: transform 1s ease-in-out;
        }

        .preloader.slide-out {
          transform: translateY(-100%);
        }
      `}</style>
    </div>
  );
};

export default Preloader;