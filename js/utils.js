export function truncate(text, length = 80) {
  if (!text) return '';
  return text.length <= length ? text : text.slice(0, length).trimEnd() + '…';
}

export function formatDate(isoString) {
  if (!isoString) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(isoString));
}

export function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function getParams() {
  return new URLSearchParams(window.location.search);
}

export function setParam(key, value) {
  const params = getParams();
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, '', newUrl);
}

export function autoTitle(body, maxLen = 80) {
  const first = (body || '').trim().split(/\n/)[0].trim();
  return truncate(first, maxLen);
}

export function escapeHtml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function paragraphsHtml(text) {
  return (text || '')
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
    .join('');
}
