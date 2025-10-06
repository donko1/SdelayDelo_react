import NoteFormCreate from "@components/notes/NoteForm/NoteFormCreate";
import NoteFormEdit from "@components/notes/NoteForm/NoteFormEdit";
import NoteFormCompact from "@components/notes/NoteForm/NoteFormCompact";

function NoteForm({ note, onClose, date_of_note, compact, day }) {
  const isEditing = !(note == null);

  if (compact) {
    return <NoteFormCompact onClose={onClose} day={day} />;
  }
  if (isEditing) {
    return <NoteFormEdit note={note} onClose={onClose} />;
  }
  return <NoteFormCreate onClose={onClose} date_of_note={date_of_note} />;
}

export default NoteForm;
