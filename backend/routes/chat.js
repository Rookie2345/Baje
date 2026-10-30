const express = require('express');
const router = express.Router();
const { chatLimiter } = require('../middleware/rateLimit');
const { processMessage } = require('../services/conversation');

// POST /api/chat
router.post('/chat', chatLimiter, async (req, res) => {
  try {
    const { message, sessionId, history } = req.body;

    // Validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }
    if (message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }
    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message too long. Max 1000 characters.' });
    }
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'sessionId is required.' });
    }

    const cleanMessage = message.trim();
    const cleanSessionId = sessionId.slice(0, 64); // limit session ID length

    // Process through conversation engine
    const result = await processMessage(cleanSessionId, cleanMessage, history || []);

    return res.json({
      reply: result.reply,
      emotion: result.emotion || 'happy',
      source: result.source || 'local',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat route error:', error.message);
    return res.status(500).json({
      error: 'Baje is having trouble right now. Please try again!',
      reply: 'ए बाबु! अहिले अलि समस्या आयो। फेरि एकपटक प्रयास गर्नुस् है!'
    });
  }
});

// DELETE /api/chat/:sessionId - clear session
router.delete('/chat/:sessionId', (req, res) => {
  try {
    const { clearContext } = require('../services/context');
    clearContext(req.params.sessionId);
    res.json({ success: true, message: 'Session cleared.' });
  } catch (err) {
    res.status(500).json({ error: 'Could not clear session.' });
  }
});

module.exports = router;
