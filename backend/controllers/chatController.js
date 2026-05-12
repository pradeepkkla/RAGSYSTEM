const aiService = require('../services/aiService');
const axios = require('axios');

const FIREBASE_URL = 'https://ragsystem-7f08c-default-rtdb.firebaseio.com';

exports.askQuestion = async (req, res, next) => {
  try {
    const { question, chatId } = req.body;
    if (!question) return res.status(400).json({ success: false, message: 'Please provide a question' });

    let chat = null;
    let targetChatId = chatId;

    // Fetch existing chat if ID is provided
    if (chatId) {
      const chatRes = await axios.get(`${FIREBASE_URL}/chats/${chatId}.json`);
      if (!chatRes.data) return res.status(404).json({ success: false, message: 'Chat not found' });
      if (chatRes.data.userId !== req.user.id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
      chat = { _id: chatId, ...chatRes.data };
      if (!chat.messages) chat.messages = [];
    }

    let aiResponse = null;

    // Check Firebase Cache First (Take answer from Firebase if previously asked across ANY chat)
    try {
      const allChatsRes = await axios.get(`${FIREBASE_URL}/chats.json`);
      if (allChatsRes.data) {
        for (const [id, c] of Object.entries(allChatsRes.data)) {
          if (c && c.userId === req.user.id.toString() && c.messages) {
            const messageIndex = c.messages.findIndex(m => m.role === 'user' && m.content === question);
            if (messageIndex !== -1 && c.messages.length > messageIndex + 1) {
              aiResponse = c.messages[messageIndex + 1].content;
              console.log("Successfully took previous AI answer from Firebase Cache!");
              break; // Stop searching once found
            }
          }
        }
      }
    } catch (cacheErr) {
      console.error('Failed to check Firebase cache:', cacheErr.message);
    }

    // If chat is new, initialize it
    if (!chat) {
      targetChatId = `chat_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      chat = {
        _id: targetChatId,
        userId: req.user.id.toString(),
        title: question.substring(0, 50),
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    if (!aiResponse) {
      // 1. Fetch user documents text from Firebase Realtime Database
      let contextText = "";
      try {
        const response = await axios.get(`${FIREBASE_URL}/documents.json`);
        const allDocs = response.data;
        if (allDocs) {
          for (const [docId, docData] of Object.entries(allDocs)) {
            // Only use documents uploaded by this specific user
            if (docData && docData.uploadedBy === req.user.id.toString()) {
              contextText += `\n--- Document: ${docData.originalName} ---\n${docData.text}\n`;
            }
          }
        }
      } catch (fbError) {
        console.error('Failed to fetch from Firebase Realtime Database:', fbError.message);
      }

      // 2. Generate new response via AI
      const history = chat.messages.map(m => ({ role: m.role, content: m.content }));
      aiResponse = await aiService.generateResponse(question, contextText, history);
      console.log("Generated new answer via Gemini and will store in Firebase.");
    }

    // 3. Store AI answer in Firebase (Chat history)
    chat.messages.push({ role: 'user', content: question, createdAt: new Date().toISOString() });
    chat.messages.push({ role: 'assistant', content: aiResponse, createdAt: new Date().toISOString() });
    chat.updatedAt = new Date().toISOString();

    // Push updated chat object back to Firebase
    const firebasePayload = { ...chat };
    delete firebasePayload._id; // don't store the ID inside the payload body
    await axios.put(`${FIREBASE_URL}/chats/${targetChatId}.json`, firebasePayload);

    res.status(200).json({ success: true, data: { answer: aiResponse, chat } });
  } catch (err) {
    next(err);
  }
};

exports.getChats = async (req, res, next) => {
  try {
    const response = await axios.get(`${FIREBASE_URL}/chats.json`);
    let chats = [];
    if (response.data) {
      for (const [id, c] of Object.entries(response.data)) {
        if (c && c.userId === req.user.id.toString()) {
          // Format for frontend
          chats.push({ _id: id, ...c });
        }
      }
    }
    // Sort descending by updatedAt
    chats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    res.status(200).json({ success: true, data: chats });
  } catch (err) {
    next(err);
  }
};

exports.deleteChat = async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const chatRes = await axios.get(`${FIREBASE_URL}/chats/${chatId}.json`);
    
    if (!chatRes.data) return res.status(404).json({ success: false, message: 'Chat not found' });
    if (chatRes.data.userId !== req.user.id.toString() && req.user.role !== 'admin') {
       return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    await axios.delete(`${FIREBASE_URL}/chats/${chatId}.json`);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

exports.clearAllChats = async (req, res, next) => {
  try {
    const response = await axios.get(`${FIREBASE_URL}/chats.json`);
    if (response.data) {
      for (const [id, c] of Object.entries(response.data)) {
        if (c && c.userId === req.user.id.toString()) {
          await axios.delete(`${FIREBASE_URL}/chats/${id}.json`);
        }
      }
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

