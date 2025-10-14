"use client"

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes, FetchNotesResponse } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./page.module.css"


interface NotesClientProps {
  initialData: FetchNotesResponse;
  initialPage: number;
  initialQuery: string;
}

export default function NotesClient({initialData, initialPage, initialQuery}: NotesClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 300);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    updateSearchQuery(value);
  };
  
  const {data, isLoading} = useQuery<FetchNotesResponse>({
    queryKey: ["notes", currentPage, searchQuery],
    queryFn: () => fetchNotes(currentPage, searchQuery),
    placeholderData: keepPreviousData,
    initialData: currentPage === initialPage && searchQuery === initialQuery
    ? initialData : undefined,
  })

  const totalPages = data?.totalPages ?? 0;

  
  return (
    <div className={css.app}>
	    <header className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={handleSearchChange}/>
        {totalPages > 1 && (
        <Pagination totalNumberOfPages={totalPages} currentActivePage={currentPage} setPage={setCurrentPage} />)}
		    <button className={css.button} onClick={openModal}>Create note +</button>
      </header>

      {isLoading ? (
        <p className={css.loading}>Loading notes...</p>
      ) : (
        <NoteList notes={data?.notes ?? []} />
      )}
      {isModalOpen && ( <Modal onClose={closeModal}>
        <NoteForm onCloseModal={closeModal}/>
      </Modal>
      )}
  </div>
  )
}