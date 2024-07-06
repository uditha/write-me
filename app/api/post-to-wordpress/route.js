import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { title, content, imageUrl } = await request.json();

  const baseUrl = 'https://udimaxweb.com/blog/wp-json/wp/v2';
  const username = process.env.WORDPRESS_USERNAME;
  const password = process.env.WORDPRESS_PASSWORD;
  const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

  try {
    // Step 1: Create the media item from the URL
    let imageId = null;
    if (imageUrl) {
      const mediaData = {
        url: imageUrl,
        status: 'publish'
      };

      const imageUploadResponse = await axios.post(`${baseUrl}/media`, mediaData, {
        headers: {
          'Authorization': auth,
          'Content-Type': 'application/json',
        },
      });

      if (imageUploadResponse.status === 201) {
        imageId = imageUploadResponse.data.id;
      } else {
        throw new Error('Failed to create media item from URL');
      }
    }

    // Step 2: Create the post
    const articleData = {
      title: title,
      content: content,
      status: 'publish',
      featured_media: imageId, // Set the created media item as the featured image
    };

    const postResponse = await axios.post(`${baseUrl}/posts`, articleData, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
    });

    if (postResponse.status === 201) {
      return NextResponse.json({ 
        message: 'Article published successfully', 
        link: postResponse.data.link,
        imageId: imageId 
      }, { status: 200 });
    } else {
      throw new Error('Error publishing article');
    }
  } catch (error) {
    console.error('Error posting to WordPress:', error);
    return NextResponse.json({ 
      error: 'Error posting to WordPress', 
      details: error.message 
    }, { status: 500 });
  }
}