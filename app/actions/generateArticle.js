'use server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateArticle(socialMediaText, mediaUrls, language) {
  try {
    console.log('Text:', socialMediaText);
    console.log('Media URLs:', mediaUrls);
    console.log('Language:', language);

    let articleObject = {};

    switch (language) {
      case 'french':
        const frenchArticle = await generateFrenchArticle(socialMediaText, mediaUrls);
        articleObject = { fr: frenchArticle.fr };
        break;
      case 'english':
        const englishArticle = await generateEnglishArticle(socialMediaText, mediaUrls);
        articleObject = { en: englishArticle.en };
        break;
      case 'both':
        const frenchResult = await generateFrenchArticle(socialMediaText, mediaUrls);
        const englishResult = await generateEnglishFromFrench(socialMediaText, mediaUrls);
        articleObject = { 
          fr: frenchResult.fr,
          en: englishResult.en
        };
        break;
      default:
        throw new Error('Invalid language option');
    }

    console.log('Article on Server:', articleObject);

    return articleObject;
  } catch (error) {
    console.error('Error generating article:', error);
    throw new Error('Error generating article');
  }
}

async function generateFrenchArticle(socialMediaText, mediaUrls) {
  try {
    const thread = await openai.beta.threads.create();
    await addMessage(thread.id, socialMediaText, mediaUrls, 'french');
    const response = await runAssistant(thread.id);
    return response;
  } catch (error) {
    console.error('Error generating French article:', error);
    throw error;
  }
}

async function generateEnglishArticle(socialMediaText, mediaUrls) {
  try {
    const thread = await openai.beta.threads.create();
    await addMessage(thread.id, socialMediaText, mediaUrls, 'english');
    const response = await runAssistant(thread.id);
    return response;
  } catch (error) {
    console.error('Error generating English article:', error);
    throw error;
  }
}

async function generateEnglishFromFrench(socialMediaText, mediaUrls) {
  try {
    const thread = await openai.beta.threads.create();
    await addMessage(thread.id, socialMediaText, mediaUrls, 'english_from_french');
    const response = await runAssistant(thread.id);
    return response;
  } catch (error) {
    console.error('Error generating English article from French:', error);
    throw error;
  }
}

async function addMessage(threadId, content, mediaUrls, type) {
  try {
    let prompt;
    const mediaUrlsString = mediaUrls;
    
    switch(type) {
      case 'french':
        prompt = `Générez un article en français basé sur le tweet suivant : "${content}" et les URLs des médias associés : ${mediaUrlsString}. Utilisez la structure JSON suivante pour la sortie : { "fr": { "title": "Titre de l'article", "article": "Contenu de l'article avec des balises HTML pour la structure" } }`;
        break;
      case 'english':
        prompt = `Generate an article in English based on the following tweet: "${content}" and the associated media URLs: ${mediaUrlsString}. Target a UK audience. Use the following JSON structure for the output: { "en": { "title": "Article title", "article": "Article content with HTML tags for structure" } }`;
        break;
      case 'english_from_french':
        prompt = `Generate a COMPLETELY DIFFERENT article in English based on the core idea from this tweet: "${content}" and the associated media URLs: ${mediaUrlsString}. The article should have a different title, different h2 headings, and a completely different structure from a potential French version. Focus on creating unique content that would appeal to a UK audience and be optimized for Google SEO. DO NOT TRANSLATE any existing content. Instead, create an entirely new article that explores the same core topic but from a fresh perspective. Use the following JSON structure for the output: { "en": { "title": "Unique English article title", "article": "Unique English article content with HTML tags for structure" } }`;
        break;
      default:
        throw new Error('Invalid message type');
    }

    console.log(prompt);

    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: prompt,
    });
  } catch (error) {
    console.error('Error adding message:', error);
    throw error;
  }
}

async function runAssistant(threadId) {
  try {
    const assistantId = 'asst_WJH1uiwXjLmsg4uFFA4e1utc';
    let run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    while (run.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      run = await openai.beta.threads.runs.retrieve(threadId, run.id);
      console.log('Run status:', run.status);
    }

    const messages = await openai.beta.threads.messages.list(threadId);

    if (messages.data.length > 0) {
      const responseMessage = messages.data.find(msg => msg.role === 'assistant');
      if (responseMessage && responseMessage.content.length > 0) {
        return JSON.parse(responseMessage.content[0].text.value);
      } else {
        throw new Error('No response from the assistant.');
      }
    } else {
      throw new Error('No messages found.');
    }
  } catch (error) {
    console.error('Error running assistant:', error);
    throw error;
  }
}