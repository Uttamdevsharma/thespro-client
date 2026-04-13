'use client';

import React, { useState, useEffect, useRef } from 'react';
import NoticeCard from './NoticeCard';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface NoticeSliderProps {
  notices: any[];
}

const NoticeSlider: React.FC<NoticeSliderProps> = ({ notices }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(1);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2);
      } else {
        setVisibleItems(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.max(0, notices.length - visibleItems + 1);

  const nextSlide = () => {
    if (currentIndex < notices.length - visibleItems) {
      setCurrentIndex(prev => prev + 1);
    } else {
        setCurrentIndex(0); // Loop back
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
        setCurrentIndex(notices.length - visibleItems); // Loop to end
    }
  };

  if (!notices || notices.length === 0) {
    return (
      <div className="py-12 bg-gray-50 dark:bg-gray-950 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center space-y-3">
        <Info className="text-gray-300" size={32} />
        <p className="text-gray-400 font-bold">No active notices available at this time.</p>
      </div>
    );
  }

  return (
    <div className="relative group/slider">
      {/* Slider Container */}
      <div className="overflow-hidden px-4 -mx-4">
        <div 
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
            width: `${(notices.length / visibleItems) * 100}%`
          }}
        >
          {notices.map((notice) => (
            <div 
              key={notice._id} 
              className="px-4"
              style={{ width: `${100 / notices.length}%` }}
            >
              <NoticeCard notice={notice} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      {notices.length > visibleItems && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-12 h-12 bg-white dark:bg-gray-900 rounded-full shadow-xl flex items-center justify-center text-gray-900 dark:text-gray-50 border border-gray-100 dark:border-gray-800 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all z-20 opacity-0 group-hover/slider:opacity-100 group-hover/slider:translate-x-0"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-12 h-12 bg-white dark:bg-gray-900 rounded-full shadow-xl flex items-center justify-center text-gray-900 dark:text-gray-50 border border-gray-100 dark:border-gray-800 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all z-20 opacity-0 group-hover/slider:opacity-100 group-hover/slider:translate-x-0"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Progress Indicators */}
          <div className="flex justify-center mt-12 space-x-2">
            {Array.from({ length: notices.length - visibleItems + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full ${currentIndex === idx ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200 hover:bg-gray-300'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NoticeSlider;
