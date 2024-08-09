import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, addYears, subYears, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek, setMonth, setYear } from 'date-fns';

const CustomCalendar = ({ selectedDate, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('days'); // 'days', 'months', or 'years'

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const currentYear = currentDate.getFullYear();
  const startYear = Math.floor(currentYear / 10) * 10 - 1;
  const years = Array.from({length: 12}, (_, i) => startYear + i);

  const navigate = (direction) => {
    if (view === 'days') {
      setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
    } else if (view === 'months') {
      setCurrentDate(direction === 'prev' ? subYears(currentDate, 1) : addYears(currentDate, 1));
    } else if (view === 'years') {
      setCurrentDate(direction === 'prev' ? subYears(currentDate, 10) : addYears(currentDate, 10));
    }
  };

  const handleDayClick = (date) => {
    onDateSelect(date);
    setCurrentDate(date);
    setView('days');
  };

  const handleMonthClick = (monthIndex) => {
    setCurrentDate(setMonth(currentDate, monthIndex));
    setView('days');
  };

  const handleYearClick = (year) => {
    setCurrentDate(setYear(currentDate, year));
    setView('months');
  };

  const renderDays = () => (
    <>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium text-gray-500 text-xs">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map(date => (
          <button
            key={date.toString()}
            onClick={() => handleDayClick(date)}
            className={`
              p-2 text-center rounded-full text-sm transition-colors duration-200
              ${!isSameMonth(date, currentDate) ? 'text-gray-300 hover:bg-gray-100' : 'hover:bg-teal-100'}
              ${isSameDay(date, selectedDate) && 'bg-teal-500 text-white hover:bg-teal-600'}
              ${isToday(date) && !isSameDay(date, selectedDate) && 'border-2 border-teal-500'}
            `}
          >
            {format(date, 'd')}
          </button>
        ))}
      </div>
    </>
  );

  const renderMonths = () => (
    <div className="grid grid-cols-3 gap-2">
      {months.map((month, index) => (
        <button
          key={month}
          onClick={() => handleMonthClick(index)}
          className="p-2 text-center rounded-lg hover:bg-teal-100 transition-colors duration-200"
        >
          {month}
        </button>
      ))}
    </div>
  );

  const renderYears = () => (
    <div className="grid grid-cols-4 gap-2">
      {years.map((year, index) => (
        <button
          key={year}
          onClick={() => handleYearClick(year)}
          className={`
            p-2 text-center rounded-lg transition-colors duration-200
            ${index === 0 || index === 11 ? 'text-gray-400 hover:bg-gray-100' : 'hover:bg-teal-100'}
            ${year === currentYear && 'bg-teal-500 text-white hover:bg-teal-600'}
          `}
        >
          {year}
        </button>
      ))}
    </div>
  );

  return (
    <div className="custom-calendar bg-white rounded-lg shadow-lg p-4 w-64">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate('prev')} className="p-1 hover:bg-teal-100 rounded transition-colors duration-200">
          <ChevronLeft className="h-6 w-6 text-teal-500" />
        </button>
        <div>
          <button onClick={() => setView('months')} className="font-semibold hover:bg-teal-100 px-2 py-1 rounded transition-colors duration-200">
            {format(currentDate, 'MMM')}
          </button>
          <button onClick={() => setView('years')} className="font-semibold hover:bg-teal-100 px-2 py-1 rounded transition-colors duration-200 ml-1">
            {format(currentDate, 'yyyy')}
          </button>
        </div>
        <button onClick={() => navigate('next')} className="p-1 hover:bg-teal-100 rounded transition-colors duration-200">
          <ChevronRight className="h-6 w-6 text-teal-500" />
        </button>
      </div>
      {view === 'days' && renderDays()}
      {view === 'months' && renderMonths()}
      {view === 'years' && renderYears()}
    </div>
  );
};

export default CustomCalendar;