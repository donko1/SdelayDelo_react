import React, { useState, useEffect, act } from 'react';
import { chooseTextByLang, getOrSetLang, getOrSetUTC } from '@/utils/helpers/locale';
import { generateHeaders, getUser } from '@/utils/api/auth';
import { getNotesByDate } from '@/utils/api/notes';
import NoteForm from '../ui/NoteForm';

export default function Calendar({tags, editingNote, onEdit, onCloseEdit, onSubmitSuccess, onDelete, onArchivedSuccess}) {
  const headers = generateHeaders(getUser());
  const timezone = getOrSetUTC(); 
  const lang = getOrSetLang(); 
  const [activeDate, setActiveDate] = useState(null);
  const [notes, setNotes] = useState([])
  const [creating, setCreating] = useState(false)

  const [offsetWeeks, setOffsetWeeks] = useState(0);
  const [days, setDays] = useState([]);


  const handleDayClick = (date) => {
    setActiveDate(date);
    };

  const fetchNotes = async() => {
    try {
      const results = await getNotesByDate(headers, activeDate)
      console.log(results)
      setNotes(results)
    }
    catch (error) {
      console.error("Ошибка при загрузке заметок моего дня:", error);
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [activeDate])

  const isSameDay = (date1, date2) => {
        if (!date1 || !date2) return false;
        return date1.toDateString() === date2.toDateString();
    };

  const getWeekTitle = () => {
    if (offsetWeeks === 0) {
      return chooseTextByLang('Эта неделя', 'This week', lang);
    } else if (offsetWeeks === 1) {
      return chooseTextByLang('Следующая неделя', 'Next week', lang);
    } else if (offsetWeeks === 2) {
      return chooseTextByLang('Через 2 недели', 'In 2 weeks', lang);
    } else {
      return chooseTextByLang(
        `Через ${offsetWeeks} недель`, 
        `In ${offsetWeeks} weeks`, 
        lang
      );
    }
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
          {getWeekTitle()}
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
      <div className="flex flex-wrap gap-5">
        {
          notes?.detail && (
            <h1>{chooseTextByLang("Нет заметок на выбранную дату", "No notes for this date", lang)}</h1>
          )
        }
        {
          notes?.length > 0 && notes.map((note) => (
            <div
                    key={note.id}
                    className="w-72 p-4 border-2 border-gray-300 rounded-lg hover:shadow-md"
                >
                    {editingNote?.id === note.id ? (
                        <NoteForm
                            note={note}
                            tags={tags}
                            onClose={onCloseEdit}
                            onSubmitSuccess={() => {
                              onSubmitSuccess();
                              fetchNotes()
                            }}
                            onDeleteSuccess={(deletedId) => {
                                onDeleteSuccess();
                                onDelete(deletedId);
                                fetchNotes() 
                            }}
                            onArchivedSuccess={() => {
                              fetchNotes()
                              onArchivedSuccess()
                            }}
                        />
                    ) : (
                        <div onClick={() => onEdit(note)} className="cursor-pointer">
                            <h1 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-200">
                                {note.title}
                            </h1>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {note.tags?.map((tagId) => {
                                    const tag = tags.find(t => t.id === tagId);
                                    return tag ? (
                                        <span
                                            key={tag.id}
                                            className="px-3 py-1 rounded text-xs text-white"
                                            style={{ backgroundColor: tag.colour }}
                                        >
                                            #{tag.title}
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )}
                </div>
          ))
        }
        
      </div>
      <div className="mt-4 mb-6">
            <button
              className={`px-4 py-2 text-white rounded ${
                creating ? "bg-gray-400 cursor-not-allowed" : "bg-black"
              }`}

              onClick={() => setCreating(true)}
              disabled={creating}
            >
              {chooseTextByLang("Добавить заметку", "Add note", lang)}
            </button>
        </div>
        {creating && (
          <NoteForm 
            tags={tags}
            onSubmitSuccess={fetchNotes}
            onDeleteSuccess={fetchNotes}
            onClose={() => setCreating(false)}
            date_of_note={activeDate}
          />
        )}

    </div>
  );
};
