import { useState } from "react";

export function useEditing(initialState = null) {
  const [editingNote, setEditingNote] = useState(initialState);

  const startEditing = (note) => {
    setEditingNote(note);
  };

  const stopEditing = () => {
    setEditingNote(null);
  };

  const isEditing = (noteId) => {
    return editingNote?.id === noteId;
  };

  return {
    editingNote,
    startEditing,
    stopEditing,
    setEditingNote,
    isEditing,
  };
}
