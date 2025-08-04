import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react'; // Icons for like & comment
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
          },
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
    };

    handleFetchJournalById();
  }, [entryId]);

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gray-50 p-6">
      {/* Left Panel: Text Info */}
      <div className="md:w-1/2 w-full px-4">
        <h1 className="text-3xl font-bold mb-2">{journal.title}</h1>
        <p className="text-gray-700 mb-4">{journal.description}</p>
        {journal.aiCaption && (
          <p className="italic text-sm text-blue-600 mb-6">AI Caption: {journal.aiCaption}</p>
        )}

        {/* Like & Comment Buttons */}
        <div className="flex items-center gap-6 mb-4">
          <button className="flex items-center gap-2 text-red-500 hover:text-red-600 transition">
            <Heart size={20} /> <span>Like</span>
          </button>
          <button className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition">
            <MessageCircle size={20} /> <span>Comment</span>
          </button>
        </div>

        {/* Static Comment Input */}
        <div className="border rounded-lg p-3 bg-white shadow-sm">
          <textarea
            placeholder="Write a comment..."
            className="w-full resize-none outline-none border-none"
            rows="3"
            disabled
          ></textarea>
          <button className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600" disabled>
            Post
          </button>
        </div>
      </div>

      {/* Right Panel: Image */}
      <div className="md:w-1/2 w-full px-4 mt-8 md:mt-0 flex justify-center items-center">
        {journal.imageUrl ? (
          <img
            src={journal.imageUrl}
            alt="Journal"
            className="rounded-lg shadow-lg w-full max-w-lg object-cover"
          />
        ) : (
          <div className="text-gray-400 italic">No image available</div>
        )}
      </div>
    </div>
  );
}

export default ViewJournal;
