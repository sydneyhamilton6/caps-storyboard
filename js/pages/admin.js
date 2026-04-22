import { supabase } from '../supabase.js';
import { renderNav } from '../components/nav.js';
import { renderConsentBadge } from '../components/consent-badge.js';
import { showToast } from '../components/toast.js';
import { showConfirmModal } from '../components/modal.js';
import { formatDate, truncate, autoTitle, debounce } from '../utils.js';

// TODO(v2-auth): Insert auth check here. Redirect to login if not staff/admin.

let stories = [];
let selected = new Set();

async function fetchAll(filters) {
  let query = supabase
    .from('testimonials')
    .select(`
      id, title, body, submitter_name, consent_tier_id, status, created_at,
      testimonial_tags(tag_id, tags(category, value, label))
    `)
    .order('created_at', { ascending: false });

  if (filters.q) query = query.ilike('body', `%${filters.q}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function deleteOne(id) {
  await supabase.from('testimonial_tags').delete().eq('testimonial_id', id);
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw error;
}

async function deleteMany(ids) {
  for (const id of ids) await deleteOne(id);
}

function getFilters() {
  const q = document.getElementById('admin-search')?.value.trim() || '';
  const tier = document.getElementById('filter-tier')?.value || '';
  const status = document.getElementById('filter-status')?.value || '';
  return { q, tier, status };
}

function applyFilters(data, { q, tier, status }) {
  return data.filter(s => {
    if (status && s.status !== status) return false;
    if (tier && String(s.consent_tier_id) !== tier) return false;
    if (q) {
      const needle = q.toLowerCase();
      const haystack = `${s.title || ''} ${s.body} ${s.submitter_name || ''}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}

function renderStats(data) {
  const total  = data.length;
  const pub    = data.filter(s => s.consent_tier_id === 1).length;
  const anon   = data.filter(s => s.consent_tier_id === 2).length;
  const priv   = data.filter(s => s.consent_tier_id === 3).length;
  document.getElementById('stat-total').textContent  = total;
  document.getElementById('stat-public').textContent  = pub;
  document.getElementById('stat-anon').textContent    = anon;
  document.getElementById('stat-private').textContent = priv;
}

function renderTable(data) {
  const tbody = document.getElementById('story-tbody');
  if (!tbody) return;

  selected.clear();
  updateBulkBar();

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state" style="text-align:center;padding:48px;color:var(--color-muted)">No stories match your filters.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(s => {
    const tags     = (s.testimonial_tags || []).map(tt => tt.tags).filter(Boolean);
    const toneTag  = tags.find(t => t.category === 'tone');
    const title    = truncate(s.title || autoTitle(s.body), 50);
    const author   = s.consent_tier_id === 1 && s.submitter_name ? s.submitter_name : '—';

    return `
      <tr data-id="${s.id}">
        <td><input type="checkbox" class="data-table__checkbox row-check" data-id="${s.id}" aria-label="Select story"></td>
        <td class="title-excerpt">${title}</td>
        <td>${author}</td>
        <td>${renderConsentBadge(s.consent_tier_id)}</td>
        <td>${toneTag ? `<span class="badge badge--tag">${toneTag.label}</span>` : '—'}</td>
        <td style="font-size:0.8rem;color:var(--color-muted)">${formatDate(s.created_at)}</td>
        <td>
          <div class="data-table__actions">
            <a href="story.html?id=${s.id}"  class="btn btn--ghost btn--sm">View</a>
            <a href="submit.html?id=${s.id}&edit=true" class="btn btn--ghost btn--sm">Edit</a>
            <button class="btn btn--danger btn--sm delete-btn" data-id="${s.id}">Delete</button>
          </div>
        </td>
      </tr>`;
  }).join('');

  tbody.querySelectorAll('.row-check').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) selected.add(cb.dataset.id);
      else selected.delete(cb.dataset.id);
      updateBulkBar();
    });
  });

  tbody.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      showConfirmModal({
        title: 'Delete story?',
        body:  'This cannot be undone.',
        confirmLabel: 'Delete',
        onConfirm: async () => {
          try {
            await deleteOne(id);
            stories = stories.filter(s => s.id !== id);
            render();
            showToast('Story deleted.', 'success');
          } catch {
            showToast('Delete failed.', 'error');
          }
        },
      });
    });
  });

  document.getElementById('select-all')?.addEventListener('change', function () {
    tbody.querySelectorAll('.row-check').forEach(cb => {
      cb.checked = this.checked;
      if (this.checked) selected.add(cb.dataset.id);
      else selected.delete(cb.dataset.id);
    });
    updateBulkBar();
  });
}

function updateBulkBar() {
  const bar = document.getElementById('bulk-bar');
  const count = document.getElementById('bulk-count');
  if (!bar) return;
  if (selected.size > 0) {
    bar.style.display = 'flex';
    count.textContent = `${selected.size} selected`;
  } else {
    bar.style.display = 'none';
  }
}

function render() {
  const filters = getFilters();
  const filtered = applyFilters(stories, filters);
  renderTable(filtered);
  document.getElementById('row-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'story' : 'stories'}`;
}

async function init() {
  renderNav(document.getElementById('nav-root'));

  try {
    stories = await fetchAll({ q: '' });
    renderStats(stories);
    render();
  } catch (err) {
    showToast('Failed to load stories.', 'error');
  }

  const debouncedRender = debounce(render, 300);
  document.getElementById('admin-search')?.addEventListener('input', debouncedRender);
  document.getElementById('filter-tier')?.addEventListener('change', render);
  document.getElementById('filter-status')?.addEventListener('change', render);

  document.getElementById('bulk-delete-btn')?.addEventListener('click', () => {
    if (!selected.size) return;
    showConfirmModal({
      title: `Delete ${selected.size} ${selected.size === 1 ? 'story' : 'stories'}?`,
      body:  'This cannot be undone.',
      confirmLabel: 'Delete all selected',
      onConfirm: async () => {
        try {
          await deleteMany([...selected]);
          stories = stories.filter(s => !selected.has(s.id));
          selected.clear();
          renderStats(stories);
          render();
          showToast('Stories deleted.', 'success');
        } catch {
          showToast('Bulk delete failed.', 'error');
        }
      },
    });
  });
}

init();
