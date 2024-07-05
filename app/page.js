'use client';
import React, { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { getSocialData } from '@/app/actions';
import Image from 'next/image';


const identifyPlatform = (url) => {
  if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
  if (url.includes('linkedin.com')) return 'LinkedIn';
  if (url.includes('facebook.com')) return 'Facebook';
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('reddit.com')) return 'Reddit';
  return null;
};

export default function Home() {
  const [socialUrl, setSocialUrl] = useState('');
  const [socialData, setSocialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');

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

  const handleGenerateArticle = async () => {
    console.log('Generating article...');
    console.log('Selected language:', selectedLanguage);
  }


  if (socialData) {
    return (
      <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Article Generation</h1>
        <div className='flex flex-row justify-between gap-3'>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 ml-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Source Text</h2>
          <p className="text-gray-700 mb-4">{socialData.text}</p>
          
          {socialData.media.map((media, index) => (
            media.type === 'photo' && (
              <div key={index} className="relative group">
                <img src={media.media_url_https} alt={`Tweet media ${index + 1}`} className="max-h-[200px] w-auto rounded-lg shadow-md transition-transform group-hover:scale-105" />
              </div>
            )
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Language Selection</h2>
          <RadioGroup value={selectedLanguage} onChange={setSelectedLanguage} className="space-y-2">
            <RadioGroup.Label className="sr-only">Language</RadioGroup.Label>
            <div className="flex space-x-4 items-center justify-start">
              {['english', 'french', 'both'].map((lang) => (
                <RadioGroup.Option
                  key={lang}
                  value={lang}
                  className={({ active, checked }) =>
                    `${active ? 'ring-2 ring-blue-500 ring-opacity-60 ring-offset-2' : ''}
                     ${checked ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'}
                     relative flex cursor-pointer rounded-lg px-5 py-3 shadow-md focus:outline-none transition-colors duration-200`
                  }
                >
                  {({ checked }) => (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium ${checked ? 'text-white' : 'text-gray-900'}`}
                          >
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                          </RadioGroup.Label>
                        </div>
                      </div>
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
          <div className='mt-5'>
          <button
            onClick={() => handleGenerateArticle(selectedLanguage)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <span>Generate Article</span>
          </button>
        </div>
        </div>

       
        </div>
      </div>
    );
  }


  return (
    <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center text-gray-800">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-blue-600">Social Media Text Fetcher</h1>
        <p className="mt-3 text-xl text-gray-700">Enter a social media URL to fetch its content</p>
        
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
        </form>
        
        {error && <p className="text-red-500 mt-2">{error}</p>}
        
        {socialData && (
          <div className="mt-4 p-4 border border-gray-300 rounded-md text-left">
            <h2 className="text-2xl font-bold mb-2">Fetched Data:</h2>
            <pre className="whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(socialData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}