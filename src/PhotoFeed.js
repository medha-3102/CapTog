const PhotoFeed = ({ photos }) => {
    if (!photos || photos.length === 0) {
        return <p>No photos to display.</p>;
    }

    return (
        <div>
            <h2>Photo Feed</h2>
            {photos.map((photo, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                    {photo.filePath ? (
                        <img
                            src={photo.filePath}
                            alt="Uploaded"
                            style={{ width: '300px', height: 'auto' }}
                        />
                    ) : (
                        <p>Photo URL is missing.</p>
                    )}
                    <p>{photo.caption || 'No caption provided.'}</p>
                    <small>
                        {photo.timestamp
                            ? new Date(photo.timestamp).toLocaleString()
                            : 'Timestamp not available.'}
                    </small>
                </div>
            ))}
        </div>
    );
};
export default PhotoFeed;