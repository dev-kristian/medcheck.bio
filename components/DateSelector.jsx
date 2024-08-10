// components/DateSelector.jsx
import React from 'react';
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CustomCalendar from "@/components/CustomCalendar";

const DateSelector = ({ date, setDate }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="date-select" className="block text-sm font-medium text-gray-700">
        Test Date
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date-select"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Select test date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <CustomCalendar
            selectedDate={date}
            onDateSelect={setDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateSelector;