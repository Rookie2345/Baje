// ============================================================
// BAJE AI — Optional AI Fallback Service
// ============================================================

const fetch = require('node-fetch');

const TIMEOUT_MS = 10000;
const MAX_HISTORY_MESSAGES = 6;

const BAJE_SYSTEM_PROMPT = `तिमी BAJE हौ — एउटा मजेदार, बुद्धिमान, माया गर्ने नेपाली हजुरबुवा। तिम्रो उमेर ७५ वर्ष छ। तिम्रो नाम BAJE हो।

तिम्रो व्यक्तित्व:
- मजेदार र हँसिलो, सधैँ सकारात्मक
- माया गर्ने र हेरचाह गर्ने
- कहिलेकाहीँ हल्का व्यङ्ग्यात्मक तर सधैँ मित्रवत्
- नेपाली संस्कृति, परम्परा र खानामा गर्व गर्ने
- जिन्दगीको अनुभवबाट सल्लाह दिने
- प्रविधिबारे थोरै अलमलिएको तर सिक्ने उत्सुक

तिमीले प्रयोग गर्ने अभिव्यक्तिहरू:
"ए बाबु!", "ल भन त!", "के छ खबर?", "हेर न बाबु...", "हौ!", "हाहा!", "त्यसो पो!", "ल राम्रो गर!", "के हो यस्तो बाबु!", "अनि के हुँदैछ आजकल?"

भाषाका नियमहरू:
- यदि प्रयोगकर्ताले नेपालीमा लेखे भने नेपालीमा जवाफ दे
- यदि romanized नेपालीमा लेखे भने conversational mix मा जवाफ दे
- यदि अंग्रेजीमा लेखे भने Nepali-English मिसाएर जवाफ दे
- किताबी भाषा नगर, everyday बोलचालको नेपाली प्रयोग गर

महत्त्वपूर्ण नियमहरू:
- हरेक जवाफ "ए बाबु" ले सुरु नगर — विविधता राख
- ४०-१२० शब्दमा जवाफ दे (धेरै लामो नगर)
- कहिलेकाहीँ स्वाभाविक रूपमा हल्का joke वा humor थप (तर हरेक पटक होइन)
- sensitive वा emotional कुरामा humor नथप
- ChatGPT जस्तो formal र robotic नसुनिनु — असली बाजे जस्तो सुनिनु`;

function isConfigured() {
  return !!(process.env.AI_API_KEY && process.env.AI_PROVIDER);
}

function getProvider() {
  return (process.env.AI_PROVIDER || '').toLowerCase();
}

/**
 * Call OpenAI API
 */
async function callOpenAI(message, history) {
  const messages = [
    { role: 'system', content: BAJE_SYSTEM_PROMPT },
    ...history.slice(-MAX_HISTORY_MESSAGES).map(h => ({
      role: h.role === 'assistant' ? 'assistant' : 'user',
      content: h.content
    })),
    { role: 'user', content: message }
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-3.5-turbo',
        messages,
        max_tokens: 250,
        temperature: 0.85
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error('Empty response from OpenAI');
    return reply;

  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

/**
 * Call Google Gemini API
 */
async function callGemini(message, history) {
  const model = process.env.AI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.AI_API_KEY}`;

  // Build contents array for Gemini
  const contents = [];

  // Add recent history
  const recentHistory = history.slice(-MAX_HISTORY_MESSAGES);
  for (const h of recentHistory) {
    contents.push({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    });
  }
  contents.push({ role: 'user', parts: [{ text: message }] });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: BAJE_SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          maxOutputTokens: 250,
          temperature: 0.85
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!reply) throw new Error('Empty response from Gemini');
    return reply;

  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

/**
 * Generate AI response with Baje personality.
 */
async function generateResponse(message, history = [], language = 'auto') {
  if (!isConfigured()) {
    throw new Error('AI provider not configured');
  }

  const provider = getProvider();

  try {
    let reply;
    if (provider === 'openai') {
      reply = await callOpenAI(message, history);
    } else if (provider === 'gemini') {
      reply = await callGemini(message, history);
    } else {
      throw new Error(`Unknown AI provider: ${provider}`);
    }

    // Detect emotion from reply
    let emotion = 'happy';
    if (/😂|हाहा|हाँस/.test(reply)) emotion = 'laughing';
    else if (/सल्लाह|सोच|बुझ/.test(reply)) emotion = 'advice';
    else if (/सोच्दैछ|हम्म/.test(reply)) emotion = 'thinking';

    return { reply, emotion, source: 'ai' };

  } catch (error) {
    console.error(`AI (${provider}) error:`, error.message);
    throw error;
  }
}

module.exports = { isConfigured, generateResponse, getProvider };
