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
        const englishResult = await generateEnglishFromFrench(frenchResult.fr);
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

async function generateEnglishFromFrench(frenchArticle) {
  try {
    const thread = await openai.beta.threads.create();
    await addMessage(thread.id, JSON.stringify(frenchArticle), '', 'english_from_french');
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
        prompt = `Générez un article en français basé sur le tweet suivant : "${content}" et les URLs des médias associés : ${mediaUrlsString}. Utilisez la structure JSON suivante pour la sortie : { "fr": { "title": "Titre de l'article", "article": "Contenu de l'article" } }`;
        break;
      case 'english':
        prompt = `Generate an article in English based on the following tweet: "${content}" and the associated media URLs: ${mediaUrlsString}. Target a UK audience. Use the following JSON structure for the output: { "en": { "title": "Article title", "article": "Article content" } }`;
        break;
      case 'english_from_french':
        prompt = `Generate a COMPLETELY DIFFERENT article structure in English based on the following French article: ${content}. The article should have a different structure for GOOGLE SEO purposes. DO NOT TRANSLATE. Target a UK audience. Use the following JSON structure for the output: { "en": { "title": "Article title", "article": "Article content" } }`;
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