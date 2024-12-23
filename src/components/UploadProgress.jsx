import React from 'react';

export function UploadProgress({ current, max }) {
  return (
    <div className="w-full">
      <p className="text-sm text-center text-gray-600">
        Photos Uploaded: {current}/{max}
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div
          className="bg-blue-500 h-2.5 rounded-full transition-all"
          style={{ width: `${(current / max) * 100}%` }}
        />
      </div>
    </div>
  );
}