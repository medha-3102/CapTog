import React from 'react';
import { Camera } from 'lucide-react';
import { PhotoCard } from './PhotoCard';

export function PhotoGrid({ photos, onDelete, onDownload }) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <Camera className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500">No photos uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onDelete={onDelete}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}