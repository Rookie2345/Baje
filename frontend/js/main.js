// ============================================================
// BAJE AI — Main Entry Point
// बाजेसँग गफ गरौँ! 🇳🇵
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🇳🇵 BAJE AI — बाजेसँग गफ गरौँ!');

  // Initialize modules
  initEffects();
  initCharacter();
  Chat.init();

  // Server health check
  checkServerHealth();

  // Keyboard shortcut: Escape to scroll to top
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

async function checkServerHealth() {
  try {
    const res = await fetch('/api/health');
    const data = await res.json();

    console.log('🏔️ BAJE AI Health:', data);

    if (data.aiConfigured) {
      console.log(`✅ AI Provider: ${data.aiProvider}`);
    } else {
      console.log('ℹ️  Local conversation engine active (no AI API key configured)');
    }

    // Update status indicator
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    if (dot) dot.style.background = '#10b981';
    if (text) {
      text.textContent = data.aiConfigured ? 'AI + Local' : 'बाजे तयार';
      text.style.fontFamily = 'var(--font-nep)';
    }

  } catch (err) {
    console.warn('Health check failed (server may be starting):', err.message);

    // Mark as connecting
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    if (dot) dot.style.background = '#f59e0b';
    if (text) text.textContent = 'जोड्दैछ...';
  }
}
