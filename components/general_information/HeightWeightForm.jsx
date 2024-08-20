// HeightWeightForm.js
import React from 'react';
import { Label } from '@/components/ui/label';

const HeightWeightForm = ({
  height,
  setHeight,
  weight,
  setWeight,
  activeTab,
  handleHeightChange,
  handleWeightChange,
}) => {
  const renderHeightInput = () => {
    if (activeTab === 0) {
      return (
        <div className="space-y-2">
          <Label htmlFor="height-cm" className="text-teal-700">
            Height (cm) <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-gray-500">Enter your height in centimeters. Example: 170</p>
          <input
            type="text"
            id="height-cm"
            value={height.cm}
            onChange={(e) => handleHeightChange('cm', e.target.value)}
            required
            placeholder="170"
            className="auth-input"
            inputMode="decimal"
            pattern="^\d+(\.\d{0,2})?$"
          />
        </div>
      );
    } else {
      return (
        <div className="space-y-2">
          <Label htmlFor="height-ft" className="text-teal-700">
            Height (ft/in) <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-gray-500">Enter your height in feet and inches. Example: 5' 9"</p>
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                id="height-ft"
                value={height.ft}
                onChange={(e) => handleHeightChange('ft', e.target.value)}
                required
                placeholder="5"
                className="auth-input"
                inputMode="decimal"
                pattern="^\d+(\.\d{0,2})?$"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                id="height-in"
                value={height.in}
                onChange={(e) => handleHeightChange('in', e.target.value)}
                required
                placeholder="9"
                className="auth-input"
                inputMode="decimal"
                pattern="^\d+(\.\d{0,2})?$"
              />
            </div>
          </div>
        </div>
      );
    }
  };

  const renderWeightInput = () => (
    <div className="space-y-2">
      <Label htmlFor="weight" className="text-teal-700">
        Weight ({activeTab === 0 ? 'kg' : 'lb'}) <span className="text-red-500">*</span>
      </Label>
      <p className="text-sm text-gray-500">
        Enter your weight in {activeTab === 0 ? 'kilograms' : 'pounds'}. Example: {activeTab === 0 ? '70' : '154'}
      </p>
      <input
        type="text"
        id="weight"
        value={activeTab === 0 ? weight.kg : weight.lb}
        onChange={(e) => handleWeightChange(e.target.value)}
        required
        placeholder={activeTab === 0 ? "70" : "154"}
        className="auth-input"
        inputMode="decimal"
        pattern="^\d+(\.\d{0,2})?$"
      />
    </div>
  );

  return (
    <div className="space-y-4">
      {renderHeightInput()}
      {renderWeightInput()}
    </div>
  );
};

export default HeightWeightForm;
