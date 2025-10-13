import { useAuth } from "@/context/AuthContext";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addNoteToArchive,
  clearArchive,
  createNote,
  createNoteCompact,
  deleteNoteById,
  editNote,
  getAllNotesByUser,
  getArchivedNotesByUser,
  getMyDayByUser,
  getNotesByDate,
  hideNote,
  removeFromArchive,
  search,
  setNewDate,
  togglePin,
  undoHideNote,
} from "@utils/api/notes";
import { useToastHook } from "@hooks/useToast";
import { chooseTextByLang } from "@utils/helpers/locale";
import { useLang } from "@context/LangContext";
import { calculateDays } from "../helpers/date";

// TODO: сделай оптимистичные обновления без ре-фетчинга
// TODO: сделай onError и т.п.
export function useNotes(mode = "mutations", options = {}) {
  const { headers } = useAuth();
  const { showToast } = useToastHook();
  const { lang } = useLang();
  const queryClient = useQueryClient();

  const queryConfigs = {
    myDay: {
      queryKey: ["notes", "myDay"],
      queryFn: ({ pageParam }) =>
        pageParam
          ? fetch(pageParam, { headers }).then((res) => res.json())
          : getMyDayByUser(headers),
      getNextPageParam: (lastPage) => lastPage.next || undefined,
      initialPageParam: null,
    },
    allNotes: {
      queryKey: ["notes", "allNotes"],
      queryFn: ({ pageParam }) =>
        pageParam
          ? fetch(pageParam, { headers }).then((res) => res.json())
          : getAllNotesByUser(headers),
      getNextPageParam: (lastPage) => lastPage.next || undefined,
      initialPageParam: null,
    },

    next7Days: {
      queryKey: ["notes", "next7Days", options?.timezone, options?.lang],
      queryFn: async () => {
        const now = new Date();
        const days = calculateDays(now, 7, options?.lang, options?.timezone);

        const notesPromises = days.map((day) =>
          getNotesByDate(headers, day.date)
        );

        const notesResults = await Promise.all(notesPromises);

        return {
          days: days.map((day, index) => ({
            ...day,
            notes: notesResults[index]?.detail ? [] : notesResults[index] || [],
          })),
        };
      },
      staleTime: 2 * 60 * 1000,
    },
    calendar: {
      queryKey: ["notes", "calendar", options?.activeDate],
      queryFn: async () => {
        if (!options?.activeDate) return [];

        try {
          const results = await getNotesByDate(headers, options.activeDate);
          return results?.detail ? [] : results;
        } catch (error) {
          return [];
        }
      },
      enabled: !!options?.activeDate,
      staleTime: 2 * 60 * 1000,
    },
    archive: {
      queryKey: ["notes", "archive"],
      queryFn: ({ pageParam }) =>
        pageParam
          ? fetch(pageParam, { headers }).then((res) => res.json())
          : getArchivedNotesByUser(headers, 1),
      getNextPageParam: (lastPage) => lastPage.next || undefined,
      initialPageParam: null,
    },
    search: {
      queryKey: ["notes", "search", options?.query],
      queryFn: async () => {
        if (!options?.query) return { results: [] };
        const result = await search(headers, options.query);
        return result;
      },
      enabled: !!options?.query,
      staleTime: 2 * 60 * 1000,
    },
  };

  const infiniteQueryMyDay = useInfiniteQuery({
    ...queryConfigs.myDay,
    enabled: mode === "myDay",
  });

  const infiniteQueryAllNotes = useInfiniteQuery({
    ...queryConfigs.allNotes,
    enabled: mode === "allNotes",
  });

  const queryNext7Days = useQuery({
    ...queryConfigs.next7Days,
    enabled: mode === "next7Days",
  });

  const queryCalendar = useQuery({
    ...queryConfigs.calendar,
    enabled: mode === "calendar",
  });

  const infiniteQueryArchive = useInfiniteQuery({
    ...queryConfigs.archive,
    enabled: mode === "archive",
  });

  const querySearch = useQuery({
    ...queryConfigs.search,
    enabled: mode === "search",
  });

  let activeQuery = null;
  if (mode === "myDay") activeQuery = infiniteQueryMyDay;
  if (mode === "allNotes") activeQuery = infiniteQueryAllNotes;
  if (mode === "next7Days") activeQuery = queryNext7Days;
  if (mode === "calendar") activeQuery = queryCalendar;
  if (mode === "archive") activeQuery = infiniteQueryArchive;
  if (mode === "search") activeQuery = querySearch;

  const invalidateNotes = () => {
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  };

  const createNoteMutation = useMutation({
    mutationFn: ({ content }) => createNote(headers, content),
    onSuccess: () => {
      showToast(
        chooseTextByLang("Заметка создана!", "Note created!", lang),
        "success"
      );
      invalidateNotes();
    },
  });

  const pinNoteMutation = useMutation({
    mutationFn: ({ note }) => togglePin(headers, note),
    onSuccess: (date, { note }) => {
      showToast(
        chooseTextByLang(
          note.is_pinned ? "Заметка откреплена!" : "Заметка закреплена!",
          note.is_pinned ? "Note unpinned!" : "Note pinned!",
          lang
        ),
        "success"
      );
      invalidateNotes();
    },
  });

  const archiveNoteMutation = useMutation({
    mutationFn: ({ noteId }) => addNoteToArchive(headers, noteId),
    onSuccess: invalidateNotes,
  });

  const undoHideNoteMutation = useMutation({
    mutationFn: ({ noteId }) => undoHideNote(headers, noteId),
    onSuccess: invalidateNotes,
  });

  const deleteNoteFinalMutation = useMutation({
    mutationFn: ({ noteId }) => deleteNoteById(headers, noteId),
    onSuccess: invalidateNotes,
  });

  const deleteNoteMutation = useMutation({
    mutationFn: ({ noteId }) => hideNote(headers, noteId),
    onSuccess: (data, variables) => {
      const { noteId } = variables;
      invalidateNotes();

      showToast(
        chooseTextByLang("Заметка была удалена", "The note was deleted", lang),
        "delete",
        {
          onClose: async () => {
            await deleteNoteFinalMutation.mutateAsync({ noteId });
          },
          onUndo: async () => {
            await undoHideNoteMutation.mutateAsync({ noteId });
          },
        }
      );
    },
  });

  const editNoteMutation = useMutation({
    mutationFn: ({ noteId, content }) => editNote(headers, noteId, content),
    onSuccess: (data, variables) => {
      if (data?.detail?.includes("no changes")) {
        return;
      }
      showToast(
        chooseTextByLang("Заметка сохранена!", "Changes saved!", lang),
        "success"
      );
      invalidateNotes();
    },
  });

  const createNoteCompactMutation = useMutation({
    mutationFn: ({ title, day }) => createNoteCompact(headers, title, day),
    onSuccess: () => {
      showToast(
        chooseTextByLang("Заметка создана!", "Note created!", lang),
        "success"
      );
      invalidateNotes();
    },
  });

  const setNewDateNoteMutation = useMutation({
    mutationFn: ({ noteId, newDate }) => setNewDate(headers, noteId, newDate),
    onSuccess: invalidateNotes,
  });

  const removeFromArchiveMutation = useMutation({
    mutationFn: ({ noteId }) => removeFromArchive(noteId, headers),
    onSuccess: () => {
      showToast(
        chooseTextByLang("Заметка восстановлена!", "Note restored!", lang),
        "success"
      );
      invalidateNotes();
    },
  });

  const clearArchiveMutation = useMutation({
    mutationFn: () => clearArchive(headers),
    onSuccess: () => {
      showToast(
        chooseTextByLang("Архив очищен!", "Archive cleared!", lang),
        "success"
      );
      invalidateNotes();
    },
  });

  const result = {
    createNoteMutation,
    pinNoteMutation,
    archiveNoteMutation,
    setNewDateNoteMutation,
    deleteNoteMutation,
    editNoteMutation,
    createNoteCompactMutation,
    undoHideNoteMutation,
    deleteNoteFinalMutation,
    removeFromArchiveMutation,
    clearArchiveMutation,
    invalidateNotes,
  };

  if (activeQuery) {
    Object.assign(result, activeQuery);

    if (mode === "myDay" || mode === "allNotes" || mode === "archive") {
      const allPages = activeQuery.data?.pages || [];
      const allNotes = allPages.flatMap((page) => page.results || []);
      const totalCount = allPages[0]?.count || 0;

      result.notes = {
        results: allNotes,
        count: totalCount,
        next: allPages[allPages.length - 1]?.next || null,
      };
      result.allNotes = allNotes;
    } else if (mode === "next7Days") {
      result.notes = activeQuery.data;
      result.allNotes =
        activeQuery.data?.days?.flatMap((day) => day.notes) || [];
    } else if (mode === "calendar" || mode === "search") {
      result.notes = activeQuery.data;
      result.allNotes = activeQuery.data || [];
    }
  }

  return result;
}
