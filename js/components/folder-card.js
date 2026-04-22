export function renderFolderCard(tag, count = 0) {
  const icon  = tag.icon || '📁';
  const label = tag.label;
  const href  = `stories.html?${tag.category}=${tag.value}`;
  const noun  = count === 1 ? 'story' : 'stories';

  return `
    <a href="${href}" class="folder-card rise" aria-label="Browse ${label}: ${count} ${noun}">
      <div class="folder-card__icon" aria-hidden="true">${icon}</div>
      <div class="folder-card__name">${label}</div>
      <div class="folder-card__count">${count} ${noun}</div>
    </a>`;
}
