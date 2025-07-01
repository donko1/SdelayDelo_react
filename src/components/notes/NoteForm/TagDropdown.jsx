import { generateHeaders, getUser } from "@utils/api/auth";
import { addNewTag } from "@utils/api/tags";
import { chooseTextByLang, getOrSetLang } from "@utils/helpers/locale";
import { useState } from "react";

export default function TagDropdown({
  tags,
  selectedTags,
  refreshTags,
  handleTagToggle,
  variant,
}) {
  const handleAddTag = async (e) => {
    e.preventDefault();
    await addNewTag(newTag, generateHeaders(getUser()));
  };

  const lang = getOrSetLang();
  const [newTag, setNewTag] = useState("");
  if (variant === "edit") {
    return (
      <div className="absolute z-52 bg-white mt-[15px]">
        <div className="flex">
          <input
            className="rounded-[10px] border border-black p-[9px] flex-grow"
            value={newTag}
            placeholder={chooseTextByLang("Добавить тэг", "Add tag", lang)}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await handleAddTag(e);
                await refreshTags();
              }
            }}
          />
          <button
            onClick={async (e) => {
              await handleAddTag(e);
              await refreshTags();
            }}
            className="ml-2 px-3 bg-gray-200 rounded-[10px] hover:bg-green-500 transition-all transition-300"
          >
            {chooseTextByLang("Добавить", "Add", lang)}
          </button>
        </div>
        <div className="max-h-40 overflow-y-auto">
          {tags.map((tag) => (
            <div
              key={tag.id}
              onClick={() => handleTagToggle(tag.id)}
              className={`px-[9px] hover:bg-gray-100 transition-all transition-300 py-2 flex items-center cursor-pointer ${
                selectedTags.includes(tag.id) ? "bg-gray-100" : ""
              }`}
            >
              <span className="text-sm">
                #<span style={{ color: tag.colour }}>{tag.title}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
      <div className="max-h-40 overflow-y-auto">
        {tags.map((tag) => (
          <div
            key={tag.id}
            onClick={() => handleTagToggle(tag.id)}
            className={`px-4 py-2 flex items-center hover:bg-gray-100 transition-all transition-300 cursor-pointer ${
              selectedTags.includes(tag.id) ? "bg-gray-100" : ""
            }`}
          >
            <span className="text-sm">
              #<span style={{ color: tag.colour }}>{tag.title}</span>
            </span>
          </div>
        ))}
        <div className="flex">
          <input
            className="px-4 w-[75%] py-2 outline-0 flex items-center hover:bg-gray-100 transition-all transition-300 cursor-text"
            value={newTag}
            placeholder={chooseTextByLang("Добавить тэг", "Add tag", lang)}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await handleAddTag(e);
                await refreshTags();
              }
            }}
          />
          <button
            onClick={async (e) => {
              await handleAddTag(e);
              await refreshTags();
            }}
            className="bg-gray-200 rounded-[10px] p-2 hover:bg-green-500 transition-all transition-300"
          >
            {chooseTextByLang("Добавить", "Add", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
