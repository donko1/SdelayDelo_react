import { createContext, useContext, useState } from "react";

const EditingContext = createContext();

export function EditingProvider({ children }) {
  const [editingNote, setEditingNote] = useState(null);

  const startEditing = (note) => setEditingNote(note);
  const stopEditing = () => setEditingNote(null);

  const isEditing = editingNote !== null;

  return (
    <EditingContext.Provider
      value={{ editingNote, startEditing, stopEditing, isEditing }}
    >
      {children}
    </EditingContext.Provider>
  );
}

export function useEditing() {
  return useContext(EditingContext);
}
