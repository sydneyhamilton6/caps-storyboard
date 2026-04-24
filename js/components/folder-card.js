import { GRIEF_ICONS, TONE_ICONS } from './grief-icons.js';

const ICON_MAP = { grief_type: GRIEF_ICONS, tone: TONE_ICONS };

const EMPLOYEE_ICON = `<svg viewBox="0 0 40 40" fill="none" stroke="#c4b5d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="20" cy="14" r="6"/>
  <path d="M8 36c0-6.6 5.4-12 12-12s12 5.4 12 12"/>
</svg>`;

export function renderFolderCard(tag, count = 0) {
  const svgIcon   = tag.category === 'employee'
    ? EMPLOYEE_ICON
    : (ICON_MAP[tag.category]?.[tag.value] ?? null);
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
