import { useLang } from "@/context/LangContext";
import { chooseTextByLang } from "@/utils/helpers/locale";
import NoteCard from "@components/ui/NoteCard";
import TitleForBlock from "@components/ui/Title";

function ContentNotes({
  notes,
  tags,
  editingNote,
  onEdit,
  onCloseEdit,
  onSubmitSuccess,
  onDelete,
  onArchivedSuccess,
  text,
  refreshTags,
}) {
  const { lang } = useLang();
  return (
    <div className="h-full">
      {text && <TitleForBlock text={text} />}
      <div className="flex flex-wrap gap-5 mt-[40px]">
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
      {notes.count === 0 && (
        <div class="fixed inset-0 ml-[300px] flex justify-center items-center pointer-events-none">
          <div class="pointer-events-auto">
            <div className="flex justify-center ">
              <img
                src="/images/content-notes/no_notes_base.svg"
                alt="No notes"
              />
            </div>
            <h1 className="text-black/60 text-center text-3xl font-medium font-['Inter'] mt-[30px]">
              {chooseTextByLang(
                "У вас пока что нет заметок",
                "You don't have any notes yet",
                lang
              )}
            </h1>
            <h2 className="text-neutral-600/60 text-center text-2xl font-normal font-['Inter'] mt-[7px]">
              {chooseTextByLang(
                "Начните с создания первой!",
                "Start by creating your first one!",
                lang
              )}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContentNotes;
