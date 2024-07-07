import React from 'react';

const Card = ({ children, className }) => (
  <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="mb-4">
    {children}
  </div>
);

const CardContent = ({ children }) => (
  <div>
    {children}
  </div>
);

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">About Article Generator</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Our Mission</h2>
        </CardHeader>
        <CardContent>
          <p>Article Generator is designed to streamline the process of creating high-quality articles based on social media posts and media URLs. Our goal is to help content creators, marketers, and journalists quickly transform ideas and discussions from social platforms into well-structured, informative articles.</p>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold">How It Works</h2>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Input your social media post or media URL</li>
            <li>Choose your desired language (English or French)</li>
            <li>Set your preferred article length and tone</li>
            <li>Click generate and watch as AI crafts your article</li>
            <li>Review, edit, and publish your new content</li>
          </ol>
        </CardContent>
      </Card>
      
      {/* <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold">About the Creator</h2>
        </CardHeader>
        <CardContent>
          <p>Article Generator was created by Uditha Tennakoon, a passionate developer dedicated to making content creation more efficient and accessible. With a background in AI and natural language processing, Uditha aims to bridge the gap between social media engagement and long-form content.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Contact Us</h2>
        </CardHeader>
        <CardContent>
          <p>Have questions or feedback? We'd love to hear from you!</p>
          <p className="mt-2">Email: <a href="mailto:contact@articlegenerator.com" className="text-blue-600 hover:underline">contact@articlegenerator.com</a></p>
          <p>Twitter: <a href="https://twitter.com/articlegenerator" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@articlegenerator</a></p>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default AboutPage;
