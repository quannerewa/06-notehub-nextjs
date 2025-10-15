import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

export default async function Notes() {
  const initialPage = 1;
  const initialQuery = "";

  const queryClient = new QueryClient();

  // Префетчимо дані на сервері
  await queryClient.prefetchQuery({
    queryKey: ["notes", initialPage, initialQuery],
    queryFn: () => fetchNotes(initialPage, initialQuery),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient />
    </HydrationBoundary>
  );
}
