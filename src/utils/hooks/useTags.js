import { useAuth } from "@context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addNewTag, getAllTagsByUser } from "@utils/api/tags";

export function useTags() {
  const { headers } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["tags"],
    queryFn: () => getAllTagsByUser(headers),
  });

  const invalidateTags = () => {
    queryClient.invalidateQueries({ queryKey: ["tags"] });
  };

  const createTagMutation = useMutation({
    mutationFn: ({ newTagTitle }) => addNewTag(newTagTitle, headers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  return {
    tags: query.data || [],
    createTagMutation,
    invalidateTags,
  };
}
