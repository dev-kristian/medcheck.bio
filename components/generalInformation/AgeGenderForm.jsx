import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { FaMale, FaFemale, FaGenderless } from 'react-icons/fa';

const AgeGenderForm = ({ age, setAge, gender, setGender }) => {
  const handleAgeChange = (value) => {
    const regex = /^\d+$/;
    if (regex.test(value) || value === '') {
      setAge(value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex-1 space-y-2">
        <Label htmlFor="age" className="text-teal-700">Age <span className="text-red-500">*</span></Label>
        <p className="text-sm text-gray-500">Please enter your age. You must be at least 18 years old.</p>
        <input
          type="text"
          id="age"
          value={age}
          onChange={(e) => handleAgeChange(e.target.value)}
          required
          placeholder="e.g."
          className="auth-input w-full"
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </div>
      <div className="flex-1 space-y-2">
        <Label htmlFor="gender" className="text-teal-700">Gender <span className="text-red-500">*</span></Label>
        <p className="text-sm text-gray-500">Please select your gender.</p>
        <Select value={gender} onValueChange={setGender} required>
          <SelectTrigger className="w-full border-teal-300 focus:ring-white rounded-xl">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent className='rounded-xl'>
            <SelectItem className='rounded-xl' value="male"><FaMale className="inline mr-2" />Male</SelectItem>
            <SelectItem className='rounded-xl' value="female"><FaFemale className="inline mr-2" />Female</SelectItem>
            <SelectItem className='rounded-xl' value="other"><FaGenderless className="inline mr-2" />Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AgeGenderForm;
