// ============================================================
// BAJE AI — Chat Module
// ============================================================

const Chat = (() => {
  let sessionId = generateSessionId();
  let messageHistory = [];
  let isBusy = false;
  let messageCount = 0;

  function generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }

  // ---- Initialize ----
  function init() {
    const input    = document.getElementById('chat-input');
    const sendBtn  = document.getElementById('send-btn');
    const clearBtn = document.getElementById('clear-chat-btn');

    if (!input || !sendBtn) return;

    // Send on Enter (not Shift+Enter)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Auto-resize textarea
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
      updateCharCount(input.value.length);
    });

    // Buttons
    sendBtn.addEventListener('click', sendMessage);
    if (clearBtn) clearBtn.addEventListener('click', clearChat);

    // Quick starters
    document.querySelectorAll('.starter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const msg = btn.dataset.message;
        if (!msg) return;
        const inp = document.getElementById('chat-input');
        inp.value = msg;
        inp.style.height = 'auto';
        updateCharCount(msg.length);
        sendMessage();
        scrollToChat();
      });
    });
  }

  function updateCharCount(len) {
    const cc = document.getElementById('char-count');
    if (cc) {
      cc.textContent = `${len}/1000`;
      cc.style.color = len > 900 ? '#ef4444' : '';
    }
  }

  // ---- Send Message ----
  async function sendMessage() {
    if (isBusy) return;

    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message) return;

    if (message.length > 1000) {
      showToast('सन्देश धेरै लामो भयो बाबु! (Max 1000 characters)', 'error');
      return;
    }

    // Add user message
    appendMessage(message, 'user');
    input.value = '';
    input.style.height = 'auto';
    updateCharCount(0);
    messageCount++;

    // Show typing
    setTyping(true);
    setCharacterState('thinking');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          sessionId,
          history: messageHistory.slice(-10)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error ${response.status}`);
      }

      setTyping(false);

      // Animate character
      const emotion = data.emotion || 'happy';
      setCharacterState(emotion);

      // Add baje reply with slight delay for realism
      setTimeout(() => {
        appendMessage(data.reply, 'baje', emotion);

        // Update history
        messageHistory.push(
          { role: 'user', content: message },
          { role: 'assistant', content: data.reply }
        );
        if (messageHistory.length > 30) {
          messageHistory = messageHistory.slice(-20);
        }

        // Reset character to idle after a few seconds
        setTimeout(() => setCharacterState('idle'), 4000);
      }, 100);

    } catch (err) {
      setTyping(false);
      setCharacterState('idle');

      // User-friendly error message
      const errMsg = err.message.includes('fetch')
        ? 'सर्भरसँग जोड्न सकिएन। फेरि प्रयास गर्नुस्!'
        : (err.message || 'केही समस्या आयो। फेरि प्रयास गर्नुस्!');

      appendMessage('ए बाबु! अहिले अलि गडबड भयो — ' + errMsg, 'baje', 'idle');
      console.error('Chat error:', err);
    }
  }

  // ---- Append Message to UI ----
  function appendMessage(text, sender, emotion) {
    const container = document.getElementById('messages-container');
    if (!container) return;

    const msgEl = document.createElement('div');
    msgEl.className = `message ${sender === 'user' ? 'user-message' : 'baje-message'}`;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' });

    // Safely create bubble content (no innerHTML with user data)
    const bubbleEl = document.createElement('div');
    bubbleEl.className = 'message-bubble';

    // Handle newlines in baje messages
    if (sender === 'baje') {
      text.split('\n').forEach((line, i, arr) => {
        const p = document.createElement('p');
        p.textContent = line;
        bubbleEl.appendChild(p);
        if (i < arr.length - 1) bubbleEl.appendChild(document.createElement('br'));
      });
    } else {
      const p = document.createElement('p');
      p.textContent = text;
      bubbleEl.appendChild(p);
    }

    const timeEl = document.createElement('span');
    timeEl.className = 'message-time';
    timeEl.textContent = timeStr;

    const bodyEl = document.createElement('div');
    bodyEl.className = 'message-body';
    bodyEl.appendChild(bubbleEl);
    bodyEl.appendChild(timeEl);

    const avatarEl = document.createElement('div');
    avatarEl.className = sender === 'user' ? 'message-avatar user-avatar' : 'message-avatar';

    if (sender === 'baje') {
      avatarEl.textContent = '👴';
      msgEl.appendChild(avatarEl);
      msgEl.appendChild(bodyEl);
    } else {
      avatarEl.textContent = 'तिमी';
      msgEl.appendChild(bodyEl);
      msgEl.appendChild(avatarEl);
    }

    container.appendChild(msgEl);

    // Trigger fade-in animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        msgEl.classList.add('visible');
      });
    });

    // Auto-scroll
    container.scrollTop = container.scrollHeight;

    return msgEl;
  }

  // ---- Typing Indicator ----
  function setTyping(show) {
    isBusy = show;
    const indicator = document.getElementById('typing-indicator');
    const statusText = document.getElementById('chat-status-text');
    const sendBtn = document.getElementById('send-btn');

    if (indicator) indicator.style.display = show ? 'flex' : 'none';
    if (statusText) statusText.textContent = show ? 'सोच्दैछ...' : 'तयार छ';
    if (sendBtn) sendBtn.disabled = show;

    if (show) {
      const container = document.getElementById('messages-container');
      if (container) container.scrollTop = container.scrollHeight;
    }
  }

  // ---- Clear Chat ----
  function clearChat() {
    const confirmed = confirm('कुराकानी सफा गर्ने? बाजेले बिर्सिहाल्छन् है! 😄');
    if (!confirmed) return;

    const container = document.getElementById('messages-container');
    if (!container) return;

    // Remove all messages except the welcome one
    const msgs = container.querySelectorAll('.message:not(#welcome-message)');
    msgs.forEach(m => m.remove());

    messageHistory = [];
    sessionId = generateSessionId();
    messageCount = 0;

    setCharacterState('happy');

    // Fresh greeting after a brief pause
    setTimeout(() => {
      const greetings = [
        'ए बाबु! नयाँ कुराकानी सुरु गरौँ। के कुरा गर्ने?',
        'ल! सफा भयो। बाजे तयार छ! के छ खबर?',
        'हौ! फेरि सुरु! आज के गफ गर्ने हो बाबु?'
      ];
      const msg = greetings[Math.floor(Math.random() * greetings.length)];
      appendMessage(msg, 'baje', 'happy');
      setTimeout(() => setCharacterState('idle'), 3000);
    }, 400);
  }

  // ---- Public API ----
  return {
    init,
    sendMessage,
    clearChat,
    appendMessage
  };
})();
