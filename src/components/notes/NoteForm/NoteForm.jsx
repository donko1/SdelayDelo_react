import NoteFormCreate from "@components/notes/NoteForm/NoteFormCreate";
import NoteFormEdit from "@components/notes/NoteForm/NoteFormEdit";

function NoteForm({
  note,
  tags,
  onClose,
  onSubmitSuccess,
  onArchivedSuccess,
  date_of_note,
  refreshTags,
}) {
  const isEditing = !(note == null);

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
      isEditing={isEditing}
      onSubmitSuccess={onSubmitSuccess}
      date_of_note={date_of_note}
    />
  );
}

export default NoteForm;
