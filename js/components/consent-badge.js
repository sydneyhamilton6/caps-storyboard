import { consentBadgeClass } from '../tags.js';

const LABELS = { 1: 'Fully Public', 2: 'Anonymous', 3: 'Strictly Private' };
const DOTS   = { 1: '🟢', 2: '🟡', 3: '🔴' };

export function renderConsentBadge(tierId) {
  const cls   = consentBadgeClass(tierId);
  const label = LABELS[tierId] ?? 'Unknown';
  const dot   = DOTS[tierId] ?? '';
  return `<span class="badge ${cls}" title="Consent: ${label}">${dot} ${label}</span>`;
}
