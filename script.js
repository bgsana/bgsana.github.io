// Abas: cada grupo (.tabs) controla só o seu próprio conteúdo
document.querySelectorAll('.tabs').forEach(tabs => {
  const scope = tabs.parentElement;
  const btns = tabs.querySelectorAll('.tab-btn');
  btns.forEach(btn => btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.toggle('active', b === btn));
    scope.querySelectorAll(':scope > .tab-content')
      .forEach(c => c.classList.toggle('active', c.id === btn.dataset.tab));
    const bars = scope.querySelectorAll('.nivel');
    if (btn.dataset.tab === 'soft') setTimeout(() => bars.forEach(n => n.style.width = n.dataset.nivel), 40);
    else bars.forEach(n => n.style.width = '0');
  }));
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('active'); observer.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const nav = document.querySelector('.navegation');
window.addEventListener('scroll', () => nav?.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

const sections = document.querySelectorAll('section[id], main[id]');
const navLinks = document.querySelectorAll('.menu a');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
  });
}, { threshold: 0.35 });
sections.forEach(s => sectionObserver.observe(s));

// Cursor sutil: ponto preciso + halo que segue com suavidade.
if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const dot = document.createElement('div');
  const blob = document.createElement('div');
  dot.className = 'cursor-dot'; blob.className = 'cursor-blob';
  document.body.append(dot, blob);
  let mouseX = innerWidth / 2, mouseY = innerHeight / 2, blobX = mouseX, blobY = mouseY;
  addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; dot.style.left = `${mouseX}px`; dot.style.top = `${mouseY}px`; });
  const tick = () => { blobX += (mouseX - blobX) * .16; blobY += (mouseY - blobY) * .16; blob.style.left = `${blobX}px`; blob.style.top = `${blobY}px`; requestAnimationFrame(tick); };
  tick();
  document.querySelectorAll('a,button,.jelly-card,.hero-photo-col,.hero-mega').forEach(el => {
    el.addEventListener('mouseenter', () => blob.classList.add('active'));
    el.addEventListener('mouseleave', () => blob.classList.remove('active'));
  });
}

// Micro-interação "geleia": cards acompanham levemente a posição do mouse.
document.querySelectorAll('.jelly-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    if (!matchMedia('(pointer:fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(900px) rotateX(${y * -2.2}deg) rotateY(${x * 2.2}deg) translateY(-7px) scale(1.008)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

// Menu mobile simples: abre/fecha os links sem adicionar outra biblioteca.
const menuTrigger = document.querySelector('.menu-trigger');
const menu = document.querySelector('.menu');
menuTrigger?.addEventListener('click', () => {
  const open = menu.classList.toggle('mobile-open');
  menuTrigger.setAttribute('aria-expanded', String(open));
});
menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('mobile-open')));

// ---------- Hero 3D: letras com profundidade, onda constante e reação ao mouse ----------
// Degradê do sobrenome: uma cor sólida por letra, interpolada entre as cores da paleta.
const gradientStops = [[0, [244, 238, 252]], [.18, [244, 238, 252]], [.46, [224, 170, 255]], [.72, [157, 78, 221]], [.95, [123, 44, 191]], [1, [123, 44, 191]]];
function gradientColor(t) {
  for (let i = 1; i < gradientStops.length; i++) {
    const [p1, c1] = gradientStops[i - 1], [p2, c2] = gradientStops[i];
    if (t <= p2) {
      const f = (t - p1) / (p2 - p1 || 1);
      return `rgb(${c1.map((v, n) => Math.round(v + (c2[n] - v) * f)).join(',')})`;
    }
  }
  return 'rgb(123,44,191)';
}

const heroTitle = document.querySelector('.hero-mega');
if (heroTitle) {
  const letters = [];
  let order = 0;

  heroTitle.querySelectorAll('.hero-name-line').forEach((line, li) => {
    const chars = [...line.textContent.trim()];
    line.textContent = '';
    chars.forEach((c, k) => {
      const ch = document.createElement('span');
      ch.className = 'ch';
      ch.style.setProperty('--k', k);
      ch.style.setProperty('--n', chars.length);
      ch.style.setProperty('--d', `${li * 320 + k * 70}ms`);
      for (let i = 1; i <= 6; i++) {
        const d = document.createElement('span');
        d.className = 'depth';
        d.setAttribute('aria-hidden', 'true');
        d.style.setProperty('--i', i);
        d.textContent = c;
        ch.append(d);
      }
      if (line.classList.contains('hero-name-line-2')) ch.style.setProperty('--c', gradientColor((k + .5) / chars.length));
      const front = document.createElement('span');
      front.className = 'ch-front';
      front.textContent = c;
      ch.append(front);
      line.append(ch);
      letters.push({ el: ch, k: order++, y: 0, z: 0, rx: 0, ry: 0 });
    });
  });
  heroTitle.classList.add('is-3d');

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const finePointer = matchMedia('(pointer:fine)').matches;
    let mx = -9999, my = -9999, tiltX = 0, tiltY = 0, curX = 0, curY = 0;
    let visible = true, flipT = -1e9;
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(heroTitle);

    if (finePointer) {
      addEventListener('pointermove', e => {
        mx = e.clientX; my = e.clientY;
        tiltY = (mx / innerWidth - .5) * 14;
        tiltX = (my / innerHeight - .5) * -9;
      }, { passive: true });
      document.addEventListener('mouseleave', () => { mx = my = -9999; tiltX = tiltY = 0; });
    }
    // clique/toque no nome: as letras giram em onda
    heroTitle.addEventListener('pointerdown', () => { flipT = performance.now(); });

    const loop = now => {
      if (visible) {
        curX += (tiltX - curX) * .08;
        curY += (tiltY - curY) * .08;
        heroTitle.style.transform = `rotateX(${curX}deg) rotateY(${curY}deg)`;

        const rects = letters.map(l => l.el.getBoundingClientRect());
        letters.forEach((l, i) => {
          const r = rects[i];
          const dx = mx - (r.left + r.width / 2);
          const dy = my - (r.top + r.height / 2);
          const inf = Math.pow(Math.max(0, 1 - Math.hypot(dx, dy) / 420), 2);
          const wave = Math.sin(now / 900 + l.k * .7);
          const p = (now - flipT - l.k * 55) / 900;
          const flip = p > 0 && p < 1 ? 360 * (1 - Math.pow(1 - p, 3)) : 0;

          const ty = -inf * 14 - wave * 4;
          const tz = inf * 90 + wave * 10;
          const trx = clamp(dy / 300, -1, 1) * -24 * inf;
          const try_ = clamp(dx / 300, -1, 1) * 28 * inf + wave * 3;

          l.y += (ty - l.y) * .12;
          l.z += (tz - l.z) * .12;
          l.rx += (trx - l.rx) * .12;
          l.ry += (try_ - l.ry) * .12;
          l.el.style.transform = `translate3d(0,${l.y}px,${l.z}px) rotateX(${l.rx}deg) rotateY(${l.ry + flip}deg)`;
        });
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

// ---------- Linha do tempo: progresso acompanha a rolagem ----------
const timeline = document.querySelector('.timeline');
if (timeline) {
  const tlItems = timeline.querySelectorAll('.timeline-item');
  let tlTicking = false;
  const updateTimeline = () => {
    const r = timeline.getBoundingClientRect();
    const line = innerHeight * .65;
    timeline.style.setProperty('--p', Math.min(1, Math.max(0, (line - r.top) / r.height)));
    tlItems.forEach(it => it.classList.toggle('lit', it.getBoundingClientRect().top < line));
    tlTicking = false;
  };
  addEventListener('scroll', () => { if (!tlTicking) { tlTicking = true; requestAnimationFrame(updateTimeline); } }, { passive: true });
  addEventListener('resize', updateTimeline);
  updateTimeline();
}