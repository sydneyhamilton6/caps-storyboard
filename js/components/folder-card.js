const FOLDER_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;

export function renderFolderCard(tag, count = 0) {
  const href = `stories.html?${tag.category}=${tag.value}`;
  const noun = count === 1 ? 'story' : 'stories';

  return `
    <a href="${href}" class="folder-card rise" aria-label="Browse ${tag.label}: ${count} ${noun}">
      <div class="folder-card__icon" aria-hidden="true">${FOLDER_ICON}</div>
      <div class="folder-card__name">${tag.label}</div>
      <div class="folder-card__count">${count} ${noun}</div>
    </a>`;
}
