export function showConfirmModal({ title, body, confirmLabel = 'Confirm', onConfirm }) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-labelledby', 'modal-title');

  backdrop.innerHTML = `
    <div class="modal">
      <h2 class="modal__title" id="modal-title">${title}</h2>
      <p class="modal__body">${body}</p>
      <div class="modal__actions">
        <button class="btn btn--ghost" id="modal-cancel">Cancel</button>
        <button class="btn btn--danger" id="modal-confirm">${confirmLabel}</button>
      </div>
    </div>`;

  document.body.appendChild(backdrop);
  backdrop.querySelector('#modal-cancel').focus();

  function close() { backdrop.remove(); }

  backdrop.querySelector('#modal-cancel').addEventListener('click', close);
  backdrop.querySelector('#modal-confirm').addEventListener('click', () => {
    close();
    onConfirm();
  });
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
  });
}
