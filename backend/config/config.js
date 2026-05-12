// backend/config/config.js
require('dotenv').config();
module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  postgresUri: process.env.POSTGRES_URI,
  jwtSecret: process.env.JWT_SECRET,
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiBase: process.env.AZURE_OPENAI_API_BASE,
  azureOpenAIEmbeddingsModel: process.env.AZURE_OPENAI_EMBEDDINGS_MODEL,
  azureOpenAIChatModel: process.env.AZURE_OPENAI_CHAT_MODEL,
};
