import NoteCard from '@components/ui/NoteCard';

function ContentNotes({ notes, tags, editingNote, onEdit, onCloseEdit, onSubmitSuccess, onDelete, onArchivedSuccess }) {
  return (
    <div className="flex flex-wrap gap-5">
      {notes?.results?.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          tags={tags}
          isEditing={editingNote?.id === note.id}
          onEdit={onEdit}
          onCloseEdit={onCloseEdit}
          onSubmitSuccess={onSubmitSuccess}
          onDelete={onDelete}
          onArchivedSuccess={onArchivedSuccess}
        />
      ))}
    </div>
  );
}

export default ContentNotes;