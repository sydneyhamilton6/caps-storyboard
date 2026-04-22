import { supabase } from './supabase.js';

let _tagsCache = null;

export async function loadTags() {
  if (_tagsCache) return _tagsCache;
  const { data, error } = await supabase.from('tags').select('*').order('sort_order');
  if (error) throw error;
  _tagsCache = data;
  return data;
}

export async function getTagsByCategory(category) {
  const tags = await loadTags();
  return tags.filter(t => t.category === category);
}

export async function loadConsentTiers() {
  const { data, error } = await supabase.from('consent_tiers').select('*').order('id');
  if (error) throw error;
  return data;
}

export function consentBadgeClass(tierId) {
  return { 1: 'badge--public', 2: 'badge--anonymous', 3: 'badge--private' }[tierId] ?? 'badge--tag';
}

export function consentDotColor(tierId) {
  return { 1: '#22c55e', 2: '#eab308', 3: '#ef4444' }[tierId] ?? '#aaa';
}

export function toneBadgeClass(toneValue) {
  return { inspirational: 'badge--inspirational', volunteer: 'badge--volunteer', sad: 'badge--sad' }[toneValue] ?? 'badge--tag';
}

export function getFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    grief_type: params.get('grief_type') || '',
    tone: params.get('tone') || '',
    employee: params.get('employee') || '',
    consent: params.get('consent') || '',
    q: params.get('q') || '',
    sort: params.get('sort') || 'newest',
  };
}

export function buildTagCountQuery(supabaseClient) {
  return supabaseClient
    .from('testimonial_tags')
    .select('tag_id, tags(id, category, value, label, icon)')
    .eq('testimonials.status', 'published');
}
