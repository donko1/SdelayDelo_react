import NoteFormCreate from "@components/notes/NoteForm/NoteFormCreate";
import NoteFormEdit from "@components/notes/NoteForm/NoteFormEdit";
import NoteFormCompact from "@components/notes/NoteForm/NoteFormCompact";

function NoteForm({
  note,
  onClose,
  onSubmitSuccess,
  onArchivedSuccess,
  date_of_note,
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
        onClose={onClose}
        onSubmitSuccess={onSubmitSuccess}
        onArchivedSuccess={onArchivedSuccess}
      />
    );
  }
  return (
    <NoteFormCreate
      onClose={onClose}
      onSubmitSuccess={onSubmitSuccess}
      date_of_note={date_of_note}
    />
  );
}

export default NoteForm;
