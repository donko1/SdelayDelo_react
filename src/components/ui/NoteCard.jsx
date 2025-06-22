import React from 'react';
import NoteForm from '@components/ui/NoteForm';

const NoteCard = ({ 
  note, 
  tags, 
  onEdit, 
  isEditing,
  children,
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

  return (
    <div 
      onClick={() => onEdit(note)} 
      className="w-72 p-4 border-2 border-gray-300 rounded-lg hover:shadow-md cursor-pointer"
    >
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
      {children}
    </div>
  );
};

export default NoteCard;