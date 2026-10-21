// Smooth active nav highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? '#6c63ff' : '';
  });
});

// Contact form submit
document.querySelector('.contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'Sent! ✓';
  btn.style.background = '#22c55e';
  setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; }, 3000);
});

// Fade-in on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.style.opacity = '1';
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .skill').forEach(el => {
  el.style.opacity = '0';
  el.style.transition = 'opacity 0.6s ease, transform 0.3s';
  observer.observe(el);
});

// ── GEMINI CHATBOT ──
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${window.GEMINI_KEY || ''}`;

const chatToggle  = document.getElementById('chatToggle');
const chatWindow  = document.getElementById('chatWindow');
const chatClose   = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput   = document.getElementById('chatInput');
const chatSend    = document.getElementById('chatSend');

const history = [];

chatToggle.addEventListener('click', () => {
  chatWindow.classList.toggle('open');
  if (chatWindow.classList.contains('open')) chatInput.focus();
});

chatClose.addEventListener('click', () => chatWindow.classList.remove('open'));

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

function appendMsg(text, role) {
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.innerHTML = `<span>${text}</span>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = '';

  appendMsg(text, 'user');
  history.push({ role: 'user', parts: [{ text }] });

  const typing = appendMsg('Typing…', 'bot typing');

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: "You are Deepak's friendly portfolio assistant. Deepak is a developer skilled in React, Node.js, Python, AI/ML, and databases. Answer visitor questions about his work, skills, and projects. Keep replies concise and helpful." }]
        },
        contents: history
      })
    });

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not get a response.';
    history.push({ role: 'model', parts: [{ text: reply }] });

    typing.remove();
    appendMsg(reply, 'bot');
  } catch {
    typing.remove();
    appendMsg('Oops! Something went wrong. Please try again.', 'bot');
  }
}
