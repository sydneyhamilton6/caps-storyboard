import { supabase } from '../supabase.js';
import { renderNav } from '../components/nav.js';
import { loadTags, loadConsentTiers, consentDotColor } from '../tags.js';
import { showToast } from '../components/toast.js';

const MIN_BODY = 20;

async function fetchForEdit(id) {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*, testimonial_tags(tag_id, tags(category, label))')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

async function upsert(id, fields, tagIds) {
  let storyId = id;

  if (id) {
    const { error } = await supabase.from('testimonials').update(fields).eq('id', id);
    if (error) throw error;
  } else {
    const { data, error } = await supabase.from('testimonials').insert(fields).select('id').single();
    if (error) throw error;
    storyId = data.id;
  }

  await supabase.from('testimonial_tags').delete().eq('testimonial_id', storyId);

  if (tagIds.length) {
    const rows = tagIds.map(tid => ({ testimonial_id: storyId, tag_id: tid }));
    const { error } = await supabase.from('testimonial_tags').insert(rows);
    if (error) throw error;
  }

  return storyId;
}

function buildConsentCards(tiers) {
  return tiers.map(tier => `
    <label class="consent-card" for="tier-${tier.id}">
      <input type="radio" name="consent_tier_id" id="tier-${tier.id}" value="${tier.id}" required>
      <div class="consent-card__content">
        <div class="consent-card__tier">
          <span class="consent-card__dot" style="background:${consentDotColor(tier.id)}"></span>
          <span class="consent-card__title">${tier.label}</span>
        </div>
        <p class="consent-card__desc">${tier.description}</p>
      </div>
    </label>`).join('');
}

function buildCheckboxList(tags, name, selectedIds = []) {
  return tags.map(t => `
    <label class="check-item" for="${name}-${t.id}">
      <input type="checkbox" id="${name}-${t.id}" name="${name}" value="${t.id}" ${selectedIds.includes(t.id) ? 'checked' : ''}>
      <span class="check-item__label">${t.label}</span>
    </label>`).join('');
}

function buildRadioList(tags, name, selectedId = null) {
  return tags.map(t => `
    <label class="check-item" for="${name}-${t.id}">
      <input type="radio" id="${name}-${t.id}" name="${name}" value="${t.id}" ${selectedId === t.id ? 'checked' : ''} required>
      <span class="check-item__label">${t.label}</span>
    </label>`).join('');
}

function showConfirmation(storyId) {
  document.getElementById('form-root').innerHTML = `
    <div class="confirm-screen rise">
      <div class="confirm-screen__icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h1 class="confirm-screen__title">Thank you for sharing</h1>
      <p class="confirm-screen__body">
        Your story has been submitted and is now part of the Grief Support Hub.
        It may help a colleague better understand what someone else is going through.
      </p>
      <div class="confirm-screen__actions">
        <a href="story.html?id=${storyId}" class="btn btn--primary">View story</a>
        <a href="index.html" class="btn btn--ghost">Submit another</a>
      </div>
    </div>`;
}

async function init() {
  renderNav(document.getElementById('nav-root'));

  const params  = new URLSearchParams(window.location.search);
  const editId  = params.get('id');
  const isEdit  = params.get('edit') === 'true' && editId;

  let tags, tiers;
  try {
    [tags, tiers] = await Promise.all([loadTags(), loadConsentTiers()]);
  } catch (err) {
    console.error('Failed to load form data:', err);
    document.getElementById('form-root').innerHTML =
      '<p style="padding:2rem;color:var(--color-muted)">Unable to load the form. Please refresh the page.</p>';
    return;
  }
  const griefTags = tags.filter(t => t.category === 'grief_type');
  const toneTags  = tags.filter(t => t.category === 'tone');

  let existing = null;
  let existingTagIds = [];
  if (isEdit) {
    existing = await fetchForEdit(editId);
    existingTagIds = (existing.testimonial_tags || []).map(tt => tt.tag_id);
  }

  document.getElementById('page-title').textContent = isEdit ? 'Edit Story' : 'Submit a Story';

  document.getElementById('grief-list').innerHTML    = buildCheckboxList(griefTags, 'grief_type', existingTagIds);
  document.getElementById('tone-list').innerHTML     = buildRadioList(toneTags, 'tone', existingTagIds.find(id => toneTags.some(t => t.id === id)) ?? null);
  document.getElementById('consent-cards').innerHTML = buildConsentCards(tiers);

  if (existing) {
    const f = document.getElementById('submit-form');
    f.title.value           = existing.title || '';
    f.body.value            = existing.body  || '';
    f.submitter_name.value  = existing.submitter_name  || '';
    f.submitter_email.value = existing.submitter_email || '';

    const employeeTag = (existing.testimonial_tags || [])
      .find(tt => tt.tags?.category === 'employee');
    if (employeeTag) f.employee_name.value = employeeTag.tags.label;

    const tierRadio = f.querySelector(`input[name="consent_tier_id"][value="${existing.consent_tier_id}"]`);
    if (tierRadio) { tierRadio.checked = true; tierRadio.closest('.consent-card')?.classList.add('consent-card--selected'); }
    updateCharCount(existing.body || '');
  }

  const bodyEl = document.getElementById('body-input');
  const charEl = document.getElementById('char-count');
  function updateCharCount(val) {
    charEl.textContent = `${val.length} characters${val.length < MIN_BODY ? ` (min ${MIN_BODY})` : ''}`;
  }
  bodyEl.addEventListener('input', e => updateCharCount(e.target.value));

  document.querySelectorAll('input[name="consent_tier_id"]').forEach(r => {
    r.addEventListener('change', () => {
      document.querySelectorAll('.consent-card').forEach(c => c.classList.remove('consent-card--selected'));
      r.closest('.consent-card')?.classList.add('consent-card--selected');
    });
  });

  document.getElementById('submit-form').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;

    const body = form.body.value.trim();
    if (body.length < MIN_BODY) {
      showToast(`Story body must be at least ${MIN_BODY} characters.`, 'error');
      form.body.focus();
      return;
    }

    const tierId = parseInt(form.querySelector('input[name="consent_tier_id"]:checked')?.value, 10);
    if (!tierId) {
      showToast('Please select a consent tier.', 'error');
      return;
    }

    const toneId = form.querySelector('input[name="tone"]:checked')?.value;
    if (!toneId) {
      showToast('Please select a tone.', 'error');
      return;
    }

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = isEdit ? 'Saving…' : 'Submitting…';

    try {
      const griefIds = [...form.querySelectorAll('input[name="grief_type"]:checked')].map(i => i.value);

      const employeeName = form.employee_name.value.trim();
      let employeeTagId = null;
      if (employeeName) {
        const slug = 'employee_' + employeeName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        const { data: existingTag } = await supabase.from('tags').select('id').eq('category', 'employee').eq('value', slug).maybeSingle();
        if (existingTag) {
          employeeTagId = existingTag.id;
        } else {
          const { data: newTag, error: tagErr } = await supabase.from('tags').insert({ category: 'employee', value: slug, label: employeeName }).select('id').single();
          if (tagErr) {
            console.error('Employee tag insert failed:', tagErr);
            throw new Error(`Employee tag could not be saved: ${tagErr.message}`);
          }
          employeeTagId = newTag.id;
        }
      }

      const tagIds = [...(toneId ? [toneId] : []), ...griefIds, ...(employeeTagId ? [employeeTagId] : [])];

      const fields = {
        title:            form.title.value.trim() || null,
        body,
        submitter_name:   form.submitter_name.value.trim()  || null,
        submitter_email:  form.submitter_email.value.trim() || null,
        consent_tier_id:  tierId,
        status:           'published',
      };

      const storyId = await upsert(isEdit ? editId : null, fields, tagIds);
      showConfirmation(storyId);
    } catch (err) {
      console.error('Submission error:', err);
      showToast('Submission failed. Please try again.', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = isEdit ? 'Save changes' : 'Submit story';
    }
  });
}

init();
