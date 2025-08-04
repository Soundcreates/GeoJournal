import React, { useEffect, useState } from 'react'

import { fetchStuff } from '../service/api';

function ViewJournal({ entryId }) {
  const [journal, setJournal] = useState({
    title: "",
    description: "",
    imageUrl: "",
    aiCaption: "",
  });
  useEffect(() => {
    const handleFetchJournalById = async () => {
      try {
        const response = await fetchStuff.get(`/journals/${entryId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        const data = response.data.journalReq;
        console.log("Journal data:", data);
        setJournal({
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          aiCaption: data.aiCaption,

        });

      } catch (err) {
        console.error("Error fetching journal entry by ID:", err);
      }
    }

    handleFetchJournalById();

  }, [entryId]);

  return (
    <div className="w-full h-full flex">
      <div className="w-[50%]">
        {journal.title}
      </div>
      <div className="w-[50%]"></div>
    </div>
  )
}

export default ViewJournal