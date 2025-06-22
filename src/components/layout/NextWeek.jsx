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
  const headers = generateHeaders(getUser());
  const timezone = getOrSetUTC();
  const lang = getOrSetLang();
  const [days, setDays] = useState([]);
  const [notesByDate, setNotesByDate] = useState({});
  const [loadingDates, setLoadingDates] = useState({});
  const [creatingDates, setCreatingDates] = useState({});

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDayTitle = (index) => {
    if (index === 0) return chooseTextByLang('Сегодня', 'Today', lang);
    if (index === 1) return chooseTextByLang('Завтра', 'Tomorrow', lang);
    return days[index]?.weekday || '';
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
      setNotesByDate(prev => ({ ...prev, [dateStr]: [] }));
    } finally {
      setLoadingDates(prev => ({ ...prev, [dateStr]: false }));
    }
  };

  useEffect(() => {
    const calculateDays = () => {
      const now = new Date();
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
        const date = new Date(now);
        date.setDate(now.getDate() + i);
        
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

    const loadNotes = async () => {
      const newDays = calculateDays();
      for (const day of newDays) {
        if (!notesByDate[day.dateStr]) {
          await fetchNotesForDate(day.date);
        }
      }
    };

    loadNotes();
  }, [timezone, lang]);

  const handleCreateClick = (dateStr) => {
    setCreatingDates(prev => ({ ...prev, [dateStr]: true }));
  };

  const handleCloseForm = (dateStr) => {
    setCreatingDates(prev => ({ ...prev, [dateStr]: false }));
  };

  return (
    <div className="max-w-full mx-auto p-4">
      <h2 className="text-xl font-semibold text-center mb-6">
        {chooseTextByLang('Эта неделя', 'This week', lang)}
      </h2>
      
      <div className="flex overflow-x-auto pb-4 scrollbar-hide space-x-4">
        {days.map((day, index) => (
          <div 
            key={day.dateStr} 
            className="min-w-[25%] bg-white rounded-xl shadow-md p-4 flex-shrink-0 flex flex-col h-[85vh]"
          >
            <div className="text-center mb-4">
              <div className="text-sm font-medium text-gray-600">
                {getDayTitle(index)}
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
                      onSubmitSuccess={() => fetchNotesForDate(day.date)}
                      onDelete={() => fetchNotesForDate(day.date)}
                      onArchivedSuccess={() => fetchNotesForDate(day.date)}
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
              {creatingDates[day.dateStr] ? (
                <NoteForm 
                  compact={true}
                  tags={tags}
                  date_of_note={day.date}
                  onSubmitSuccess={() => {
                    fetchNotesForDate(day.date);
                    handleCloseForm(day.dateStr);
                  }}
                  onClose={() => handleCloseForm(day.dateStr)}
                />
              ) : (
                <button
                  className="w-full py-2 bg-black text-white rounded"
                  onClick={() => handleCreateClick(day.dateStr)}
                >
                  {chooseTextByLang("Добавить заметку", "Add note", lang)}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}