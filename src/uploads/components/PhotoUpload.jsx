import React from 'react';
import { Camera, Upload } from 'lucide-react';
import { UploadProgress } from './UploadProgress';
import { PhotoPreview } from './PhotoPreview';

export function PhotoUpload({
  onFileSelect,
  onUpload,
  selectedFile,
  photosCount,
  maxPhotos,
  isUploading,
  previewUrl,
}) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center mb-8 space-y-4">
      <div className="flex items-center gap-4">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Camera className="w-5 h-5 mr-2" />
            Choose Photo
          </span>
        </label>
        <button
          onClick={onUpload}
          disabled={!selectedFile || photosCount >= maxPhotos || isUploading}
          className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
        >
          <Upload className="w-5 h-5 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      <UploadProgress current={photosCount} max={maxPhotos} />

      {previewUrl && <PhotoPreview url={previewUrl} />}
    </div>
  );
}