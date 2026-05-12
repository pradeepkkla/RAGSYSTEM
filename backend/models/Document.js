const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['uploaded', 'processing', 'embedded', 'error'], default: 'uploaded' },
  metadata: { type: Object },
  
  // AI Analysis Fields
  summary: { type: String },
  keyPoints: [{ type: String }],
  topics: [{ type: String }],
  keywords: [{ type: String }],
  insights: { type: String },
  suggestedQuestions: [{ type: String }],
  category: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
