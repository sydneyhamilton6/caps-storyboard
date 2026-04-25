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

function showConfirmation(storyId, summary) {
  const rows = [
    summary.title    && { label: 'Title',        value: summary.title },
    summary.tone     && { label: 'Tone',          value: summary.tone },
    summary.consent  && { label: 'Consent tier',  value: summary.consent },
    summary.grief    && { label: 'Grief type(s)', value: summary.grief },
    summary.name     && { label: 'Submitter',     value: summary.name },
  ].filter(Boolean);

  const summaryHTML = rows.length ? `
    <dl class="confirm-summary">
      ${rows.map(r => `
        <div class="confirm-summary__row">
          <dt class="confirm-summary__label">${r.label}</dt>
          <dd class="confirm-summary__value">${r.value}</dd>
        </div>`).join('')}
    </dl>` : '';

  document.getElementById('form-root').innerHTML = `
    <div class="confirm-screen rise">
      <div class="confirm-screen__icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h1 class="confirm-screen__title">Thank you for sharing</h1>
      <p class="confirm-screen__body">
        This story is now part of the Grief Support Hub and may help a colleague
        better understand what someone else is going through.
      </p>
      ${summaryHTML}
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

  const otherToneTag  = toneTags.find(t => t.value === 'other');
  const otherToneWrap = document.getElementById('other-tone-wrap');
  if (otherToneTag && otherToneWrap) {
    const otherToneCheckbox = document.getElementById(`tone-${otherToneTag.id}`);
    const toggleTone = () => {
      otherToneWrap.style.display = otherToneCheckbox.checked ? 'block' : 'none';
      if (!otherToneCheckbox.checked) document.getElementById('other-tone-input').value = '';
    };
    otherToneCheckbox?.addEventListener('change', toggleTone);
    if (otherToneCheckbox?.checked) toggleTone();
  }

  const otherTag  = griefTags.find(t => t.value === 'other');
  const otherWrap = document.getElementById('other-grief-wrap');
  if (otherTag && otherWrap) {
    const otherCheckbox = document.getElementById(`grief_type-${otherTag.id}`);
    const toggle = () => {
      otherWrap.style.display = otherCheckbox.checked ? 'block' : 'none';
      if (!otherCheckbox.checked) document.getElementById('other-grief-input').value = '';
    };
    otherCheckbox?.addEventListener('change', toggle);
    if (otherCheckbox?.checked) toggle();
  }

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

  const bodyEl  = document.getElementById('body-input');
  const charEl  = document.getElementById('char-count');
  const toneEl  = document.getElementById('tone-list');
  const tierEl  = document.getElementById('consent-cards');

  function updateCharCount(val) {
    charEl.textContent = `${val.length} characters${val.length < MIN_BODY ? ` (min ${MIN_BODY})` : ''}`;
    charEl.classList.toggle('form-char-count--valid', val.length >= MIN_BODY);
    charEl.classList.toggle('form-char-count--error', val.length > 0 && val.length < MIN_BODY);
  }

  function setFieldError(el, hasError) {
    el?.classList.toggle('form-textarea--error', hasError);
    el?.classList.toggle('form-input--error', hasError);
  }

  function setGroupError(el, hasError) {
    el?.classList.toggle('check-group--error', hasError);
    el?.classList.toggle('consent-card-group--error', hasError);
  }

  bodyEl.addEventListener('input', e => {
    updateCharCount(e.target.value);
    if (e.target.value.trim().length >= MIN_BODY) setFieldError(bodyEl, false);
  });
  bodyEl.addEventListener('blur', e => {
    const val = e.target.value.trim();
    if (val.length > 0 && val.length < MIN_BODY) setFieldError(bodyEl, true);
  });

  toneEl?.addEventListener('change', () => setGroupError(toneEl, false));
  tierEl?.addEventListener('change', () => setGroupError(tierEl, false));

  let formDirty = false;
  document.getElementById('submit-form').addEventListener('input', () => { formDirty = true; }, { once: true });
  window.addEventListener('beforeunload', e => {
    if (formDirty) e.preventDefault();
  });

  document.querySelectorAll('input[name="consent_tier_id"]').forEach(r => {
    r.addEventListener('change', () => {
      document.querySelectorAll('.consent-card').forEach(c => c.classList.remove('consent-card--selected'));
      r.closest('.consent-card')?.classList.add('consent-card--selected');
    });
  });

  document.getElementById('submit-form').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;

    const scrollTo = el => el?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const body = form.body.value.trim();
    if (body.length < MIN_BODY) {
      showToast(`Story body must be at least ${MIN_BODY} characters.`, 'error');
      setFieldError(bodyEl, true);
      scrollTo(bodyEl);
      bodyEl.focus();
      return;
    }

    let toneId = form.querySelector('input[name="tone"]:checked')?.value;
    if (!toneId) {
      showToast('Please select a tone.', 'error');
      setGroupError(toneEl, true);
      scrollTo(toneEl);
      return;
    }

    const tierId = parseInt(form.querySelector('input[name="consent_tier_id"]:checked')?.value, 10);
    if (!tierId) {
      showToast('Please select a consent tier.', 'error');
      setGroupError(tierEl, true);
      scrollTo(tierEl);
      return;
    }

    const otherToneText = document.getElementById('other-tone-input')?.value.trim();
    if (otherToneTag && toneId === String(otherToneTag.id) && otherToneText) {
      const slug = 'other_' + otherToneText.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      const { data: existingTone } = await supabase.from('tags').select('id').eq('category', 'tone').eq('value', slug).maybeSingle();
      if (existingTone) {
        toneId = existingTone.id;
      } else {
        const { data: newTone, error: toneErr } = await supabase.from('tags').insert({ category: 'tone', value: slug, label: otherToneText }).select('id').single();
        if (toneErr) throw new Error(`Tone tag could not be saved: ${toneErr.message}`);
        toneId = newTone.id;
      }
    }

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = isEdit ? 'Saving…' : 'Submitting…';

    try {
      let griefIds = [...form.querySelectorAll('input[name="grief_type"]:checked')].map(i => i.value);

      const otherGriefText = document.getElementById('other-grief-input')?.value.trim();
      if (otherGriefText && otherTag) {
        const slug = 'other_' + otherGriefText.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        const { data: existingOther } = await supabase.from('tags').select('id').eq('category', 'grief_type').eq('value', slug).maybeSingle();
        let otherCustomId;
        if (existingOther) {
          otherCustomId = existingOther.id;
        } else {
          const { data: newOther, error: otherErr } = await supabase.from('tags').insert({ category: 'grief_type', value: slug, label: otherGriefText }).select('id').single();
          if (otherErr) throw new Error(`Other grief tag could not be saved: ${otherErr.message}`);
          otherCustomId = newOther.id;
        }
        griefIds = [...griefIds.filter(id => id !== String(otherTag.id)), otherCustomId];
      }

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
      formDirty = false;

      const selectedToneLabel   = toneTags.find(t => String(t.id) === String(toneId))?.label ?? otherToneText ?? null;
      const selectedGriefLabels = griefTags.filter(t => griefIds.includes(String(t.id))).map(t => t.label);
      const selectedTierLabel   = tiers.find(t => t.id === tierId)?.label ?? null;

      showConfirmation(storyId, {
        title:   fields.title,
        tone:    selectedToneLabel,
        consent: selectedTierLabel,
        grief:   selectedGriefLabels.length ? selectedGriefLabels.join(', ') : null,
        name:    fields.submitter_name,
      });
    } catch (err) {
      console.error('Submission error:', err);
      showToast('Submission failed. Please try again.', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = isEdit ? 'Save changes' : 'Submit story';
    }
  });
}

init();
