import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { tr } from 'date-fns/locale';

const CustomDatePicker = ({ selectedDate, onChange, minDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const getDaysInMonth = (date) => {
    const start = startOfWeek(startOfMonth(date));
    const end = endOfWeek(endOfMonth(date));
    return eachDayOfInterval({ start, end });
  };

  const isDateSelectable = (date) => {
    const minimumDate = new Date(minDate);
    minimumDate.setHours(0, 0, 0, 0);
    return date >= minimumDate;
  };

  const monthDays = getDaysInMonth(currentMonth);
  const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-white border rounded-lg shadow-sm hover:border-blue-500 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 flex items-center justify-between"
      >
        <span className="text-gray-700">
          {format(selectedDate, 'd MMMM yyyy', { locale: tr })}
        </span>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-[320px] z-50">
          <div className="flex justify-between items-center mb-4">
            <button
              type='button'
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              {format(currentMonth, 'MMMM yyyy', { locale: tr })}
            </h2>
            <button
              type='button'
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-600 py-2"
              >
                {day}
              </div>
            ))}

            {monthDays.map((day, dayIdx) => {
              const isSelectable = isDateSelectable(day);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              
              return (
                <button
                  type='button'
                  key={dayIdx}
                  onClick={() => {
                    if (isSelectable) {
                      onChange(day);
                      setIsOpen(false);
                    }
                  }}
                  disabled={!isSelectable}
                  className={`
                    p-2 text-sm rounded-full w-10 h-10 mx-auto flex items-center justify-center
                    ${!isCurrentMonth ? 'text-gray-300' : isSelectable ? 'text-gray-700' : 'text-gray-300'}
                    ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : 'hover:bg-gray-100'}
                    ${!isSelectable ? 'cursor-not-allowed' : 'cursor-pointer'}
                    transition-colors duration-200
                  `}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;