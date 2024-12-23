import React from 'react';
import { Trash2, Download } from 'lucide-react';

export function PhotoCard({ photo, onDelete, onDownload }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform">
      <img
        src={photo.url}
        alt="Gallery"
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex justify-between">
        <button
          onClick={() => onDelete(photo.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDownload(photo.url)}
          className="text-blue-500 hover:text-blue-700"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}