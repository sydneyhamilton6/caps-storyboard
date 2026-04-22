const CATEGORY_ICONS = {
  grief_type: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21C12 21 4 14 4 8.5A5 5 0 0 1 12 5a5 5 0 0 1 8 3.5C20 14 12 21 12 21z"/></svg>`,
  tone:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  employee:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
};

const FALLBACK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;

export function renderFolderCard(tag, count = 0) {
  const icon = CATEGORY_ICONS[tag.category] || FALLBACK_ICON;
  const href = `stories.html?${tag.category}=${tag.value}`;
  const noun = count === 1 ? 'story' : 'stories';

  return `
    <a href="${href}" class="folder-card rise" aria-label="Browse ${tag.label}: ${count} ${noun}">
      <div class="folder-card__icon" aria-hidden="true">${icon}</div>
      <div class="folder-card__name">${tag.label}</div>
      <div class="folder-card__count">${count} ${noun}</div>
    </a>`;
}
