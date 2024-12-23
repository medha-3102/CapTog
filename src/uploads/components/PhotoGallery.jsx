import React from 'react';
import { PhotoUpload } from './PhotoUpload';
import { PhotoGrid } from './PhotoGrid';
import { MessageAlert } from './MessageAlert';
import { usePhotoUpload } from '../hooks/usePhotoUpload';

export default function PhotoGallery({ maxPhotos = 5 }) {
  const {
    photos,
    selectedFile,
    previewUrl,
    isUploading,
    message,
    handleFileSelect,
    handleUpload,
    handleDelete,
    handleDownload,
  } = usePhotoUpload(maxPhotos);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Photo Gallery
        </h1>

        <PhotoUpload
          onFileSelect={handleFileSelect}
          onUpload={handleUpload}
          selectedFile={selectedFile}
          photosCount={photos.length}
          maxPhotos={maxPhotos}
          isUploading={isUploading}
          previewUrl={previewUrl}
        />

        <MessageAlert message={message} />

        <PhotoGrid
          photos={photos}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
}