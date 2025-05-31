import { useState } from "react";
import { generateHeaders, getUser } from "../utils/auth";
import { isParallel } from "../utils/settings";

function NoteForm({ note, tags, onClose, onSubmitSuccess }) {
    const [title, setTitle] = useState(note?.title || "");
    const [description, setDescription] = useState(note?.description || "");
    const [selectedTags, setSelectedTags] = useState(note?.tags || []);

    const handleTagToggle = (tagId) => {
        setSelectedTags(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const content = { title, description, tags: selectedTags };

        try {
            const headers = generateHeaders(getUser());
            const baseUrl = isParallel()
                ? "/api/v3/note/"
                : "http://localhost:8000/api/v3/note/";
            const url = note?.id ? `${baseUrl}${note.id}/` : baseUrl;
            const method = note?.id ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    ...headers,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(content),
            });

            if (!response.ok) throw new Error("Ошибка при отправке заметки");

            const updatedNote = await response.json();
            onSubmitSuccess(updatedNote);
            onClose();
        } catch (error) {
            console.error("Ошибка отправки заметки:", error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-4 w-full max-w-md p-4 border border-gray-300 rounded-lg bg-white space-y-4"
        >
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Заголовок"
                required
                className="w-full p-2 border border-gray-300 rounded"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Описание"
                rows={3}
                required
                className="w-full p-2 border border-gray-300 rounded"
            />
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagToggle(tag.id)}
                        className={`px-3 py-1 rounded-full text-sm text-white ${
                            selectedTags.includes(tag.id) ? "ring-2 ring-blue-600" : ""
                        }`}
                        style={{ backgroundColor: tag.colour }}
                    >
                        #{tag.title}
                    </button>
                ))}
            </div>
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-400 rounded"
                >
                    Отмена
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded"
                >
                    {note ? "Сохранить" : "Создать"}
                </button>
            </div>
        </form>
    );
}

export default NoteForm;
