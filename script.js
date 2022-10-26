'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tags = document.querySelectorAll('.operations__tab');
const tagContainer = document.querySelector('.operations__tab-container');
const tagContents = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  section1.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  const el = e.target;
  if (el.classList.contains('nav__link')) {
    const id = el.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

tagContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  tags.forEach(function (el) {
    el.classList.remove('operations__tab--active');
  });
  tagContents.forEach(el => el.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
  clicked.classList.add('operations__tab--active');
});

const hoverEffect = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', hoverEffect.bind(0.5));
nav.addEventListener('mouseout', hoverEffect.bind(1));

const navHeight = nav.getBoundingClientRect().height;

const obsCall = function (entries) {
  const entry = entries[0];
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const observerOption = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

new IntersectionObserver(obsCall, observerOption).observe(header);

const sectionAll = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const secObserever = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

sectionAll.forEach(sec => {
  sec.classList.add('section--hidden');
  secObserever.observe(sec);
});

// Img Loading

const imgFunction = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(imgFunction, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

const imgAll = document.querySelectorAll('img[data-src]');
imgAll.forEach(img => imgObserver.observe(img));

// SLIDER
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

// const slides = document.querySelectorAll('.slide');
// const slider = document.querySelector('.slider');
// const btnLeft = document.querySelector('.slider__btn--left');
// const btnRight = document.querySelector('.slider__btn--right');

// let curSlide = 0;
// const maxSlide = (slider.style.transform = 'scale(0.4) translateX(-800px)');
// slider.style.overflow = 'visible';
// slides.forEach((s, i) => (s.style.tranform = `translateX(${100 * i}%)`));
// btnRight.addEventListener('click', function () {
//   slides.forEach(
//     (s, i) => (s.style.tranform = `translateX(${100 * (i - curSlide)}%)`)
//   );
// });

// const obsCall = function (entries) {
//   entries.forEach(el => {
//     console.log(el);
//   });
// };

// const observerOption = {
//   root: null,
//   threshold: 1,
// };

// new IntersectionObserver(obsCall, observerOption).observe(section1);

// const h1 = document.querySelector('h1');
// console.log(h1.children);

// console.log(h1.parentElement);
// h1.closest('.header').style.background = 'orange';
// const h1El = document.querySelector('h1');

// const x = function () {
//   alert('Happy Holidays💥');
// };

// h1El.addEventListener('mouseenter', x);

// setTimeout(() => h1El.removeEventListener('mouseenter', x), 3000);

// document.querySelectorAll('.nav__link').forEach(function (curr) {
//   curr.addEventListener('click', function (e) {
//     console.log(e.target);
//     this.scrollIntoView({ behavior: 'smooth' });
//   });
// });

// SELECTING AN ELEMENT

// const header = document.querySelector('.header');
// const allSection = document.querySelectorAll('.section');
// console.log(allSection);

// CREATING AND INSERTING ELEMENT

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookied for improved functionality and analytics.';
// message.innerHTML =
//   'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.append(message);

// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     // DELETE ELEMENT
//     message.remove();
//   });

// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 20 + 'px';
