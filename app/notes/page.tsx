import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { fetchNotes, FetchNotesResponse } from "@/lib/api";
import NotesClient from "./Notes.client";

export default async function Notes() {
  const initialPage = 1;
  const initialQuery = "";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", initialPage, initialQuery],
    queryFn: () => fetchNotes(initialPage, initialQuery),
  });

  const dehydratedState = dehydrate(queryClient);
  const initialData = queryClient.getQueryData<FetchNotesResponse>([
    "notes",
    initialPage,
    initialQuery,
  ]);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient
        initialPage={initialPage}
        initialQuery={initialQuery}
        initialData={initialData!}
      />
    </HydrationBoundary>
  );
}

