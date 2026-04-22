import { toneBadgeClass } from '../tags.js';

export function renderTagBadge(tag) {
  if (!tag) return '';
  const { category, value, label, icon } = tag;
  let cls = 'badge--tag';
  if (category === 'tone') cls = toneBadgeClass(value);
  const iconHtml = icon ? `${icon} ` : '';
  return `<span class="badge ${cls}">${iconHtml}${label}</span>`;
}
