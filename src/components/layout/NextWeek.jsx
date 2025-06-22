import React, { useState, useEffect } from 'react';
import { chooseTextByLang, getOrSetLang, getOrSetUTC } from '@/utils/helpers/locale';
import { generateHeaders, getUser } from '@/utils/api/auth';
import { getNotesByDate } from '@/utils/api/notes';
import NoteForm from '@components/ui/NoteForm';
import NoteCard from '@/components/ui/NoteCard';

export default function NextWeek({
  tags,
  editingNote,
  onEdit,
  onCloseEdit,
  onSubmitSuccess,
  onDelete,
  onArchivedSuccess
}) {
  // Получение настроек пользователя
  const headers = generateHeaders(getUser());
  const timezone = getOrSetUTC();
  const lang = getOrSetLang();
  
  // Состояния компонента
  const [offsetWeeks, setOffsetWeeks] = useState(0);
  const [days, setDays] = useState([]);
  const [notesByDate, setNotesByDate] = useState({});
  const [loadingDates, setLoadingDates] = useState({});

  // Форматирование даты в YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getWeekTitle = () => {
    if (offsetWeeks === 0) return chooseTextByLang('Эта неделя', 'This week', lang);
    if (offsetWeeks === 1) return chooseTextByLang('Следующая неделя', 'Next week', lang);
    if (offsetWeeks === 2) return chooseTextByLang('Через 2 недели', 'In 2 weeks', lang);
    return chooseTextByLang(
      `Через ${offsetWeeks} недель`, 
      `In ${offsetWeeks} weeks`, 
      lang
    );
  };

  const getDayTitle = (day, index) => {
    if (offsetWeeks === 0) {
      if (index === 0) return chooseTextByLang('Сегодня', 'Today', lang);
      if (index === 1) return chooseTextByLang('Завтра', 'Tomorrow', lang);
    }
    return day.weekday;
  };

  const fetchNotesForDate = async (date) => {
    const dateStr = formatDate(date);
    setLoadingDates(prev => ({ ...prev, [dateStr]: true }));
    
    try {
      const results = await getNotesByDate(headers, date);
      setNotesByDate(prev => ({
        ...prev,
        [dateStr]: results?.detail ? [] : results
      }));
    } catch (error) {
      console.error(`Error loading notes for ${dateStr}:`, error);
      setNotesByDate(prev => ({ ...prev, [dateStr]: [] }));
    } finally {
      setLoadingDates(prev => ({ ...prev, [dateStr]: false }));
    }
  };

  const handlePrevWeek = () => offsetWeeks > 0 && setOffsetWeeks(offsetWeeks - 1);
  const handleNextWeek = () => setOffsetWeeks(offsetWeeks + 1);

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
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        newDays.push({
          date,
          weekday: weekdayFormatter.format(date),
          day: dayFormatter.format(date),
          dateStr: formatDate(date)
        });
      }
      
      setDays(newDays);
      return newDays;
    };

    const loadNotesForWeek = async () => {
      const newDays = calculateDays();
      for (const day of newDays) {
        if (!notesByDate[day.dateStr] && !loadingDates[day.dateStr]) {
          await fetchNotesForDate(day.date);
        }
      }
    };

    loadNotesForWeek();
  }, [offsetWeeks, timezone, lang]);

  return (
    <div className="max-w-full mx-auto p-4">
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
      
      <div className="flex overflow-x-auto pb-4 scrollbar-hide space-x-4">
        {days.map((day, index) => (
          <div 
            key={day.dateStr} 
            className="min-w-[25%] bg-white rounded-xl shadow-md p-4 flex-shrink-0 flex flex-col h-[85vh]"
          >
            <div className="text-center mb-4">
              <div className="text-sm font-medium text-gray-600">
                {getDayTitle(day, index)}
              </div>
              <div className="text-lg font-bold text-gray-800">
                {day.day}
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto mb-4 space-y-3">
              {loadingDates[day.dateStr] ? (
                <p className="text-center text-gray-500">
                  {chooseTextByLang('Загрузка...', 'Loading...', lang)}
                </p>
              ) : (
                notesByDate[day.dateStr]?.length > 0 ? (
                  notesByDate[day.dateStr].map(note => (
                    <NoteCard 
                      key={note.id}
                      note={note}
                      tags={tags}
                      isEditing={editingNote?.id === note.id}
                      onEdit={onEdit}
                      onCloseEdit={onCloseEdit}
                      onSubmitSuccess={() => {
                        if (onSubmitSuccess) onSubmitSuccess();
                        fetchNotesForDate(day.date);
                      }}
                      onDelete={(deletedId) => {
                        if (onDelete) onDelete(deletedId);
                        fetchNotesForDate(day.date);
                      }}
                      onArchivedSuccess={() => {
                        if (onArchivedSuccess) onArchivedSuccess();
                        fetchNotesForDate(day.date);
                      }}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    {chooseTextByLang('Нет заметок', 'No notes', lang)}
                  </p>
                )
              )}
            </div>
            
            <div className="mt-auto">
              <NoteForm 
                compact={true}
                tags={tags}
                date_of_note={day.date}
                onSubmitSuccess={() => {
                  if (onSubmitSuccess) onSubmitSuccess();
                  fetchNotesForDate(day.date);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}