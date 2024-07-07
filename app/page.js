'use client';
import React, { useState } from 'react';
import SocialMediaForm from '@/components/SocialMediaForm';
import TextInputForm from '@/components/TextInputForm';
import ArticleGeneration from '@/components/ArticleGeneration';
import GeneratedArticles from '@/components/GeneratedArticles';
import PublishedArticle from '@/components/PublishedArticle';

export default function Home() {
  const [socialData, setSocialData] = useState(null);
  const [generatedArticles, setGeneratedArticles] = useState(null);
  const [englishArticle, setEnglishArticle] = useState(null);
  const [frenchArticle, setFrenchArticle] = useState(null);
  const [postUrlEn, setPostUrlEn] = useState(null);
  const [postUrlFr, setPostUrlFr] = useState(null);
  const [posted, setPosted] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);

  if (posted) {
    return <PublishedArticle postUrlEn={postUrlEn} postUrlFr={postUrlFr} />;
  }

  if (generatedArticles) {
    return (
      <GeneratedArticles 
        englishArticle={englishArticle}
        frenchArticle={frenchArticle}
        setPosted={setPosted}
        setPostUrlEn={setPostUrlEn}
        setPostUrlFr={setPostUrlFr}
      />
    );
  }

  if (socialData) {
    return (
      <ArticleGeneration 
        socialData={socialData}
        setGeneratedArticles={setGeneratedArticles}
        setEnglishArticle={setEnglishArticle}
        setFrenchArticle={setFrenchArticle}
      />
    );
  }

  return (
    <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center text-gray-800">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-blue-600">Social Media Text Fetcher</h1>
        <p className="mt-3 text-xl text-gray-700">
          {isTextInput 
            ? "Paste content from anywhere" 
            : "Enter a social media URL to fetch its content"}
        </p>
        
        <div className="mt-6 mb-4">
          <button
            onClick={() => setIsTextInput(!isTextInput)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Switch to {isTextInput ? "Social Media Link" : "Text Input"}
          </button>
        </div>
        
        {isTextInput ? (
          <TextInputForm setSocialData={setSocialData} />
        ) : (
          <SocialMediaForm setSocialData={setSocialData} />
        )}
      </div>
    </main>
  );
}