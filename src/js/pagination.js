import { apiServise } from '../index.js';
import { renderCards } from './renderCards';
import { spiner, spinerRemove, successPages } from './notifications.js';

// const apiServise = new ApiServise();
export const pagination = document.querySelector('.pagination__container');
// pagination.addEventListener('click', clickPaginetion);
let firstPage = null;
let endPage = null;

export function getPagination(currentPage, lastPage, isLib = false) {
  if (!currentPage || lastPage === 1 || lastPage - currentPage < 0) {
    pagination.style = `margin; 0`;
    pagination.innerHTML = '';
    return;
  }
  firstPage = currentPage;
  endPage = lastPage;

  let pages = getPagesArray(currentPage, lastPage);

  pagination.innerHTML = `<button class="pagination__left-btn on" type="button">
    <svg>
    <path d="M12.586 27.414l-10-10c-0.781-0.781-0.781-2.047 0-2.828l10-10c0.781-0.781 2.047-0.781 2.828 0s0.781 2.047 0 2.828l-6.586 6.586h19.172c1.105 0 2 0.895 2 2s-0.895 2-2 2h-19.172l6.586 6.586c0.39 0.39 0.586 0.902 0.586 1.414s-0.195 1.024-0.586 1.414c-0.781 0.781-2.047 0.781-2.828 0z"></path>
      </svg>
  </button>
  <ul class="pagination__list"></ul>
  <button class="pagination__right-btn on" type="button">
  <svg>
  <path d="M19.414 27.414l10-10c0.781-0.781 0.781-2.047 0-2.828l-10-10c-0.781-0.781-2.047-0.781-2.828 0s-0.781 2.047 0 2.828l6.586 6.586h-19.172c-1.105 0-2 0.895-2 2s0.895 2 2 2h19.172l-6.586 6.586c-0.39 0.39-0.586 0.902-0.586 1.414s0.195 1.024 0.586 1.414c0.781 0.781 2.047 0.781 2.828 0z"></path>
  </svg>
  </button>`;

  if (window.screen.width <= 768) pagination.style = `margin-bottom: 40px`;
  else pagination.style = `margin-bottom: 60px`;

  if (currentPage === 1) {
    document.querySelector('.pagination__left-btn').classList.remove('on');
    document.querySelector('.pagination__left-btn').disabled = true;
  } else if (lastPage === currentPage) {
    document.querySelector('.pagination__right-btn').disabled = true;
    document.querySelector('.pagination__right-btn').classList.remove('on');
  }

  const list = document.querySelector('.pagination__list');

  list.insertAdjacentHTML('beforeend', renderLi(pages));

  const itemList = list.children;

  for (let i = 0; i < itemList.length; i++) {
    // if (!isNaN(Number(itemList[i].id)))
    //   itemList[i].classList.add('pagination__on');
    if (Number(itemList[i].id) === currentPage)
      itemList[i].classList.add('pagination__item--current');
  }

  if (!isLib) pagination.addEventListener('click', clickPaginetion);
}

function renderLi(arr) {
  return arr.reduce((acc, item) => {
    if (item === '+')
      return (
        acc +
        `<li class="pagination__item pagination__on" id='${item}'>...</li>`
      );
    else if (item === '-')
      return (
        acc +
        `<li class="pagination__item pagination__on" id='${item}'>...</li>`
      );
    else
      return (
        acc +
        `<li class="pagination__item pagination__on" id='${item}'>${item}</li>`
      );
  }, '');
}

function getPagesArray(currentPage, lastPage) {
  let result = [];

  if (window.screen.width <= 768) {
    if (lastPage <= 5) {
      result = ['', ''];
      for (let m = 0; m < lastPage; m++) result.push(m + 1);
      result.push('');
      result.push('');
    } else if (currentPage >= 3 && lastPage - currentPage >= 2) {
      result = [
        '',
        '',
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
        '',
        '',
      ];
    } else if (currentPage <= 2) {
      result = ['', ''];
      for (let m = 0; m < 5; m++) result.push(m + 1);
      result.push('');
      result.push('');
    } else {
      result = ['', ''];
      for (let m = 4; m > 0; m--) result.push(lastPage - m);
      result.push(lastPage);
      result.push('');
      result.push('');
    }

    return result;
  }

  if (lastPage <= 9) for (let i = 0; i < lastPage; i++) result.push(i + 1);
  else if (lastPage - currentPage >= 5 && currentPage >= 6)
    result = [
      1,
      '-',
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
      '+',
      lastPage,
    ];
  else if (lastPage - currentPage >= 5 && currentPage <= 5) {
    for (let j = 0; j < 7; j++) result.push(j + 1);

    result.push('+');
    result.push(lastPage);
  } else {
    result.push(1);
    result.push('-');
    for (let i = 6; i > 0; i--) result.push(lastPage - i);
    result.push(lastPage);
  }
  return result;
}

function clickPaginetion(e) {
  //відстежування натискань
  if (e.target === e.currentTarget || e.target.nodeName === 'UL') return;

  let id = null;
  if (
    e.target.nodeName === 'svg' ||
    e.target.nodeName === 'BUTTON' ||
    e.target.nodeName === 'path'
  ) {
    if (
      e.target.closest('button').classList.contains('pagination__left-btn') &&
      firstPage > 1
    )
      id = firstPage - 1;
    else if (
      e.target.closest('button').classList.contains('pagination__right-btn') &&
      firstPage < endPage
    )
      id = firstPage + 1;
    else return;
  } else {
    if (!isNaN(e.target.closest('li').id)) id = e.target.closest('li').id;
    else if (e.target.closest('li').id === '+') id = firstPage + 3;
    else if (e.target.closest('li').id === '-') id = firstPage - 3;
    else return;
  }
  spiner();
  apiServise.fetchPagination(id).then(data => {
    //додав спінер і плавний скролл
    renderCards(data);
    spinerRemove();
  });
}
