import NoteForm from "./NoteForm";

function ContentNotes({ notes, tags, editingNote, onEdit, onCloseEdit, onSubmitSuccess, onDelete, onArchivedSuccess }) {
    return (
        <div className="flex flex-wrap gap-5">
            {notes?.results?.map((note) => (
                <div
                    key={note.id}
                    className="w-72 p-4 border-2 border-gray-300 rounded-lg hover:shadow-md"
                >
                    {editingNote?.id === note.id ? (
                        <NoteForm
                            note={note}
                            tags={tags}
                            onClose={onCloseEdit}
                            onSubmitSuccess={onSubmitSuccess}
                            onDeleteSuccess={(deletedId) => {
                                onDelete(deletedId); 
                            }}
                            onArchivedSuccess={onArchivedSuccess}
                        />
                    ) : (
                        <div onClick={() => onEdit(note)} className="cursor-pointer">
                            <h1 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-200">
                                {note.title}
                            </h1>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {note.tags?.map((tagId) => {
                                    const tag = tags.find(t => t.id === tagId);
                                    return tag ? (
                                        <span
                                            key={tag.id}
                                            className="px-3 py-1 rounded text-xs text-white"
                                            style={{ backgroundColor: tag.colour }}
                                        >
                                            #{tag.title}
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ContentNotes;
