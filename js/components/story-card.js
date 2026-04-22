import { truncate, autoTitle, formatDate } from '../utils.js';
import { renderConsentBadge } from './consent-badge.js';
import { renderTagBadge } from './tag-badge.js';

export function renderStoryCard(story, tags = []) {
  const title   = story.title || autoTitle(story.body);
  const excerpt = truncate(story.body, 180);
  const date    = formatDate(story.created_at);

  const toneTag     = tags.find(t => t.category === 'tone');
  const griefTags   = tags.filter(t => t.category === 'grief_type');
  const employeeTags = tags.filter(t => t.category === 'employee');

  const metaBadges = [
    renderConsentBadge(story.consent_tier_id),
    toneTag ? renderTagBadge(toneTag) : '',
    ...griefTags.map(t => renderTagBadge(t)),
  ].filter(Boolean).join('');

  const employeeChips = employeeTags.map(t =>
    `<span class="badge badge--tag">${t.label}</span>`
  ).join('');

  return `
    <a href="story.html?id=${story.id}" class="story-card rise" aria-label="Read story: ${title}">
      <div class="story-card__meta">${metaBadges}</div>
      <div class="story-card__title">${title}</div>
      <div class="story-card__excerpt">${excerpt}</div>
      <div class="story-card__footer">
        <span class="story-card__date">${date}</span>
        ${employeeChips}
      </div>
    </a>`;
}
