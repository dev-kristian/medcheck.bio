// components/AdditionalInfoInput.jsx
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

const AdditionalInfoInput = ({ additionalInfo, setAdditionalInfo }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="additional-info" className="block text-sm font-medium text-gray-700">
        Additional Information (Optional)
      </label>
      <Textarea
        id="additional-info"
        placeholder="Enter any additional notes or information about the test..."
        value={additionalInfo}
        onChange={(e) => setAdditionalInfo(e.target.value)}
        className="additional-info-textarea"
      />
    </div>
  );
};

export default AdditionalInfoInput;