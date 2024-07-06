'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RadioGroup } from '@headlessui/react';
import { getSocialData } from '@/app/actions/getSocialData';
import { generateArticle } from '@/app/actions/generateArticle';


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
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [generatedArticles, setGeneratedArticles] = useState(null);
  const [englishArticle, setEnglishArticle] = useState(null);
  const [frenchArticle, setFrenchArticle] = useState(null);
  const [postUrlEn, setPostUrlEn] = useState(null);
  const [postUrlFr, setPostUrlFr] = useState(null);
  const [posted, setPosted] = useState(false);


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
    
    setPosted(true)
    setLoading(false);

  };



  useEffect(() => {
    if (englishArticle) {
      console.log('English Article:', englishArticle);
    }
  }, [englishArticle]);

  useEffect(() => {
    if (frenchArticle) {
      console.log('French Article:', frenchArticle);
    }
  }, [frenchArticle]);

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

      // const mediaUrls = socialData.media.map(media => media.media_url_https);
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

  

  if (posted) { 
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

  
  if (generatedArticles) {
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
      )
  }



  if (socialData) {
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