import NoteFormCreate from "@components/notes/NoteForm/NoteFormCreate";
import NoteFormEdit from "@components/notes/NoteForm/NoteFormEdit";
import NoteFormCompact from "@components/notes/NoteForm/NoteFormCompact";

function NoteForm({
  note,
  tags,
  onClose,
  onSubmitSuccess,
  onArchivedSuccess,
  date_of_note,
  refreshTags,
  compact,
  day,
}) {
  const isEditing = !(note == null);

  if (compact) {
    return (
      <NoteFormCompact
        onClose={onClose}
        onSubmitSuccess={onSubmitSuccess}
        day={day}
      />
    );
  }
  if (isEditing) {
    return (
      <NoteFormEdit
        note={note}
        tags={tags}
        onClose={onClose}
        onSubmitSuccess={onSubmitSuccess}
        onArchivedSuccess={onArchivedSuccess}
        refreshTags={refreshTags}
      />
    );
  }
  return (
    <NoteFormCreate
      tags={tags}
      onClose={onClose}
      refreshTags={refreshTags}
      onSubmitSuccess={onSubmitSuccess}
      date_of_note={date_of_note}
    />
  );
}

export default NoteForm;
