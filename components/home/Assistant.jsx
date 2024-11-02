// Assistant.jsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle } from "lucide-react";

const Assistant = () => {
  return (
    <Link 
      href="/assistant" 
      className="tests-card-link w-full transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-teal-500/20 rounded-xl"
    >
      <section className="home-card flex flex-col md:flex-row relative p-4 sm:p-5 md:p-6 bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm border border-gray-100 rounded-xl">
        {/* Image Container */}
        <div className="w-full md:w-72 lg:w-80 h-32 sm:h-36 md:h-40 flex items-center justify-center max-md:mb-4 transition-transform duration-300 group-hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 bg-teal-500/5 rounded-lg" />
          <Image
            src="/images/bot.svg" 
            alt="AI Assistant" 
            width={320}
            height={160}
            priority
            className="drop-shadow-md hover:drop-shadow-xl transition-all duration-300 w-auto h-auto max-h-full object-contain"
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </div>
        {/* Content Container */}
        <div className="flex flex-col items-start pb-16 sm:pb-14 md:mb-0 md:ml-6 lg:ml-8 w-full">
          <div className="flex items-center flex-wrap gap-2 mb-2 sm:mb-3">
            <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Personal Assistant
            </h2>
            <span className="text-[10px] sm:text-xs bg-teal-100/50 text-teal-700/80 px-2 sm:px-3 py-0.5 rounded-full font-medium shadow-sm flex items-center">
              <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-teal-500/80 rounded-full mr-1 sm:mr-1.5 animate-pulse"></span>
              AI Powered
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl">
            Get personalized insights and health recommendations
          </p>

          <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs px-2 py-1 bg-gray-100/80 text-gray-600 rounded-full">24/7 Available</span>
            <span className="text-[10px] sm:text-xs px-2 py-1 bg-gray-100/80 text-gray-600 rounded-full">Health Insights</span>
            <span className="text-[10px] sm:text-xs px-2 py-1 bg-gray-100/80 text-gray-600 rounded-full hidden sm:inline-block">Personalized</span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-teal-50 hover:bg-teal-100 transition-all duration-300 shadow-sm hover:shadow group text-sm sm:text-base"
          aria-label="Start chat"
        >
          <MessageCircle className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600 group-hover:scale-110 transition-transform" />
          <span className="text-teal-600 font-medium">Chat Now</span>
        </button>
      </section>
    </Link>
  );
};
export default Assistant;
