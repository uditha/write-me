import React, { useState } from 'react';
import { getSocialData } from '@/app/actions/getSocialData';

const identifyPlatform = (url) => {
  if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
  if (url.includes('linkedin.com')) return 'LinkedIn';
  if (url.includes('facebook.com')) return 'Facebook';
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('reddit.com')) return 'Reddit';
  return null;
};

export default function SocialMediaForm({ setSocialData }) {
  const [socialUrl, setSocialUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetSocialData = async (e) => {
    e.preventDefault();
    const platform = identifyPlatform(socialUrl);
    if (!platform) {
      setError('Unable to identify the social media platform from the URL');
      return;
    }
    setLoading(true);
    setError('');
    try {
      console.log(`Fetching ${platform} data...`);
      const data = await getSocialData(socialUrl, platform);
      console.log(data);
      setSocialData(data);
    } catch (err) {
      console.error('Error fetching social data:', err);
      setError('Failed to fetch social data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleGetSocialData} className="mt-6">
      <input
        type="text"
        value={socialUrl}
        onChange={(e) => setSocialUrl(e.target.value)}
        placeholder="Enter social media URL"
        className="p-4 border border-gray-300 rounded-md shadow-sm w-full focus:outline-none focus:border-blue-500"
      />
      <button
        type='submit'
        disabled={loading}
        className="mt-4 p-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none disabled:bg-blue-300 w-full"
      >
        {loading ? 'Loading...' : 'Get Social Media Content'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}