import React from 'react';

export function MessageAlert({ message }) {
  if (!message) return null;

  return (
    <div
      className={`mb-6 p-4 rounded-lg text-center ${
        message.type === 'success'
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      }`}
    >
      {message.text}
    </div>
  );
}