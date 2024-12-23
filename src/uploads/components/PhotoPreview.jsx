import React from 'react';

export function PhotoPreview({ url }) {
  return (
    <div className="mt-4 text-center">
      <p className="text-sm text-gray-600 mb-2">Photo Preview</p>
      <img
        src={url}
        alt="Preview"
        className="max-w-xs max-h-64 rounded-lg shadow-md"
      />
    </div>
  );
}