import NoteFormCreate from "@components/notes/NoteForm/NoteFormCreate";
import NoteFormEdit from "@components/notes/NoteForm/NoteFormEdit";
import NoteFormCompact from "@components/notes/NoteForm/NoteFormCompact";

function NoteForm({ note, date_of_note, onClose, compact, day }) {
  const isEditing = !(note == null);

  if (compact) {
    return <NoteFormCompact day={day} onClose={onClose} />;
  }
  if (isEditing) {
    return <NoteFormEdit note={note} />;
  }
  return <NoteFormCreate date_of_note={date_of_note} />;
}

export default NoteForm;
