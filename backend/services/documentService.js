const pdfParse = require('pdf-parse');
const fs = require('fs');

exports.extractText = async (filePath, mimeType) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    
    if (mimeType === 'application/pdf') {
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (mimeType === 'text/plain') {
      return dataBuffer.toString('utf-8');
    }
    
    // Default fallback
    return dataBuffer.toString('utf-8');
  } catch (err) {
    console.error('Error extracting text', err);
    throw new Error('Failed to extract text from document');
  }
};

exports.chunkText = (text, chunkSize = 1000, overlap = 200) => {
  const words = text.split(/\s+/);
  const chunks = [];
  
  for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim().length > 0) {
      chunks.push(chunk);
    }
  }
  
  return chunks;
};
