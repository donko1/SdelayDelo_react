import React, { useState, useEffect } from 'react';
import { chooseTextByLang, getOrSetLang, getOrSetUTC } from '@/utils/helpers/locale';

export default function Calendar() {
  
  const timezone = getOrSetUTC(); 
  const lang = getOrSetLang(); 
  const [activeDate, setActiveDate] = useState(null);

  const [offsetWeeks, setOffsetWeeks] = useState(0);
  const [days, setDays] = useState([]);

  const handleDayClick = (date) => {
    setActiveDate(date);
    };

  const isSameDay = (date1, date2) => {
        if (!date1 || !date2) return false;
        return date1.toDateString() === date2.toDateString();
    };


  useEffect(() => {
    const calculateDays = () => {
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(now.getDate() + offsetWeeks * 7);
      
      const newDays = [];
      
      const weekdayFormatter = new Intl.DateTimeFormat(lang, { 
        timeZone: timezone,
        weekday: 'short' 
      });
      
      const dayFormatter = new Intl.DateTimeFormat(lang, { 
        timeZone: timezone,
        day: 'numeric' 
      });
      
      const todayInTz = new Intl.DateTimeFormat(lang, {
        timeZone: timezone,
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      }).format(now);
      
      for (let i = 0; i < 8; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dateInTz = new Intl.DateTimeFormat(lang, {
          timeZone: timezone,
          day: 'numeric',
          month: 'numeric',
          year: 'numeric'
        }).format(date);
        
        const isToday = dateInTz === todayInTz && offsetWeeks === 0;
        
        newDays.push({
          date,
          weekday: weekdayFormatter.format(date),
          day: dayFormatter.format(date),
          isToday
        });
      }
      
      setDays(newDays);
      
      if (!activeDate) {
        setActiveDate(newDays.find(day => day.isToday)?.date || newDays[0]?.date);
        }

    };

    calculateDays();
  }, [offsetWeeks, timezone, lang]);

  const handlePrevWeek = () => {
    if (offsetWeeks > 0) {
      setOffsetWeeks(offsetWeeks - 1);
    }
  };

  const handleNextWeek = () => {
    setOffsetWeeks(offsetWeeks + 1);
  };

  console.log(activeDate)

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={handlePrevWeek}
          disabled={offsetWeeks === 0}
          className={`p-2 rounded-full ${offsetWeeks === 0 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-xl font-semibold">
          {chooseTextByLang('Эта неделя', 'This week', lang)}
        </h2>
        
        <button 
          onClick={handleNextWeek}
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-8 gap-1">
        {days.map((day, index) => {
          const isActive = isSameDay(day.date, activeDate);
          const isToday = day.isToday;
          
          return (
            <div 
              key={index}
              onClick={() => handleDayClick(day.date)}
              className={`flex flex-col items-center py-3 rounded-lg cursor-pointer ${
                isActive 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'hover:bg-gray-50'
              }`}
            >

              <div className={`text-sm ${
                isActive || isToday ? 'font-medium' : ''
              } ${
                isActive ? 'text-blue-600' : 
                isToday ? 'text-blue-500' : 'text-gray-500'
              }`}>
                {isToday 
                  ? chooseTextByLang('Сегодня', 'Today', lang) 
                  : day.weekday}
              </div>
              <div className={`mt-1 text-lg font-medium ${
                isActive ? 'text-blue-700' : 
                isToday ? 'text-blue-600' : 'text-gray-800'
              }`}>
                {day.day}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
