# Enterprise RAG Framework Backend

This is a scalable enterprise-level REST API backend for an AI-powered RAG (Retrieval-Augmented Generation) chatbot system using Azure OpenAI, Node.js, Express, and MongoDB.

## Features
- **Authentication**: JWT based, role-based access control (Admin/User).
- **File Uploads**: Secure document uploads with Multer.
- **Processing**: Extracts text from PDFs/Text files and chunks them.
- **Embeddings & Vector Search**: Integrates with Azure OpenAI for embeddings and implements cosine similarity search.
- **AI Chatbot**: Context-aware RAG pipeline feeding into Azure OpenAI Chat Completion.
- **Security**: Rate limiting, Helmet headers, CORS.

## Environment Variables
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/enterprise-rag
JWT_SECRET=your_jwt_secret
AZURE_OPENAI_API_KEY=your_api_key
AZURE_OPENAI_API_BASE=https://your-resource.openai.azure.com/
AZURE_OPENAI_EMBEDDINGS_MODEL=text-embedding-ada-002
AZURE_OPENAI_CHAT_MODEL=gpt-4
```

## Setup & Run
1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

## Folder Structure
- `/config`: Database and env configs
- `/controllers`: API route logic
- `/middleware`: Auth, Upload, Error Handling, Rate Limiting
- `/models`: Mongoose schemas (User, Document, Chat, Log)
- `/routes`: Express route definitions
- `/services`: Core logic (AI, Vector Store, Document Processing)
- `/uploads`: Static storage for uploaded files
