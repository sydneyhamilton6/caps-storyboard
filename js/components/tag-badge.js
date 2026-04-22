import { toneBadgeClass } from '../tags.js';

export function renderTagBadge(tag) {
  if (!tag) return '';
  const { category, value, label } = tag;
  const cls = category === 'tone' ? toneBadgeClass(value) : 'badge--tag';
  return `<span class="badge ${cls}">${label}</span>`;
}
