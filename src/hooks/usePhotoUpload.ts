import { useState } from 'react';
import type { Photo, Message } from '../types';

export function usePhotoUpload(maxPhotos: number) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
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
      const newPhoto: Photo = {
        id: Math.random().toString(36).substring(7),
        url: previewUrl!,
        uploadedAt: new Date(),
      };

      setPhotos(prev => [newPhoto, ...prev]);
      setMessage({ text: 'Photo uploaded successfully', type: 'success' });
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsUploading(false);
    }, 1000);
  };

  const handleDelete = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    setMessage({ text: 'Photo deleted successfully', type: 'success' });
  };

  const handleDownload = (photoUrl: string) => {
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