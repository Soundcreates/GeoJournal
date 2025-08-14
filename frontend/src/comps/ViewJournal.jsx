import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
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

    const [likes, setLikes] = useState({
        count: 0,
        status: false
    });

    // Fetch comments
    const fetchComments = async () => {
        try {
            const response = await fetchStuff.get(`/comments/${entryId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            setViewComments(response.data.comments);
        } catch (err) {
            console.error("Error fetching comments:", err);
        }
    };

    // Fetch likes
    const fetchLikes = async () => {
        try {
            const response = await fetchStuff.get(`/users/fetchLikes/${entryId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });

            if (response.status === 200) {
                setLikes({
                    count: response.data.likesCount,
                    status: response.data.status
                });
            }
        } catch (err) {
            console.error("Error fetching likes:", err);
        }
    };

    // Fetch journal data
    const handleFetchJournalById = async () => {
        try {
            const response = await fetchStuff.get(`/journals/${entryId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = response.data.journalReq;
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

    useEffect(() => {
        fetchComments();
        fetchLikes();
        handleFetchJournalById();
    }, [entryId]);

    // Handle posting a comment
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

            if (response.status === 200) {
                setCommentText("");
                fetchComments();
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    // Handle like/unlike toggle
    const handleLike = async (id) => {
        try {
            const response = await fetchStuff.post(`/journals/add-like/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });

            if (response.status === 200) {
                setLikes({
                    count: response.data.likesCount,
                    status: response.data.status
                });
            }
        } catch (err) {
            console.error("Error toggling like:", err);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col md:flex-row bg-white text-black p-8 font-sans">
            {/* Left Panel */}
            <div className="md:w-1/2 w-full px-4">
                <h1 className="text-4xl font-extrabold mb-4 tracking-tight">{journal.title}</h1>
                <p className="text-gray-700 leading-relaxed mb-6">{journal.description}</p>
                {journal.aiCaption && (
                    <p className="italic text-sm text-gray-500 mb-8 border-l-4 border-black/10 pl-3">
                        {journal.aiCaption}
                    </p>
                )}

                {/* Like & Comment Buttons */}
                <div className="flex items-center gap-6 mb-6">
                    <button
                        onClick={() => handleLike(entryId)}
                        className={`flex items-center gap-2 ${likes.status ? 'bg-red-500' : 'bg-gray-300'} text-white px-4 py-2 rounded-full shadow hover:bg-gray-800 transition`}
                    >
                        <Heart size={20} /> <span>{likes.status ? 'Liked' : 'Like'}</span>
                    </button>
                    <span className="text-gray-700">{likes.count} {likes.count === 1 ? "like" : "likes"}</span>

                    <button
                        onClick={() => setOpenComment(prev => !prev)}
                        className="flex items-center gap-2 border border-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition"
                    >
                        <MessageCircle size={20} /> <span>Comment</span>
                    </button>
                </div>

                {/* Comment Input */}
                {openComment && (
                    <div className="border border-black/10 rounded-xl p-4 bg-gray-50 shadow-sm">
            <textarea
                placeholder="Write a comment..."
                className="w-full resize-none outline-none bg-transparent text-black placeholder-gray-500"
                rows="3"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
            ></textarea>
                        <button
                            className="mt-3 bg-black text-white px-4 py-1 rounded-full hover:bg-gray-800 transition"
                            onClick={handleSendComment}
                        >
                            Post
                        </button>
                    </div>
                )}
            </div>

            {/* Right Panel */}
            <div className="md:w-1/2 w-full px-4 mt-8 md:mt-0 flex flex-col items-center">
                {journal.imageUrl ? (
                    <img
                        src={journal.imageUrl}
                        alt="Journal"
                        className="rounded-2xl shadow-lg w-full max-w-lg object-cover border border-black/10"
                    />
                ) : (
                    <div className="text-gray-400 italic">No image available</div>
                )}
                <div className="mt-8 w-full">
                    <h2 className="text-2xl font-semibold mb-6">Comments</h2>
                    {viewComments.length > 0 ? (
                        <div className="space-y-4">
                            {viewComments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="bg-gray-100 rounded-xl p-4 shadow-sm border border-black/5"
                                >
                                    <div className="rounded-full flex gap-2 w-[32px] h-[32px]">
                                        <img src={comment.userId.avatar} alt={comment.userId.firstName} className="rounded-full w-full h-full object-cover" />
                                        <p className="font-semibold ">{comment.userId.firstName}</p>
                                    </div>
                                    <p className="text-gray-700 leading-snug">{comment.commentText}</p>
                                    <p>{new Date(comment.createdAt).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        second: 'numeric',
                                        hour12: true
                                    })}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No comments yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewJournal;
