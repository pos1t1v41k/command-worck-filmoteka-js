import { refs } from './refs';
import { showBackdrop, closeBackdrop } from './backdrop.js';

refs.openTeamModal.addEventListener('click', onOpenTeamModal);
refs.closeTeamModal.addEventListener('click', onCloseTeamModal);
refs.teamBackdrop.addEventListener('click', onBackdropClick);

function onEscKeyPress(e) {
  const ESC_KEY_CODE = 'Escape';
  const isEscKey = e.code === ESC_KEY_CODE;

  if (isEscKey) {
    onCloseTeamModal();
  }
}

function onCloseTeamModal() {
  refs.teamModal.classList.add('is-hidden');
  window.removeEventListener('keydown', onEscKeyPress);
  // refs.body.classList.remove('show-modal-team');
  closeBackdrop();
  refs.closeTeamModal.removeEventListener('click', onCloseTeamModal);
}

function onBackdropClick(e) {
  if (e.currentTarget === e.target) {
    onCloseTeamModal();
  }
}

export function onOpenTeamModal(e) {
  // e.preventDefault();
  window.addEventListener('keydown', onEscKeyPress);
  // refs.body.classList.add('show-modal-team');
  showBackdrop();
  refs.teamModal.classList.remove('is-hidden');
  refs.closeTeamModal.addEventListener('click', onCloseTeamModal);
}
