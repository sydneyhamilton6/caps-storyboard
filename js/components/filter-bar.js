import { debounce, setParam, getParams } from '../utils.js';

export function renderFilterBar(container, { tags, filters, onChange }) {
  const tones      = tags.filter(t => t.category === 'tone');
  const griefTypes = tags.filter(t => t.category === 'grief_type');
  const employees  = tags.filter(t => t.category === 'employee');

  function chip(key, value, label, current) {
    const active = current === value ? ' filter-chip--active' : '';
    return `<button class="filter-chip${active}" data-key="${key}" data-value="${value === current ? '' : value}">${label}</button>`;
  }

  container.innerHTML = `
    <div class="filter-bar">
      <span class="filter-bar__label">Filter</span>

      <div class="search-wrap">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <circle cx="9" cy="9" r="6"/><path d="M15 15l-3.5-3.5" stroke-linecap="round"/>
        </svg>
        <input type="search" class="search-input" id="search-input" placeholder="Search stories…" value="${filters.q || ''}" aria-label="Search stories">
      </div>

      <div class="filter-bar__group">
        ${tones.map(t => chip('tone', t.value, `${t.icon || ''} ${t.label}`, filters.tone)).join('')}
      </div>

      <div class="filter-bar__group">
        <select class="sort-select" id="sort-select" aria-label="Sort order">
          <option value="newest" ${filters.sort === 'newest' ? 'selected' : ''}>Newest</option>
          <option value="oldest" ${filters.sort === 'oldest' ? 'selected' : ''}>Oldest</option>
        </select>
      </div>
    </div>`;

  if (griefTypes.length) {
    const section = document.createElement('div');
    section.className = 'filter-bar__group';
    section.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;';
    section.innerHTML = griefTypes.map(t => chip('grief_type', t.value, `${t.icon || ''} ${t.label}`, filters.grief_type)).join('');
    container.querySelector('.filter-bar').appendChild(section);
  }

  const debouncedSearch = debounce(val => {
    setParam('q', val);
    onChange();
  }, 320);

  container.querySelector('#search-input')?.addEventListener('input', e => debouncedSearch(e.target.value));

  container.querySelector('#sort-select')?.addEventListener('change', e => {
    setParam('sort', e.target.value);
    onChange();
  });

  container.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      setParam(btn.dataset.key, btn.dataset.value);
      onChange();
    });
  });
}

export function renderActiveFilters(container, { tags, filters, onChange }) {
  const active = [];
  if (filters.grief_type) {
    const t = tags.find(x => x.value === filters.grief_type);
    if (t) active.push({ key: 'grief_type', label: t.label });
  }
  if (filters.tone) {
    const t = tags.find(x => x.value === filters.tone);
    if (t) active.push({ key: 'tone', label: t.label });
  }
  if (filters.employee) {
    const t = tags.find(x => x.value === filters.employee);
    if (t) active.push({ key: 'employee', label: t.label });
  }

  if (!active.length) { container.innerHTML = ''; return; }

  container.innerHTML = `
    <div class="active-filters">
      ${active.map(f => `
        <span class="active-filter-chip">
          ${f.label}
          <span class="active-filter-chip__remove" data-key="${f.key}" role="button" tabindex="0" aria-label="Remove ${f.label} filter">×</span>
        </span>`).join('')}
    </div>`;

  container.querySelectorAll('.active-filter-chip__remove').forEach(btn => {
    btn.addEventListener('click', () => { setParam(btn.dataset.key, ''); onChange(); });
    btn.addEventListener('keydown', e => { if (e.key === 'Enter') { setParam(btn.dataset.key, ''); onChange(); }});
  });
}
