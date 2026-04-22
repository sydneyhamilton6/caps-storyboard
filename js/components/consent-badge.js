import { consentBadgeClass, consentDotColor } from '../tags.js';

const LABELS = { 1: 'Fully Public', 2: 'Anonymous', 3: 'Strictly Private' };

export function renderConsentBadge(tierId) {
  const cls   = consentBadgeClass(tierId);
  const label = LABELS[tierId] ?? 'Unknown';
  const color = consentDotColor(tierId);
  return `<span class="badge ${cls}" title="Consent: ${label}"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${color};flex-shrink:0"></span>${label}</span>`;
}
