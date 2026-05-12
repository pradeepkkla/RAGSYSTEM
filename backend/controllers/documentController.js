const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');
const documentService = require('../services/documentService');
const vectorStore = require('../services/vectorStore');
const aiService = require('../services/aiService');

exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const doc = await Document.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.id,
      status: 'uploaded'
    });

    // Start processing async
    processDocumentAsync(doc, req.file.path);

    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

const processDocumentAsync = async (doc, filePath) => {
  try {
    doc.status = 'processing';
    await doc.save();

    // Extract text
    const text = await documentService.extractText(filePath, doc.mimeType);
    
    // Save entire extracted text to Firebase Realtime Database directly
    try {
      const axios = require('axios');
      const firebaseUrl = `https://ragsystem-7f08c-default-rtdb.firebaseio.com/documents/${doc._id}.json`;
      await axios.put(firebaseUrl, {
        text: text,
        uploadedBy: doc.uploadedBy.toString(),
        originalName: doc.originalName,
        createdAt: new Date().toISOString()
      });
      console.log('Document text successfully synced to Firebase Realtime Database!');
    } catch (fbError) {
      console.error('Failed to sync document to Firebase Realtime Database:', fbError.message);
    }

    // Analyze full document with OpenRouter AI
    try {
      const aiAnalysis = await aiService.analyzeDocument(text);
      doc.summary = aiAnalysis.summary;
      doc.keyPoints = aiAnalysis.keyPoints;
      doc.topics = aiAnalysis.topics;
      doc.keywords = aiAnalysis.keywords;
      doc.insights = aiAnalysis.insights;
      doc.suggestedQuestions = aiAnalysis.suggestedQuestions;
      doc.category = aiAnalysis.category;
    } catch (analysisErr) {
      console.error('Failed to generate AI analysis, but document is stored:', analysisErr.message);
    }

    doc.status = 'embedded';
    await doc.save();
  } catch (err) {
    console.error('Error processing document:', err);
    doc.status = 'error';
    await doc.save();
  }
};

exports.getDocuments = async (req, res, next) => {
  try {
    const docs = await Document.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: docs });
  } catch (err) {
    next(err);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    
    if (doc.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this document' });
    }

    // Remove from Firebase Realtime Database
    try {
      const axios = require('axios');
      const firebaseUrl = `https://ragsystem-7f08c-default-rtdb.firebaseio.com/documents/${doc._id}.json`;
      await axios.delete(firebaseUrl);
      console.log('Document text successfully deleted from Firebase!');
    } catch (fbError) {
      console.error('Failed to delete document from Firebase:', fbError.message);
    }
    
    // Remove file
    const filePath = path.join(__dirname, '..', 'uploads', doc.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await doc.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
