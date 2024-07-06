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

    const articleObject = await generateResponse(socialMediaText, mediaUrls, language);

    console.log('Article on Server:', articleObject);

    return articleObject;
    
    
  } catch (error) {
    console.error('Error generating article:', error);
    throw new Error('Error generating article');
  }
}

async function generateResponse(socialMediaText, mediaUrls, language) {
  try {
    const thread = await openai.beta.threads.create();
    await addMessage(thread.id, socialMediaText, mediaUrls, language);
    const response = await runAssistant(thread.id);
    return response;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

async function addMessage(threadId, socialMediaText, mediaUrls, language) {
  try {
    let prompt;
    const mediaUrlsString = mediaUrls;
    
    switch(language) {
      case 'french':
        prompt = `Générez un article en français basé sur le tweet suivant : "${socialMediaText}" et les URLs des médias associés : ${mediaUrlsString}. Utilisez la structure JSON 1 pour la sortie.`;
        break;
      case 'both':
        prompt = `Generate articles in both English and French based on the following tweet: "${socialMediaText}" and the associated media URLs: ${mediaUrlsString}. Use JSON Structure 2 for output.`;
        break;
      case 'english':
      default:
        prompt = `Generate an article in English based on the following tweet: "${socialMediaText}" and the associated media URLs: ${mediaUrlsString}. Use JSON Structure 1 for output.`;
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