import React from 'react';

export default function PublishedArticle({ postUrlEn, postUrlFr }) {
  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Article Published</h1>
      {postUrlEn && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">English Article</h2>
          <p className="text-gray-700 mb-4">The article has been published successfully. You can view it at the following link:</p>
          <a href={postUrlEn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{postUrlEn}</a>
        </div>
      )}
      {postUrlFr && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">French Article</h2>
          <p className="text-gray-700 mb-4">The article has been published successfully. You can view it at the following link:</p>
          <a href={postUrlFr} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{postUrlFr}</a>
        </div>
      )}
    </div>
  );
}