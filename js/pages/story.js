import { supabase } from '../supabase.js';
import { renderNav } from '../components/nav.js';
import { renderConsentBadge } from '../components/consent-badge.js';
import { renderTagBadge } from '../components/tag-badge.js';
import { showToast } from '../components/toast.js';
import { showConfirmModal } from '../components/modal.js';
import { formatDate, paragraphsHtml, autoTitle } from '../utils.js';

async function fetchStory(id) {
  const { data, error } = await supabase
    .from('testimonials')
    .select(`
      id, title, body, submitter_name, consent_tier_id, created_at, updated_at, status,
      testimonial_tags(tag_id, tags(id, category, value, label, icon))
    `)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

async function deleteStory(id) {
  const { error: tagErr } = await supabase.from('testimonial_tags').delete().eq('testimonial_id', id);
  if (tagErr) throw tagErr;
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw error;
}

function render(story) {
  const tags        = (story.testimonial_tags || []).map(tt => tt.tags).filter(Boolean);
  const title       = story.title || autoTitle(story.body);
  const authorName  = story.consent_tier_id === 1 && story.submitter_name
    ? story.submitter_name
    : 'Anonymous';
  const date        = formatDate(story.created_at);
  const bodyHtml    = paragraphsHtml(story.body);
  const tagBadges   = tags.map(t => renderTagBadge(t)).join('');

  document.title = `${title} — Grief Support Hub`;

  document.getElementById('story-root').innerHTML = `
    <div class="story-detail rise">
      <div class="story-detail__header">
        <div class="story-detail__tier-row">
          ${renderConsentBadge(story.consent_tier_id)}
          ${story.status === 'archived' ? '<span class="badge badge--sad">Archived</span>' : ''}
        </div>
        <h1 class="story-detail__title">${title}</h1>
        <div class="story-detail__meta">
          <span class="story-detail__author">${authorName}</span>
          <span class="story-detail__date">${date}</span>
        </div>
      </div>

      <div class="story-detail__body">${bodyHtml}</div>

      <div class="story-detail__tags">${tagBadges}</div>

      <div class="story-detail__actions">
        <a href="submit.html?id=${story.id}&edit=true" class="btn btn--ghost">Edit</a>
        <button class="btn btn--danger" id="delete-btn">Delete</button>
      </div>
    </div>`;

  document.getElementById('delete-btn').addEventListener('click', () => {
    showConfirmModal({
      title: 'Delete this story?',
      body:  'This action cannot be undone. The story and all its tags will be permanently removed.',
      confirmLabel: 'Delete permanently',
      onConfirm: async () => {
        try {
          await deleteStory(story.id);
          showToast('Story deleted.', 'success');
          setTimeout(() => window.location.href = 'stories.html', 1200);
        } catch {
          showToast('Could not delete story. Please try again.', 'error');
        }
      },
    });
  });
}

async function init() {
  renderNav(document.getElementById('nav-root'));

  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) {
    window.location.href = '404.html';
    return;
  }

  try {
    const story = await fetchStory(id);
    render(story);
  } catch {
    window.location.href = '404.html';
  }
}

init();
