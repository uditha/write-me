import React, { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { generateArticle } from '@/app/actions/generateArticle';

function generateMediaText(socialData) {
  const photos = [];
  const videos = [];

  socialData.media.forEach(media => {
    if (media.type === 'photo') {
      photos.push(`![Image](${media.media_url_https})`);
    } else if (media.type === 'video') {
      videos.push(`[Video](${media.media_url_https})`);
    }
  });

  let content = '';
  
  if (photos.length > 0) {
    content += 'Here are some images for you to analyze:\n';
    photos.forEach((photo, index) => {
      content += `${index + 1}. ${photo}\n`;
    });
  }

  if (videos.length > 0) {
    if (content.length > 0) content += '\n';  // Add a newline if there are photos
    content += 'Here are some video links:\n';
    videos.forEach((video, index) => {
      content += `${index + 1}. ${video}\n`;
    });
  }

  return content;
}

export default function ArticleGeneration({ socialData, setGeneratedArticles, setEnglishArticle, setFrenchArticle }) {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateArticle = async () => {
    if (!socialData) {
      setError('Please fetch social media data first.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      console.log('Generating article...');
      console.log('Selected language:', selectedLanguage);

      const mediaUrls = generateMediaText(socialData);
      const articles = await generateArticle(socialData.text, mediaUrls, selectedLanguage);

      if (selectedLanguage === 'english') {
        setEnglishArticle(articles['en']);
        setFrenchArticle(null);
      } else if (selectedLanguage === 'french') {
        setFrenchArticle(articles['fr']);
        setEnglishArticle(null);
      } else {
        setEnglishArticle(articles['en']);
        setFrenchArticle(articles['fr']);
      }

      setGeneratedArticles(true);
    } catch (err) {
      console.error('Error generating article:', err);
      setError(err.message || 'Failed to generate article. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Article Generation</h1>
      <div className='flex flex-row justify-between gap-2'>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 ml-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Source Text</h2>
          <p className="text-gray-700 mb-4">{socialData.text}</p>
          <div className='flex flex-row gap-3'>
            {socialData.media.map((media, index) => (
              media.type === 'photo' && (
                <div key={index} className="relative group">
                  <img src={media.media_url_https} alt={`Tweet media ${index + 1}`} className="max-h-[200px] w-auto rounded-lg shadow-md transition-transform group-hover:scale-105" />
                </div>
              )
            ))}
          </div>
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
              disabled={loading}
              onClick={handleGenerateArticle}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 w-full disabled:bg-blue-300 sm:w-auto"
            >
              <span>
                { loading ? 'Loading...' : 'Generate Article' }
              </span>
            </button>
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}