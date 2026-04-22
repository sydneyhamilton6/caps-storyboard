import { supabase } from '../supabase.js';
import { renderNav } from '../components/nav.js';
import { renderFolderCard } from '../components/folder-card.js';
import { loadTags } from '../tags.js';
import { debounce } from '../utils.js';

async function getTagCounts() {
  const { data, error } = await supabase
    .from('testimonial_tags')
    .select('tag_id');
  if (error) return {};
  const counts = {};
  for (const row of data) {
    counts[row.tag_id] = (counts[row.tag_id] || 0) + 1;
  }
  return counts;
}

async function getStats() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('id, consent_tier_id')
    .eq('status', 'published');
  if (error) return { total: 0, byTier: {} };
  const byTier = {};
  for (const r of data) {
    byTier[r.consent_tier_id] = (byTier[r.consent_tier_id] || 0) + 1;
  }
  return { total: data.length, byTier };
}

function renderStats(stats) {
  const el = document.getElementById('stats-bar');
  if (!el) return;
  el.innerHTML = `
    <div class="stat">
      <span class="stat__value">${stats.total}</span>
      <span class="stat__label">Total Stories</span>
    </div>
    <div class="home-stats__divider" aria-hidden="true"></div>
    <div class="stat">
      <span class="stat__value">${stats.byTier[1] || 0}</span>
      <span class="stat__label">Fully Public</span>
    </div>
    <div class="stat">
      <span class="stat__value">${stats.byTier[2] || 0}</span>
      <span class="stat__label">Anonymous</span>
    </div>
    <div class="stat">
      <span class="stat__value">${stats.byTier[3] || 0}</span>
      <span class="stat__label">Staff Only</span>
    </div>`;
}

function renderFolderSection(sectionId, tags, counts) {
  const container = document.getElementById(sectionId);
  if (!container) return;
  if (!tags.length) {
    container.innerHTML = '<p class="text-muted" style="font-size:0.875rem">No entries yet.</p>';
    return;
  }
  container.innerHTML = tags.map((t, i) =>
    renderFolderCard(t, counts[t.id] || 0)
      .replace('class="folder-card rise"', `class="folder-card rise rise-${Math.min(i + 1, 7)}"`)
  ).join('');
}

async function init() {
  renderNav(document.getElementById('nav-root'));

  const searchInput = document.getElementById('hero-search');
  searchInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      if (q) window.location.href = `stories.html?q=${encodeURIComponent(q)}`;
    }
  });

  const [tags, counts, stats] = await Promise.all([
    loadTags(),
    getTagCounts(),
    getStats(),
  ]);

  renderStats(stats);
  renderFolderSection('grief-folders',    tags.filter(t => t.category === 'grief_type'), counts);
  renderFolderSection('tone-folders',     tags.filter(t => t.category === 'tone'),       counts);
  renderFolderSection('employee-folders', tags.filter(t => t.category === 'employee'),   counts);
}

init();
