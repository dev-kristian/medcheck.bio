import React from 'react';
import Image from 'next/image';

const MealPlanner = () => {
  return (
    <div className="h-full bg-white flex flex-col items-center justify-center p-4 text-center">
      <Image
        src="/images/coming-soon.svg"
        alt="Coming Soon Illustration"
        width={300}
        height={300}
        className="mb-8"
      />
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Meal Planner</h1>
      <p className="text-xl text-gray-600">Coming soon. Get ready to simplify your meal planning.</p>
    </div>
  );
};

export default MealPlanner;