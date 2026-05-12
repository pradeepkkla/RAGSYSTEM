const axios = require('axios');

const getGeminiResponse = async (contents, responseMimeType = "text/plain") => {
  const apiKey = process.env.GEMINI_API_KEY;
  // Use gemini-2.5-flash natively for all tasks as the user's key has access to it
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2000,
      responseMimeType: responseMimeType
    }
  };

  const response = await axios.post(url, payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.data.candidates && response.data.candidates[0].content) {
    return response.data.candidates[0].content.parts[0].text;
  } else {
    throw new Error('Gemini returned an empty response or was blocked.');
  }
};

exports.generateResponse = async (question, context, history) => {
  try {
    const systemPrompt = `You are a highly intelligent and helpful AI assistant.

You have been provided with the user's uploaded document text below.
CRITICAL INSTRUCTION: You MUST carefully read the document text. If the user's question can be answered using the provided document, you MUST answer it using the information from the document. This is your highest priority.

If the user's question has absolutely nothing to do with the document, you should act like ChatGPT and answer it using your general AI knowledge.

Uploaded Document Text:
${context}`;

    // Map history to Gemini's expected format (role: 'user' or 'model')
    const contents = history
      .filter(m => m.content && m.content.trim() !== '')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    // Add the current prompt with context
    contents.push({
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\nQuestion: ${question}` }]
    });

    const answer = await getGeminiResponse(contents);
    return answer;
  } catch (error) {
    console.error('Gemini RAG Error:', error.response?.data || error.message);
    throw new Error(`Gemini API Error: ${error.response?.data?.error?.message || error.message}`);
  }
};

exports.analyzeDocument = async (documentText) => {
  try {
    const systemPrompt = `You are an expert AI document analyzer. You must analyze the provided document text and extract key information. 
Return your response ONLY as a raw JSON object with the following structure, and do not include markdown blocks or any other text:
{
  "summary": "A concise 2-3 sentence summary of the entire document",
  "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4"],
  "topics": ["Topic 1", "Topic 2", "Topic 3"],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "insights": "One smart AI insight or conclusion drawn from the document",
  "suggestedQuestions": ["A question the user could ask about this document", "Another question", "A third question"],
  "category": "The overall category/type of the document (e.g. Invoice, Report, Resume, Legal, Technical, General)"
}`;

    // Truncate document text if it's too long
    const textToAnalyze = documentText.length > 100000 ? documentText.slice(0, 100000) + '...' : documentText;

    const contents = [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nPlease analyze the following document text:\n\n${textToAnalyze}` }]
      }
    ];

    // Force application/json
    const responseText = await getGeminiResponse(contents, "application/json");
    
    try {
      const parsed = JSON.parse(responseText.trim());
      return parsed;
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON response:', responseText);
      throw new Error('AI returned malformed JSON');
    }
  } catch (error) {
    console.error('Gemini Analysis Error:', error.response?.data || error.message);
    throw new Error(`Failed to analyze document: ${error.message}`);
  }
};
