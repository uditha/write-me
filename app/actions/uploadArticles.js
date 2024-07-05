'use server'
import axios from 'axios';

export async function uploadToBlog(englishArticle, frenchArticle) {

    const url = 'https://udimaxweb.com/blog/wp-json/wp/v2';
    const username = 'udimax';
    const password = 'Harangala@13';
    const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

    const articleData = {
        title: englishArticle.title,
        content: englishArticle.article,
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
          console.log('Article published successfully!');
          console.log('View it at:', response.data);
        } else {
          console.error('Error:', response.status);
          console.error(response.data);
        }
      } catch (error) {
        console.error('Error posting to WordPress:', error);
      }
}