import React, { useState, useEffect, useRef } from 'react';
import { chooseTextByLang, getOrSetLang, getOrSetUTC } from '@/utils/helpers/locale';
import { generateHeaders, getUser } from '@/utils/api/auth';
import { getNotesByDate } from '@/utils/api/notes';
import NoteForm from '@/components/notes/NoteForm/NoteForm';
import NoteCard from '@/components/ui/NoteCard';
import TitleForBlock from '@components/ui/Title';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1); 
  };

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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e) => {
      isDragging.current = true;
      startX.current = e.pageX - container.offsetLeft;
      scrollLeft.current = container.scrollLeft;
      container.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX.current) * 1.5;
      container.scrollLeft = scrollLeft.current - walk;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      container.style.cursor = 'grab';
      document.body.style.userSelect = '';
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);

    container.style.overflow = 'hidden';
    container.style.cursor = 'grab';

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseUp);
    };
  }, []);

  const handleCreateClick = (dateStr) => {
    setCreatingDates(prev => ({ ...prev, [dateStr]: true }));
  };

  const handleCloseForm = (dateStr) => {
    setCreatingDates(prev => ({ ...prev, [dateStr]: false }));
  };

  const scrollToIndex = (index) => {
    if (index < 0 || index >= days.length) return;
    
    setCurrentIndex(index);
    const container = containerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * index;
      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < days.length - 1;

  return (
    <div 
      ref={wrapperRef}
      className="max-w-full mx-auto p-4 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      <TitleForBlock text={chooseTextByLang('Эта неделя', 'This week', lang)} />
      
      <div 
        ref={containerRef}
        className="flex overflow-x-hidden pb-4 space-x-4 relative"
      >
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
                      onSubmitSuccess={() => {
                        if (onSubmitSuccess) onSubmitSuccess();
                        fetchNotesForDate(day.date);
                      }}
                      onDelete={() => {
                        if (onDelete) onDelete();
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
              {creatingDates[day.dateStr] ? (
                <NoteForm 
                  compact={true}
                  tags={tags}
                  date_of_note={day.date}
                  onSubmitSuccess={() => {
                    handleRefresh()
                    onSubmitSuccess();
                  }}
                  onClose={() => {
                    handleCloseForm(day.dateStr)
                  }}
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

      <button 
        className={`absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center z-10 transition-all duration-300 ${
          canScrollLeft 
            ? 'opacity-100 hover:bg-black/70 cursor-pointer' 
            : 'opacity-30 cursor-default'
        } ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => canScrollLeft && scrollToIndex(currentIndex - 1)}
        aria-label={chooseTextByLang("Предыдущий день", "Previous day", lang)}
      >
        &larr;
      </button>
      
      <button 
        className={`absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center z-10 transition-all duration-300 ${
          canScrollRight 
            ? 'opacity-100 hover:bg-black/70 cursor-pointer' 
            : 'opacity-30 cursor-default'
        } ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => canScrollRight && scrollToIndex(currentIndex + 1)}
        aria-label={chooseTextByLang("Следующий день", "Next day", lang)}
      >
        &rarr;
      </button>
    </div>
  );
}