import React from 'react';
import GeneralRecommendationsCard from '@/components/resultsPage/GeneralRecommendationsCard';
import DietaryRecommendationsCard from '@/components/resultsPage/DietaryRecommendationsCard';

const RecommendationsTab = ({ generalRecommendations, dietaryRecommendations }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="col-span-1">
        <h4 className="font-semibold mt-2 mb-4 text-xl text-gray-800">General Recommendations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {generalRecommendations && generalRecommendations.map((recommendation, index) => (
          <GeneralRecommendationsCard key={index} recommendation={recommendation} />
        ))}
        </div >
      </div>
      <div className="col-span-1">
        <h4 className="font-semibold mt-6 mb-4 text-xl text-gray-800">Dietary Recommendations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {dietaryRecommendations && dietaryRecommendations.map((recommendation, index) => (
          <DietaryRecommendationsCard key={index} recommendation={recommendation} />
        ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsTab;