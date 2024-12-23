import { useState } from 'react';

export function usePhotoUpload(maxPhotos) {
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (photos.length >= maxPhotos) {
      setMessage({ text: `You've reached the maximum of ${maxPhotos} photo uploads`, type: 'error' });
      return;
    }

    if (!selectedFile) {
      setMessage({ text: 'Please select a photo to upload', type: 'error' });
      return;
    }

    setIsUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      const newPhoto = {
        id: Math.random().toString(36).substring(7),
        url: previewUrl,
        uploadedAt: new Date(),
      };

      setPhotos(prev => [newPhoto, ...prev]);
      setMessage({ text: 'Photo uploaded successfully', type: 'success' });
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsUploading(false);
    }, 1000);
  };

  const handleDelete = (photoId) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    setMessage({ text: 'Photo deleted successfully', type: 'success' });
  };

  const handleDownload = (photoUrl) => {
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = 'photo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMessage({ text: 'Photo downloaded successfully', type: 'success' });
  };

  return {
    photos,
    selectedFile,
    previewUrl,
    isUploading,
    message,
    handleFileSelect,
    handleUpload,
    handleDelete,
    handleDownload,
  };
}