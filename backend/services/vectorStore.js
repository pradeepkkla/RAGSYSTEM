// In-memory fallback for vectors using basic text overlap scoring
let vectors = [];

exports.storeChunks = async (chunks, metadata) => {
  for (const chunk of chunks) {
    vectors.push({
      id: Math.random().toString(36).substring(7),
      text: chunk,
      metadata: metadata
    });
  }
};

exports.search = async (query, limit = 5) => {
  // Simple keyword matching for MVP
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  
  const results = vectors.map(v => {
    let score = 0;
    const textLower = v.text.toLowerCase();
    for (const word of queryWords) {
      if (textLower.includes(word)) {
        score += 1;
      }
    }
    return { ...v, score };
  }).filter(v => v.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);

  // If no direct matches, return recent chunks as fallback
  if (results.length === 0) {
    return vectors.slice(-limit).map(v => ({...v, score: 0}));
  }

  return results;
};

exports.deleteByDocumentId = async (documentId) => {
  vectors = vectors.filter(v => v.metadata.documentId !== documentId);
};
