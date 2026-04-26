const LINKS = [
  { href: 'index.html',   label: 'Submit' },
  { href: 'stories.html', label: 'Stories' },
  { href: 'admin.html',   label: 'Admin' },
];

const BRAND_SVG = `
<svg class="nav__brand-icon" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <circle cx="18" cy="18" r="18" fill="#2F6F6E"/>
  <path d="M18 10C14.5 10 12 12.5 12 15.5C12 18.5 14 20.5 18 24C22 20.5 24 18.5 24 15.5C24 12.5 21.5 10 18 10Z" fill="white" opacity="0.9"/>
  <path d="M18 13L20 17H16L18 13Z" fill="#2F6F6E" opacity="0.6"/>
</svg>`;

export function renderNav(container) {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const linksHtml = LINKS.map(l => {
    const active = l.href === currentPage ? ' nav__link--active' : '';
    return `<a href="${l.href}" class="nav__link${active}">${l.label}</a>`;
  }).join('');

  container.innerHTML = `
    <nav class="nav" role="navigation" aria-label="Main navigation">
      <div class="container">
        <div class="nav__inner">
          <a href="index.html" class="nav__brand">
            ${BRAND_SVG}
            <div class="nav__brand-text">
              <span class="nav__brand-eyebrow">Collective for Hope</span>
              <span class="nav__brand-title">Grief Support Hub</span>
            </div>
          </a>
          <div class="nav__links" role="list">${linksHtml}</div>
          <div class="nav__spacer"></div>
        </div>
      </div>
    </nav>`;
}
