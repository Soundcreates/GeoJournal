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
  const [openComment, setOpenComment] = useState(false);
  const [viewComments, setViewComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const fetchComments = async () => {
    try {
      const response = await fetchStuff.get(`/comments/${entryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      setViewComments(response.data.comments);
      console.log("Fetched comments: ", response.data.comments);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  }


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
    fetchComments();
  }, [entryId]);

  const handleSendComment = async () => {
    try {
      const response = await fetchStuff.post('/comments', {
        journalId: entryId,
        commentText,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      setCommentText("");
      fetchComments();

      if (response.status === 200) {
        console.log("Comment added successfully");
      }
    } catch (err) {
      console.error(err.message);
    }
  }
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
          <button onClick={() => setOpenComment(prev => !prev)} className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition">


            <MessageCircle size={20} /> <span>Comment</span>


          </button>
        </div>

        {/* Static Comment Input */}
        {openComment && (
          <div className="border rounded-lg p-3 bg-white shadow-sm">
            <textarea
              placeholder="Write a comment..."
              className="w-full resize-none outline-none border-none"
              rows="3"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            ></textarea>
            <button className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600" onClick={handleSendComment}>
              Post
            </button>
          </div>
        )}

      </div>

      {/* Right Panel: Image */}
      <div className="md:w-1/2 w-full px-4 mt-8 md:mt-0 flex flex-col justify-center items-center">
        {journal.imageUrl ? (
          <img
            src={journal.imageUrl}
            alt="Journal"
            className="rounded-lg shadow-lg w-full max-w-lg object-cover"
          />
        ) : (
          <div className="text-gray-400 italic">No image available</div>
        )}
        <div>
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          {viewComments.map(comment => (
            <div key={comment.id} className="border-b py-2">
              <p className="font-semibold">{comment.userId.name}</p>
              <p>{comment.commentText}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewJournal;
