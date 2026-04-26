import { supabase } from '../supabase.js';
import { renderNav } from '../components/nav.js';
import { renderStoryCard } from '../components/story-card.js';
import { renderFilterBar, renderActiveFilters } from '../components/filter-bar.js';
import { loadTags, getFiltersFromUrl } from '../tags.js';
import { getParams } from '../utils.js';

const PAGE_SIZE = 18;
let currentPage = 1;

async function fetchEmployeeTagsInUse() {
  const { data, error } = await supabase
    .from('tags')
    .select('id, value, label, testimonial_tags(testimonial_id)')
    .eq('category', 'employee');
  if (error || !data?.length) return [];
  return data
    .filter(t => (t.testimonial_tags || []).length > 0)
    .map(({ id, value, label }) => ({ id, value, label, category: 'employee' }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

async function fetchStories(filters, page) {
  let query = supabase
    .from('testimonials')
    .select(`
      id, title, body, submitter_name, consent_tier_id, created_at, status,
      testimonial_tags(tag_id, tags(id, category, value, label, icon))
    `)
    .eq('status', 'published')
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (filters.sort === 'oldest') {
    query = query.order('created_at', { ascending: true });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  if (filters.q) {
    query = query.ilike('body', `%${filters.q}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  let stories = data;

  if (filters.grief_type || filters.tone || filters.employee) {
    stories = stories.filter(s => {
      const tags = (s.testimonial_tags || []).map(tt => tt.tags).filter(Boolean);
      if (filters.grief_type && !tags.some(t => t.category === 'grief_type' && t.value === filters.grief_type)) return false;
      if (filters.tone       && !tags.some(t => t.category === 'tone'       && t.value === filters.tone))       return false;
      if (filters.employee   && !tags.some(t => t.category === 'employee'   && t.value === filters.employee))   return false;
      return true;
    });
  }

  return stories;
}

function renderGrid(stories) {
  const grid = document.getElementById('story-grid');
  if (!grid) return;

  if (!stories.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="40" height="40"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></div>
        <div class="empty-state__title">No stories found</div>
        <p class="empty-state__text">Try adjusting your filters or search terms.</p>
      </div>`;
    return;
  }

  grid.innerHTML = stories.map((s, i) => {
    const tags = (s.testimonial_tags || []).map(tt => tt.tags).filter(Boolean);
    return renderStoryCard(s, tags)
      .replace('class="story-card rise"', `class="story-card rise rise-${Math.min(i + 1, 7)}"`);
  }).join('');
}

function updateCount(stories) {
  const el = document.getElementById('story-count');
  if (el) el.textContent = `${stories.length} ${stories.length === 1 ? 'story' : 'stories'}`;
}

async function load() {
  const filters = getFiltersFromUrl();
  currentPage   = parseInt(getParams().get('page') || '1', 10);

  const [tags, stories, employeeTags] = await Promise.all([
    loadTags(),
    fetchStories(filters, currentPage),
    fetchEmployeeTagsInUse(),
  ]);

  renderFilterBar(document.getElementById('filter-root'), {
    tags, employeeTags, filters,
    onChange: () => { currentPage = 1; load(); },
  });

  renderActiveFilters(document.getElementById('active-filter-root'), {
    tags, filters,
    onChange: () => { currentPage = 1; load(); },
  });

  renderGrid(stories);
  updateCount(stories);
}

async function init() {
  renderNav(document.getElementById('nav-root'));
  await load();
}

init();
