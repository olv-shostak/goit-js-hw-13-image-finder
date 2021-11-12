
import './sass/main.scss';
import refs from './js/refs';
import cardMarkup from './templates/card-markup.hbs';
import * as basicLightbox from 'basiclightbox';
import { info, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import './sass/basicLightbox.min.css';

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
refs.list.addEventListener('click', onPictureClick);

let page = 1;

function onFormSubmit(e) {
  e.preventDefault();
  const value = e.currentTarget.elements.query.value;
  if (value === '') {
    return info({
      text: 'Enter the value!',
      delay: 2000,
      closerHover: true,
    });
  }

  const BASE_URL = 'https://pixabay.com/api/';
  const queryParam = new URLSearchParams({
    key: '24305587-c8482d095dc3290807d6dab36',
    image_type: 'photo',
    q: refs.form.elements.query.value,
    orientation: 'horizontal',
    page: 1,
    per_page: 12,
  });

  fetch(`${BASE_URL}?${queryParam}&page=${page}`)
    .then(res => res.json())
    .then(data => {
      refs.loadMoreBtn.classList.remove('is-hidden');
      renderCard(data);
    });

  function renderCard({ hits }) {
    if (hits.length === 0) {
      refs.loadMoreBtn.classList.add('is-hidden');
      error({
        text: 'No matches found!',
        delay: 2000,
        closerHover: true,
      });
    }
    refs.list.innerHTML = cardMarkup(hits);
  }
}

function incrementPage() {
  page += 1;
}

function onLoadMoreBtnClick() {
  incrementPage();

  const BASE_URL = 'https://pixabay.com/api/';
  const queryParam = new URLSearchParams({
    key: '24305587-c8482d095dc3290807d6dab36',
    image_type: 'photo',
    q: refs.form.elements.query.value,
    orientation: 'horizontal',
    page: 1,
    per_page: 12,
  });

  fetch(`${BASE_URL}?${queryParam}&page=${page}`)
    .then(res => res.json())
    .then(data => {
      renderCard(data);
      refs.loadMoreBtn.classList.remove('is-hidden');
      buttonClick();
    });

  function renderCard({ hits }) {
    const markup = cardMarkup(hits);
    refs.list.insertAdjacentHTML('beforeend', markup);
  }
}
const hiddenElement = refs.loadMoreBtn;

function buttonClick() {
  hiddenElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

function onPictureClick(e) {
  if (!e.target.classList.contains('card-img')) {
    return;
  }

  const instance = basicLightbox.create(`
    <img src="${e.target.dataset.largeImg}" width="800" height="600">
  `);
  instance.show();
}
