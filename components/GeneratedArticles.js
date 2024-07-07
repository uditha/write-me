import React, { useState } from 'react';

export default function GeneratedArticles({ englishArticle, frenchArticle, setPosted, setPostUrlEn, setPostUrlFr }) {
  const [loading, setLoading] = useState(false);

  const postToWordPress = async () => {
    setLoading(true);

    if (englishArticle) {
      let dataObject = {
        title: englishArticle.title,
        content: englishArticle.article,
      }

      if (englishArticle.media && englishArticle.media.length > 0) { 
        dataObject.imageUrl = englishArticle.media[0].media_url_https;
      } else {
        dataObject.imageUrl = null;
      }

      try {
        const response = await fetch('/api/post-to-wordpress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataObject),
        });
    
        const data = await response.json();
    
        if (response.ok) {
          console.log('Article published successfully!');
          console.log('View it at:', data.link);
          setPostUrlEn(data.link);
        } else {
          console.error('Error:', data.error);
          console.error(data.details);
        }
      } catch (error) {
        console.error('Error posting to WordPress:', error);
      }
    }  
    
    if (frenchArticle) {
      let dataObject = {
        title: frenchArticle.title,
        content: frenchArticle.article,
      }

      if (frenchArticle.media && frenchArticle.media.length > 0) { 
        dataObject.imageUrl = frenchArticle.media[0].media_url_https;
      } else {
        dataObject.imageUrl = null;
      }

      try {
        const response = await fetch('/api/post-to-wordpress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataObject),
        });
    
        const data = await response.json();
    
        if (response.ok) {
          console.log('Article published successfully!');
          console.log('View it at:', data.link);
          setPostUrlFr(data.link);
        } else {
          console.error('Error:', data.error);
          console.error(data.details);
        }
      } catch (error) {
        console.error('Error posting to WordPress:', error);
      }
    } 
    
    setPosted(true);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Generated Articles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className='flex flex-col gap-2'>
        {englishArticle && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className='text-sm'> English </h3>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{englishArticle.title}</h2>
          </div>
        )}
        {frenchArticle && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className='text-sm'> French </h3>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{frenchArticle.title}</h2>
          </div>
        )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700 mb-4">The article has been generated successfully. Press following button to upload them to your Blog</p>
        <button
          disabled={loading}
          onClick={postToWordPress}
          className="mt-4 p-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none disabled:bg-blue-300 w-full"
        >
          {loading ? 'Loading...' : 'Upload to Blog'}
        </button>
        </div>
      </div>
    </div>
  );
}