// Backend: Handle comments
socket.on('addComment', (data) => {
    io.emit('newComment', data);
});

// Frontend: Comment component
const CommentSection = ({ socket }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        socket.on('newComment', (commentData) => {
            setComments((prev) => [...prev, commentData]);
        });

        return () => {
            socket.off('newComment');
        };
    }, [socket]);

    const handleCommentSubmit = () => {
        const commentData = { user: 'User1', text: newComment };
        socket.emit('addComment', commentData);
        setNewComment('');
    };

    return (
        <div>
            {comments.map((comment, index) => (
                <p key={index}><strong>{comment.user}:</strong> {comment.text}</p>
            ))}
            <input 
                type="text" 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                placeholder="Add a comment"
            />
            <button onClick={handleCommentSubmit}>Submit</button>
        </div>
    );
};
