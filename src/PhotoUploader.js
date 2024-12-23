import React, { useState } from 'react';

const PhotoUploader = ({ onPhotoUploaded }) => {
    const [photo, setPhoto] = useState(null);
    const [caption, setCaption] = useState('');

    const handlePhotoChange = (e) => setPhoto(e.target.files[0]);
    const handleCaptionChange = (e) => setCaption(e.target.value);

    const handleUpload = async () => {
        if (!photo) {
            console.error('No photo selected!');
            return;
        }

        const formData = new FormData();
        formData.append('photo', photo);
        formData.append('caption', caption);

        try {
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Upload success:', result);
                onPhotoUploaded(result.photo);
            } else {
                console.error('Upload failed:', response.status);
            }
        } catch (error) {
            console.error('Error during upload:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handlePhotoChange} />
            <input
                type="text"
                placeholder="Caption"
                value={caption}
                onChange={handleCaptionChange}
            />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default PhotoUploader;
