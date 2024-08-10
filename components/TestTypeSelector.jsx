// components/TestTypeSelector.jsx
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const TestTypeSelector = ({ testType, setTestType }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="test-type" className="block text-sm font-medium text-gray-700">
        Test Type
      </label>
      <Select onValueChange={setTestType} value={testType}>
        <SelectTrigger id="test-type" className="w-full">
          <SelectValue placeholder="Select a test" />
        </SelectTrigger>
        <SelectContent className='bg-white'>
          <SelectGroup>
            <SelectLabel>Tests</SelectLabel>
            <SelectItem value="blood-test">Blood Test</SelectItem>
            <SelectItem value="urine-test">Urine Test</SelectItem>
            <SelectItem value="sugar-test">Sugar Test</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TestTypeSelector;