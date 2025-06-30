import NoteCard from '@components/ui/NoteCard';
import TitleForBlock from '../ui/Title';

function ContentNotes({ notes, tags, editingNote, onEdit, onCloseEdit, onSubmitSuccess, onDelete, onArchivedSuccess, text, refreshTags }) {
  return (
    <div>
      {text && (
        <TitleForBlock text={text}/>
      )}
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
            refreshTags={refreshTags}
          />
        ))}
      </div>
    </div>
  );
}

export default ContentNotes;