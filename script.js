const items = [
  { title: 'About Me', src: 'https://drive.google.com/thumbnail?id=1PzZBzXBSmCvBjHPHaw3xdswfUlDS7a56', link: 'pages/about-me.html' },
  { title: 'Animation', src: 'https://drive.google.com/thumbnail?id=1M2Z84DU_jtEqG1doqmUO7gukAN9MnXws', link: 'pages/animation.html' },
  { title: 'Courses', src: 'https://drive.google.com/thumbnail?id=1b62GivFwZR4djMTP0qmVhFvk9Vr0-uwy', link: 'pages/courses.html' },
  { title: 'DeepFake', src: 'https://drive.google.com/thumbnail?id=1F_h8tAnGZb-u1VoUJ1gX_g1Qq6yz5zMN', link: 'pages/deepfake.html' },
  { title: 'Design', src: 'https://drive.google.com/thumbnail?id=1E-AtjtH7ggL-EQzg14GwjIbf8i7hVw8O', link: 'pages/design.html' },
  { title: 'Motion Design', src: 'https://drive.google.com/thumbnail?id=1Uf0Wza_h-qsoE1kZHT1QRUK13mcsqSa5', link: 'pages/motion-design.html' },
  { title: 'Shoshke Engelmaier', src: 'https://drive.google.com/thumbnail?id=15xg5m4gL6K4mt2YfKlAfuKOPWSyxfVE3', link: 'pages/shoshke-engelmaier.html' },
  { title: 'Visual Art', src: 'https://drive.google.com/thumbnail?id=1YbayXi_u8lY8bxjuo2VjFwDOCrGnquIh', link: 'pages/visual-art.html' },
  { title: 'Generative Video', src: 'https://drive.google.com/thumbnail?id=1eyH78d9a0R216B1B2Buelf9rIfMCrdRE', link: 'pages/generative-video.html' },
  { title: 'Above and Beyond', src: 'https://drive.google.com/thumbnail?id=1rO-rggUfDimdefDfiDZlfesuvyBIE_kq', link: 'pages/above-and-beyond.html' }
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
const TAP_THRESHOLD = 10; // pixels
const TAP_TIMEOUT = 200; // milliseconds

function createCarouselItems() {
  items.forEach((item, i) => {
    const element = document.createElement('div');
    element.className = 'carousel-item';
    element.innerHTML = `
      <img src="${item.src}" alt="${item.title}" loading="lazy">
      <h3>${item.title}</h3>
    `;
    element.style.transform = `rotateY(${i * angle}deg) translateZ(300px)`;

    element.addEventListener('click', (e) => {
      e.preventDefault();
      handleItemClick(element, item);
    });

    carousel.appendChild(element);
  });
}

function handleItemClick(clickedItem, itemData) {
  const carouselItems = document.querySelectorAll('.carousel-item');
  
  carousel.classList.add('transitioning');
  clickedItem.classList.add('focus');
  
  carouselItems.forEach(item => {
    if (item !== clickedItem) {
      item.classList.add('fade-out');
    }
  });

  setTimeout(() => {
    window.location.href = itemData.link;
  }, 500);
}

function updateCarousel() {
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
    const zTranslate = 300 + 50 * Math.cos(itemAngle * Math.PI / 180);
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

createCarouselItems();
updateCarousel();