import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  const { title, content } = await request.json();

  const url = 'https://udimaxweb.com/blog/wp-json/wp/v2/posts';
  const username = process.env.WORDPRESS_USERNAME;
  const password = process.env.WORDPRESS_PASSWORD;
  const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

  const articleData = {
    title: title,
    content: content,
    status: 'publish',
  };


  try {
    const response = await axios.post(url, articleData, {
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 201) {
      return NextResponse.json({ message: 'Article published successfully', link: response.data.link }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Error publishing article', details: response.data }, { status: response.status });
    }
  } catch (error) {
    console.error('Error posting to WordPress:', error);
    return NextResponse.json({ error: 'Error posting to WordPress', details: error.message }, { status: 500 });
  }
}