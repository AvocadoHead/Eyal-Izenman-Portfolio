const items = [
  {
    titleEn: 'About Me',
    titleHe: 'אודותיי',
    src: 'https://drive.google.com/thumbnail?id=1PzZBzXBSmCvBjHPHaw3xdswfUlDS7a56',
    link: 'pages/about-me.html'
  },
  {
    titleEn: 'Animation',
    titleHe: 'הנפשה',
    src: 'https://drive.google.com/thumbnail?id=1M2Z84DU_jtEqG1doqmUO7gukAN9MnXws',
    link: 'pages/animation.html'
  },
  {
    titleEn: 'Courses',
    titleHe: 'קורסים',
    src: 'https://drive.google.com/thumbnail?id=1b62GivFwZR4djMTP0qmVhFvk9Vr0-uwy',
    link: 'pages/courses.html'
  },
  {
    titleEn: 'Deep Fake',
    titleHe: 'דיפ פייק',
    src: 'https://drive.google.com/thumbnail?id=1F_h8tAnGZb-u1VoUJ1gX_g1Qq6yz5zMN',
    link: 'pages/deepfake.html'
  },
  {
    titleEn: 'Design',
    titleHe: 'עיצוב',
    src: 'https://drive.google.com/thumbnail?id=1E-AtjtH7ggL-EQzg14GwjIbf8i7hVw8O',
    link: 'pages/design.html'
  },
  {
    titleEn: 'Motion Design',
    titleHe: 'עיצוב תנועה',
    src: 'https://drive.google.com/thumbnail?id=1Uf0Wza_h-qsoE1kZHT1QRUK13mcsqSa5',
    link: 'pages/motion-design.html'
  },
  {
    titleEn: 'Shoshke Engelmaier',
    titleHe: 'שושקה אנגלמאיר',
    src: 'https://drive.google.com/thumbnail?id=15xg5m4gL6K4mt2YfKlAfuKOPWSyxfVE3',
    link: 'pages/shoshke-engelmaier.html'
  },
  {
    titleEn: 'Visual Art',
    titleHe: 'אמנות חזותית',
    src: 'https://drive.google.com/thumbnail?id=1YbayXi_u8lY8bxjuo2VjFwDOCrGnquIh',
    link: 'pages/visual-art.html'
  },
  {
    titleEn: 'Generative Video',
    titleHe: "וידאו ג'נרטיבי",
    src: 'https://drive.google.com/thumbnail?id=1eyH78d9a0R216B1B2Buelf9rIfMCrdRE',
    link: 'pages/generative-video.html'
  },
  {
    titleEn: 'Above and Beyond',
    titleHe: 'מעל ומעבר',
    src: 'https://drive.google.com/thumbnail?id=1rO-rggUfDimdefDfiDZlfesuvyBIE_kq',
    link: 'pages/above-and-beyond.html'
  }
];

const carousel = document.getElementById('carousel');
const itemCount = items.length;
const angle = 360 / itemCount;
let currentAngle = 0;
let targetAngle = 0;
let isHovering = false;
let carouselRect;
let lastMouseX;
let velocity = 0;
let lastTime = Date.now();
let isTouching = false;
let touchStartX;
let touchStartY;
let touchStartTime;
const TAP_THRESHOLD = 10;
const TAP_TIMEOUT = 200;

// Language toggle functionality
const languageToggle = document.getElementById('language-toggle');
function setLanguage(lang) {
  document.documentElement.setAttribute('data-lang', lang);
  localStorage.setItem('lang', lang);
  if (languageToggle) {
    languageToggle.textContent = lang === 'en' ? 'EN' : 'HE';
  }
  updateCarouselTitles();
}

if (languageToggle) {
  languageToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-lang') || 'en';
    setLanguage(current === 'en' ? 'he' : 'en');
  });
}

function getItemTitle(item) {
  const lang = document.documentElement.getAttribute('data-lang') || 'en';
  return lang === 'he' ? item.titleHe : item.titleEn;
}

function createCarouselItems() {
  if (!carousel) return;
  carousel.innerHTML = '';
  items.forEach((item, i) => {
    const element = document.createElement('div');
    element.className = 'carousel-item';
    element.dataset.index = i;
    element.innerHTML = `
      <img src="${item.src}" alt="${item.titleEn}" loading="lazy">
      <h3>${getItemTitle(item)}</h3>
    `;
    element.style.transform = `rotateY(${i * angle}deg) translateZ(400px)`;
    element.addEventListener('click', (e) => {
      e.preventDefault();
      handleItemClick(element, item);
    });
    carousel.appendChild(element);
  });
}

function updateCarouselTitles() {
  if (!carousel) return;
  document.querySelectorAll('.carousel-item').forEach(el => {
    const index = parseInt(el.dataset.index, 10);
    el.querySelector('h3').textContent = getItemTitle(items[index]);
  });
}

function handleItemClick(clickedItem, itemData) {
  const carouselItems = document.querySelectorAll('.carousel-item');
  carousel.classList.add('transitioning');
  clickedItem.classList.add('focus');
  carouselItems.forEach(item => {
    if (item !== clickedItem) item.classList.add('fade-out');
  });
  setTimeout(() => {
    window.location.href = itemData.link;
  }, 500);
}

function updateCarousel() {
  if (!carousel) return;
  const now = Date.now();
  const deltaTime = (now - lastTime) / 1000;
  lastTime = now;

  if (!isHovering && !isTouching) {
    velocity *= 0.98;
    targetAngle += velocity * deltaTime;
  }

  const diff = targetAngle - currentAngle;
  currentAngle += diff * 0.05;
  carousel.style.transform = `rotateY(${currentAngle}deg)`;

  const items = carousel.children;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemAngle = (i * angle + currentAngle) % 360;
    const zTranslate = 400 + 70 * Math.cos(itemAngle * Math.PI / 180);
    const opacity = 1 + 0.7 * Math.cos(itemAngle * Math.PI / 180);
    const scale = 0.8 + 0.2 * Math.cos(itemAngle * Math.PI / 180);
    item.style.transform = `rotateY(${i * angle}deg) translateZ(${zTranslate}px) scale(${scale})`;
    item.style.opacity = opacity;
  }

  requestAnimationFrame(updateCarousel);
}

function handleMouseMove(e) {
  if (!carouselRect) {
    carouselRect = carousel.getBoundingClientRect();
  }
  const mouseX = e.clientX - carouselRect.left;
  if (lastMouseX !== undefined) {
    const mouseDelta = mouseX - lastMouseX;
    velocity = -mouseDelta * 0.3;
    targetAngle += mouseDelta * 0.3;
  }
  lastMouseX = mouseX;
}

function handleTouchStart(e) {
  isTouching = true;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  touchStartTime = Date.now();
  carouselRect = carousel.getBoundingClientRect();
}

function handleTouchMove(e) {
  if (!isTouching) return;
  const touchX = e.touches[0].clientX;
  const touchY = e.touches[0].clientY;
  if (Math.abs(touchY - touchStartY) > Math.abs(touchX - touchStartX)) {
    return;
  }
  e.preventDefault();
  const touchDelta = touchX - touchStartX;
  velocity = -touchDelta * 0.3;
  targetAngle += touchDelta * 0.3;
  touchStartX = touchX;
}

function handleTouchEnd(e) {
  if (!isTouching) return;
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  const touchEndTime = Date.now();
  const touchDuration = touchEndTime - touchStartTime;
  const touchDistance = Math.sqrt(
    Math.pow(touchEndX - touchStartX, 2) + Math.pow(touchEndY - touchStartY, 2)
  );
  if (touchDuration < TAP_TIMEOUT && touchDistance < TAP_THRESHOLD) {
    const tappedItem = document.elementFromPoint(touchEndX, touchEndY);
    const carouselItem = tappedItem.closest('.carousel-item');
    if (carouselItem) {
      const index = Array.from(carousel.children).indexOf(carouselItem);
      if (index !== -1) {
        handleItemClick(carouselItem, items[index]);
      }
    }
  }
  isTouching = false;
}

if (carousel) {
  carousel.addEventListener('mouseenter', () => {
    isHovering = true;
    carouselRect = carousel.getBoundingClientRect();
  });

  carousel.addEventListener('mousemove', handleMouseMove);

  carousel.addEventListener('mouseleave', () => {
    isHovering = false;
    lastMouseX = undefined;
  });

  carousel.addEventListener('touchstart', handleTouchStart);
  carousel.addEventListener('touchmove', handleTouchMove);
  carousel.addEventListener('touchend', handleTouchEnd);
}

// Floating Quotes functionality
const quotes = [
  "קוֹלֵט הֵדִים, מְתָאֵר אֲוִיר",
  "הַחַיִּים כְּהֶתְקֵף חֲרָדָה, קַל וּמִתְמַשֵּׁךְ",
  "הָאֱמֶת לְעִתִּים מֵתָה פִיזִית, אֲבָל הִיא מֵטָאפִיזִית",
  // Add more quotes as needed
];

const quoteContainer = document.getElementById('floating-quotes-container');

function createFloatingQuote() {
  const quote = document.createElement('div');
  quote.className = 'floating-quote';
  quote.textContent = quotes[Math.floor(Math.random() * quotes.length)];
  
  const startX = Math.random() * window.innerWidth;
  const duration = 8000; // 8 seconds for the entire animation
  
  quote.style.left = `${startX}px`;
  quote.style.animationDuration = `${duration}ms`;
  
  quoteContainer.appendChild(quote);
  
  // Fade in
  setTimeout(() => {
    quote.classList.add('visible');
  }, 100);

  // Unblur after 1.5 seconds
  setTimeout(() => {
    quote.classList.add('unblurred');
  }, 1500);

  // Blur again after 5.5 seconds (3 seconds of clear visibility)
  setTimeout(() => {
    quote.classList.remove('unblurred');
  }, 5500);
  
  quote.style.animation = `floatAnimation ${duration}ms linear`;
  
  quote.addEventListener('animationend', () => {
    quoteContainer.removeChild(quote);
  });
}

function startFloatingQuotes() {
  createFloatingQuote(); // Create the first quote immediately
  setInterval(createFloatingQuote, 15000); // Create a new quote every 15 seconds
}

// Start the carousel and floating quotes when the page loads
window.addEventListener('load', () => {
  const savedLang = localStorage.getItem('lang') || 'en';
  if (carousel) {
    createCarouselItems();
    setLanguage(savedLang); // ensure titles update after items exist
    updateCarousel();
  } else {
    setLanguage(savedLang); // still apply language preference on other pages
  }
  startFloatingQuotes();
});
