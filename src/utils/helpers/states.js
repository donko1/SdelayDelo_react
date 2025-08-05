export function removeFromState(setState, id, type = "base") {
  if (type === "base") {
    setState((prev) => {
      if (!prev?.results) return prev;

      const index = prev.results.findIndex((item) => item.id === id);
      if (index === -1) return prev;

      const newResults = [
        ...prev.results.slice(0, index),
        ...prev.results.slice(index + 1),
      ];

      return {
        ...prev,
        results: newResults,
        count: Math.max(0, prev.count - 1),
      };
    });
  } else if (type === "list") {
    setState((prev) => {
      if (!prev) return prev;

      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;

      const newResults = [...prev.slice(0, index), ...prev.slice(index + 1)];
      console.log(newResults);

      return [newResults];
    });
  } else if (type === "date") {
    setState((prev) => {
      if (!prev) return prev;

      let found = false;
      const newState = { ...prev };

      for (const date in newState) {
        const notes = newState[date];
        const index = notes.findIndex((note) => note.id === id);

        if (index !== -1) {
          newState[date] = [
            ...notes.slice(0, index),
            ...notes.slice(index + 1),
          ];
          found = true;
          break;
        }
      }

      return found ? newState : prev;
    });
  }
}
