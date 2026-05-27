const slides = Array.from(document.querySelectorAll('.slide'));
const nav = document.getElementById('slideNav');
const currentSlide = document.getElementById('currentSlide');
const totalSlides = document.getElementById('totalSlides');
const progressBar = document.getElementById('progressBar');
const slideLabel = document.getElementById('slideLabel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const logo = document.querySelector('.logo-mark');
const sideRail = document.querySelector('.side-rail');
const menuToggle = document.getElementById('menuToggle');

let activeIndex = 0;

function closeMobileMenu() {
  if (!sideRail || !menuToggle) return;
  sideRail.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Otevřít menu');
}

function toggleMobileMenu() {
  if (!sideRail || !menuToggle) return;
  const isOpen = sideRail.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  menuToggle.setAttribute('aria-label', isOpen ? 'Zavřít menu' : 'Otevřít menu');
}


totalSlides.textContent = String(slides.length);

const navButtons = slides.map((slide, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'nav-dot';
  button.textContent = slide.dataset.short || String(index + 1).padStart(2, '0');
  button.setAttribute('aria-label', `Přejít na slide ${index + 1}: ${slide.dataset.label}`);
  button.addEventListener('click', () => showSlide(index));
  nav.appendChild(button);
  return button;
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function refreshScrollState() {
  const activeSlide = slides[activeIndex];
  const inner = activeSlide.querySelector('.slide-inner');
  const deck = document.querySelector('.deck');

  slides.forEach((slide) => {
    const slideInner = slide.querySelector('.slide-inner');
    if (slideInner) slideInner.classList.remove('is-scrollable');
  });

  if (!inner || !deck) return;

  const canScroll = inner.scrollHeight > inner.clientHeight + 2;
  inner.classList.toggle('is-scrollable', canScroll);
  deck.classList.toggle('has-scroll', canScroll);
}

function showSlide(nextIndex) {
  closeMobileMenu();
  activeIndex = clamp(nextIndex, 0, slides.length - 1);

  slides.forEach((slide, index) => {
    const isActive = index === activeIndex;
    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');

    const inner = slide.querySelector('.slide-inner');
    if (inner && isActive) inner.scrollTop = 0;
  });

  navButtons.forEach((button, index) => {
    const isActive = index === activeIndex;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-current', isActive ? 'step' : 'false');
  });

  currentSlide.textContent = String(activeIndex + 1);
  slideLabel.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${slides[activeIndex].dataset.label}`;
  progressBar.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;

  prevBtn.disabled = activeIndex === 0;
  nextBtn.disabled = activeIndex === slides.length - 1;
  document.title = `${slides[activeIndex].dataset.label} · Jan Konrád`;

  requestAnimationFrame(refreshScrollState);
}

function nextSlide() {
  showSlide(activeIndex + 1);
}

function previousSlide() {
  showSlide(activeIndex - 1);
}

prevBtn.addEventListener('click', previousSlide);
nextBtn.addEventListener('click', nextSlide);
if (menuToggle) menuToggle.addEventListener('click', toggleMobileMenu);
logo.addEventListener('click', (event) => {
  event.preventDefault();
  showSlide(0);
});

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();

  if (['arrowright', 'pagedown', ' '].includes(key)) {
    event.preventDefault();
    nextSlide();
  }

  if (['arrowleft', 'pageup'].includes(key)) {
    event.preventDefault();
    previousSlide();
  }

  if (key === 'home') {
    event.preventDefault();
    showSlide(0);
  }

  if (key === 'end') {
    event.preventDefault();
    showSlide(slides.length - 1);
  }

  if (key === 'escape') {
    closeMobileMenu();
  }
});

window.addEventListener('resize', () => {
  closeMobileMenu();
  refreshScrollState();
});

document.addEventListener('click', (event) => {
  if (!sideRail || !menuToggle) return;
  if (!sideRail.classList.contains('is-open')) return;
  if (!sideRail.contains(event.target)) closeMobileMenu();
});

showSlide(0);
