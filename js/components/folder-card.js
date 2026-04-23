import { GRIEF_ICONS, TONE_ICONS } from './grief-icons.js';

const ICON_MAP = { grief_type: GRIEF_ICONS, tone: TONE_ICONS };

export function renderFolderCard(tag, count = 0) {
  const svgIcon   = ICON_MAP[tag.category]?.[tag.value] ?? null;
  const icon      = svgIcon ?? tag.icon ?? '📁';
  const label     = tag.label;
  const href      = `stories.html?${tag.category}=${tag.value}`;
  const noun      = count === 1 ? 'story' : 'stories';
  const iconClass = svgIcon ? 'folder-card__icon folder-card__icon--svg' : 'folder-card__icon';

  return `
    <a href="${href}" class="folder-card rise" aria-label="Browse ${label}: ${count} ${noun}">
      <div class="${iconClass}" aria-hidden="true">${icon}</div>
      <div class="folder-card__name">${label}</div>
      <div class="folder-card__count">${count} ${noun}</div>
    </a>`;
}
