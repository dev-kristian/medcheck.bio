// components/home/Assistant.jsx
import React from 'react';
import Link from 'next/link';
import { MessageCircle } from "lucide-react";

const Assistant = () => {
  return (
    <Link href="/assistant" className="tests-card-link w-full">
      <section className="home-card flex flex-col md:flex-row">
        <div className="w-full md:w-80 h-40 flex items-center justify-center max-md:mb-4">
          <img src='./images/bot.svg' alt="Bot" className="w-80 h-40" />
        </div>
        <div className="flex flex-col items-start pb-12 md:mb-0 md:ml-4 w-full">
          <h2 className="text-2xl font-semibold text-gray-900">Personal Assistant</h2>
          <p className="text-sm text-gray-600">Get insights and recommendations</p>
        </div>
        <div className="absolute bottom-4 right-4 flex items-center">
          <MessageCircle className="mr-2 h-4 w-4 text-teal-500" />
          <span className="text-teal-500">Chat Now</span>
        </div>
      </section>
    </Link>
  );
};

export default Assistant;
