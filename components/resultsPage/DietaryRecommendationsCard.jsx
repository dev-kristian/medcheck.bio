import React from 'react';
import { Droplet, Apple, AlertTriangle, Check } from 'lucide-react';

const DietaryRecommendationsCard = ({ recommendation }) => {
  const { name, reason, foods, hydration_recommendation, lifestyle_adjustments, nutrient_focus } = recommendation;

  const renderFoodList = (foods, type) => {
    const filteredFoods = foods.filter(food => food.type === type);
    if (filteredFoods.length === 0) return null;

    return (
      <div className="mb-2">
        <h5 className="font-semibold text-sm mb-1 capitalize">
          {type === 'recommended' ? (
            <span className="text-green-600">Recommended Foods</span>
          ) : (
            <span className="text-red-600">Foods to Avoid</span>
          )}
        </h5>
        <ul className="list-disc pl-5 text-sm text-gray-600">
          {filteredFoods.map((food, index) => (
            <li key={index}>{food.name}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 border-l-4 border-green-500">
      <div className="flex items-center mb-2">
        <span className="mr-3">
          <Apple className="w-5 h-5 text-green-500" />
        </span>
        <h3 className="font-semibold text-lg">{name}</h3>
      </div>
      <p className="text-sm text-gray-700 mb-3">{reason}</p>
      
      {renderFoodList(foods, 'recommended')}
      {renderFoodList(foods, 'to avoid')}
      
      {hydration_recommendation && (
        <div className="flex items-center text-sm text-blue-600 mt-2 mb-2">
          <Droplet className="w-4 h-4 mr-2" />
          <span>{hydration_recommendation}</span>
        </div>
      )}
      
      {lifestyle_adjustments && (
        <div className="flex items-start text-sm text-gray-600 mt-2 mb-2">
          <AlertTriangle className="w-4 h-4 mr-2 mt-1 flex-shrink-0 text-yellow-500" />
          <span>{lifestyle_adjustments}</span>
        </div>
      )}
      
      {nutrient_focus && nutrient_focus.length > 0 && (
        <div className="mt-2">
          <h5 className="font-semibold text-sm mb-1">Nutrient Focus:</h5>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            {nutrient_focus.map((nutrient, index) => (
              <li key={index}>{nutrient}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DietaryRecommendationsCard;