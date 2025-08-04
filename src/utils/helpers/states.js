export function removeFromState(setState, id) {
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
}
