import React from 'react';
import NoteForm from '@components/ui/NoteForm';
import { addNoteToArchive, deleteNoteById, togglePin } from '@/utils/api/notes';
import { generateHeaders, getUser } from '@/utils/api/auth';
import CheckIcon from "@assets/check.svg?react"
import CrossIcon from "@assets/cross.svg?react"
import PinIcon from "@assets/pin.svg?react"

const NoteCard = ({ 
  note, 
  tags, 
  onEdit, 
  isEditing,
  onCloseEdit,
  onSubmitSuccess,
  onDelete,
  onArchivedSuccess
}) => {
  if (isEditing) {
    return (
      <NoteForm
        note={note}
        tags={tags}
        onClose={onCloseEdit}
        onSubmitSuccess={onSubmitSuccess}
        onDeleteSuccess={onDelete}
        onArchivedSuccess={onArchivedSuccess}
      />
    );
  }

  const headers = generateHeaders(getUser())
  return (
    <div 
      onClick={() => onEdit(note)} 
      
      className="min-w-[295px] group left-0 top-[-0.11px] bg-Frame-color rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] border border-stone-300 cursor-pointer"
    >
      <div className="p-[17px] flex">
        <div 
          onClick={(e) => {
            e.stopPropagation();
            addNoteToArchive(note.id, headers);
            onArchivedSuccess();
          }} 
          className='relative z-3 w-7 h-7 left-0 top-0 opacity-70 rounded-full border-2 border-zinc-950 hover:opacity-100 group/archive'
        >
          <CheckIcon className='w-[100%] h-[100%] absolute text-black opacity-0 transition-opacity duration-300 delay-300 group-hover/archive:opacity-100'/>
        </div>
        <div className="ml-[1rem]">
          <h1 className="text-lg font-medium font-['Inter'] leading-relaxed">
            {note.title}
          </h1>
          <div className="flex flex-wrap max-w-[250px] gap-2 mt-5">
            {note.tags?.map((tagId) => {
              const tag = tags.find(t => t.id === tagId);
              return tag ? (
                <span
                  key={tag.id}
                  className="px-3 py-1 justify-start text-zinc-600 text-lg font-medium font-['Inter'] leading-relaxed"
                  style={{ color: tag.colour }}
                >
                   <span className='text-zinc-600'># </span>{tag.title}
                </span>
              ) : null;
            })}
          </div>
         </div>
         <div className="ml-[auto] flex">
          <CrossIcon 
            onClick={async (e) => {
              e.stopPropagation();
              await deleteNoteById(note.id, headers)
              onDelete()
            }} 
            className="m-1 transition-all duration-500 ease-in-out transform opacity-0 group-hover:opacity-100 hover:rotate-[360deg] hover:text-red-500"
          />
      <PinIcon 
        onClick={async (e) => {
          e.stopPropagation();
          await togglePin(note, headers)
          onSubmitSuccess()
        }} 
        className={`m-1 transition-all duration-300transform ${
          note.is_pinned 
            ? 'opacity-100 text-yellow-500 hover:text-black ' 
            : 'opacity-0 group-hover:opacity-100 hover:text-yellow-500 '
        } hover:animate-pulse`} 
        />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;