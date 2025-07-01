import { useEffect, useRef, useState } from "react";
import { generateHeaders, getUser } from "@utils/api/auth";
import { isParallel } from "@utils/helpers/settings";
import { addNoteToArchive, deleteNoteById, setNewDate } from "@utils/api/notes";
import {
  chooseTextByLang,
  getOrSetLang,
  getOrSetUTC,
} from "@/utils/helpers/locale";
import CrossIcon from "@assets/cross.svg?react";
import MyDayIcon from "@assets/myDay.svg?react";
import NextWeekIcon from "@assets/nextWeek.svg?react";
import ArchiveIcon from "@assets/archive.svg?react";
import CalendarIcon from "@assets/calendar.svg?react";
import HashtagIcon from "@assets/Hashtag.svg?react";
import { addNewTag } from "@/utils/api/tags";
import { useActElemContext } from "@context/ActElemContext";
import CalendarForNoteForm from "@components/notes/NoteForm/Calendar";
import TagDropdown from "./TagDropdown";
import DateDisplay from "./DateDisplay";
import NoteFormCreate from "./NoteFormCreate";
import { getTodayInTimezone } from "@/utils/helpers/date";
import NoteFormEdit from "./NoteFormEdit";

function NoteForm({
  note,
  tags,
  onClose,
  onSubmitSuccess,
  onDeleteSuccess,
  onArchivedSuccess,
  date_of_note,
  refreshTags,
}) {
  const [title, setTitle] = useState(note?.title || "");
  const [description, setDescription] = useState(note?.description || "");
  const [selectedTags, setSelectedTags] = useState(note?.tags || []);
  const [newTag, setNewTag] = useState("");
  const isEditing = !(note == null);
  const titleTextareaRef = useRef(null);
  const descriptionTextareaRef = useRef(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(() => {
    if (note?.date_of_note) {
      const [day, month, year] = note.date_of_note.split("/").map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date();
  });
  const [currentNoteDate, setCurrentNoteDate] = useState(
    note?.date_of_note || null
  );

  const onCloseEdit = async () => {};

  if (isEditing) {
    return (
      <NoteFormEdit
        note={note}
        tags={tags}
        onClose={onClose}
        onSubmitSuccess={onSubmitSuccess}
        onDeleteSuccess={onDeleteSuccess}
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
