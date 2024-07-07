// components/TextInputForm.js
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const isImageUrl = (url) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const extension = url.split('.').pop().toLowerCase();
  return imageExtensions.includes(extension);
};

const isVideoUrl = (url) => {
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
  const extension = url.split('.').pop().toLowerCase();
  return videoExtensions.includes(extension);
};

export default function TextInputForm({ setSocialData }) {
  const [socialDataFromTextInput, setSocialDataFromTextInput] = useState('');
  const [mediaLinks, setMediaLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addLink = () => {
    setMediaLinks([...mediaLinks, { media_url_https: '', type: '' }]);
  };

  const updateLink = (index, url) => {
    const newMediaLinks = [...mediaLinks];
    newMediaLinks[index] = {
      media_url_https: url,
      type: isImageUrl(url) ? 'photo' : isVideoUrl(url) ? 'video' : ''
    };
    setMediaLinks(newMediaLinks);
  };

  const handleSocialDataFromTextInput = () => {
    if (!socialDataFromTextInput) {
      setError('Please enter some text to generate an article');
      return;
    }
    setSocialData({
      text: socialDataFromTextInput,
      media: mediaLinks.filter(link => link.media_url_https !== '' && link.type !== '')
    });
  };

  return (
    <div>
      <textarea
        value={socialDataFromTextInput}
        onChange={(e) => setSocialDataFromTextInput(e.target.value)}
        placeholder="Paste social media content"
        className="p-4 border border-gray-300 rounded-md shadow-sm w-full focus:outline-none focus:border-blue-500 mt-2"
      />

      {mediaLinks.map((link, index) => (
        <div key={index} className="mt-2 flex items-center">
          <input
            type="text"
            value={link.media_url_https}
            onChange={(e) => updateLink(index, e.target.value)}
            placeholder="Enter image or video URL"
            className="p-2 border border-gray-300 rounded-md shadow-sm w-full focus:outline-none focus:border-blue-500"
          />
          <span className="ml-2 text-sm">
            {link.type ? `Detected: ${link.type}` : 'Type: Unknown'}
          </span>
        </div>
      ))}
      
      <button
        onClick={addLink}
        className="mt-2 p-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 focus:outline-none flex items-center justify-center w-full"
      >
        <PlusCircle className="mr-2" size={20} />
        Add Media Link
      </button>

      <button
        disabled={loading}
        onClick={handleSocialDataFromTextInput}
        className="mt-4 p-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none disabled:bg-blue-300 w-full"
      >
        {loading ? 'Loading...' : 'Generate Article'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}