const buttons = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');
const niveis = document.querySelectorAll('.nivel');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    contents.forEach(c => c.classList.remove('active'));
    const tab = document.getElementById(btn.dataset.tab);
    tab.classList.add('active');

    if (btn.dataset.tab === 'soft') {
      setTimeout(() => {
        niveis.forEach(n => { n.style.width = n.dataset.nivel; });
      }, 50);
    } else {
      niveis.forEach(n => { n.style.width = '0'; });
    }
  });
});

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const nav = document.querySelector('.navegation');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

const sections = document.querySelectorAll('section[id], main[id]');
const navLinks = document.querySelectorAll('.menu a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
