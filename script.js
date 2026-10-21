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
