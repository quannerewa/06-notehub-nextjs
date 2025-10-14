import { fetchNotes, FetchNotesResponse } from "@/lib/api"
import NotesClient from "./Notes.client"

export default async function Notes() {

    const initialPage = 1;
    const initialQuery = "";

    const initialData: FetchNotesResponse = await fetchNotes(initialPage, initialQuery);


    return <NotesClient initialPage={initialPage} initialData={initialData} initialQuery=""/>
}