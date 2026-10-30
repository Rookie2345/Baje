// ============================================================
// BAJE AI — Context & Session Manager
// ============================================================

const sessions = new Map();
const SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
const MAX_HISTORY = 20;

// Cleanup old sessions every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, ctx] of sessions.entries()) {
    if (now - ctx.lastActivity > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}, 30 * 60 * 1000);

function getContext(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      history: [],
      lastActivity: Date.now(),
      messageCount: 0,
      lastJokeMessage: -10, // allow joke from start
      languagePreference: 'auto',
      recentResponses: [], // track recent baje responses to avoid repetition
      userName: null
    });
  }
  return sessions.get(sessionId);
}

function updateContext(sessionId, userMsg, bajeReply, emotion) {
  const ctx = getContext(sessionId);
  ctx.history.push(
    { role: 'user', content: userMsg },
    { role: 'assistant', content: bajeReply }
  );
  ctx.messageCount++;
  ctx.lastActivity = Date.now();

  // Track recent responses to avoid repetition
  ctx.recentResponses.push(bajeReply);
  if (ctx.recentResponses.length > 5) ctx.recentResponses.shift();

  // Cap history size
  if (ctx.history.length > MAX_HISTORY * 2) {
    ctx.history = ctx.history.slice(-MAX_HISTORY);
  }
}

function clearContext(sessionId) {
  sessions.delete(sessionId);
}

function setLastJokeMessage(sessionId) {
  const ctx = getContext(sessionId);
  ctx.lastJokeMessage = ctx.messageCount;
}

function canTellJoke(sessionId) {
  const ctx = getContext(sessionId);
  return (ctx.messageCount - ctx.lastJokeMessage) >= 3;
}

function setLanguagePreference(sessionId, lang) {
  const ctx = getContext(sessionId);
  ctx.languagePreference = lang;
}

/**
 * Detect language from text.
 * Returns: 'nepali' | 'romanized' | 'english' | 'mixed'
 */
function detectLanguage(text) {
  const devanagariPattern = /[\u0900-\u097F]/;
  const hasDevanagari = devanagariPattern.test(text);

  // Common romanized Nepali words
  const romanizedNepaliWords = [
    'baje', 'hajurbuwa', 'namaste', 'kha', 'cha', 'chha', 'dai', 'didi',
    'bhai', 'bahini', 'aama', 'buwa', 'mero', 'timro', 'tapai', 'kasri',
    'kasto', 'ramro', 'khana', 'pani', 'ghar', 'sathi', 'jau', 'aau',
    'bhayo', 'chaina', 'huncha', 'haina', 'thik', 'sanchai', 'malai',
    'timile', 'garyo', 'ayo', 'gayo', 'garnu', 'kina', 'kasle', 'k cha',
    'ke cha', 'khai', 'natra', 'hola', 'hoina', 'ho', 'ni', 'ta', 'la'
  ];

  const lower = text.toLowerCase();
  const romanizedCount = romanizedNepaliWords.filter(w => lower.includes(w)).length;

  if (hasDevanagari) {
    const hasEnglishWords = /[a-zA-Z]{3,}/.test(text);
    return hasEnglishWords ? 'mixed' : 'nepali';
  }

  if (romanizedCount >= 2) return 'romanized';
  if (romanizedCount === 1) return 'mixed';
  return 'english';
}

module.exports = {
  getContext,
  updateContext,
  clearContext,
  setLastJokeMessage,
  canTellJoke,
  setLanguagePreference,
  detectLanguage
};
