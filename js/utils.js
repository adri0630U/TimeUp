/* Shared helpers and sample data for the TimeUp prototype */
window.TU = (function () {
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const fmt = (m) => {
    const h = Math.floor(m / 60), mm = m % 60;
    const h12 = ((h + 11) % 12) + 1;
    return h12 + ':' + (mm < 10 ? '0' : '') + mm + (h < 12 ? ' AM' : ' PM');
  };

  const icons = {
    back: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    pin: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    checkCircle: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0D50CA" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.6 2.5L16 9.5"/></svg>',
    check: (size, color, w) => '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + (w || 2.6) + '" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    clock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    bell: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D50CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
    plus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    star: (fill) => '<svg width="24" height="24" viewBox="0 0 24 24" fill="' + fill + '" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg>'
  };

  const SPECIALISTS = [
    { id: 'andrea', name: 'Andrea Molina', role: 'Senior stylist', initials: 'AM', skills: ['hair'], locs: ['urdesa', 'samb'], avBg: '#DCE8FF', avFg: '#0B3D91' },
    { id: 'carlos', name: 'Carlos Vera', role: 'Colorist & stylist', initials: 'CV', skills: ['hair'], locs: ['urdesa'], avBg: '#FFE7D6', avFg: '#8A3A00' },
    { id: 'daniela', name: 'Daniela Ruiz', role: 'Massage therapist', initials: 'DR', skills: ['spa'], locs: ['urdesa', 'samb'], avBg: '#DDF3EA', avFg: '#0A5A3C' },
    { id: 'valeria', name: 'Valeria Paz', role: 'Esthetician', initials: 'VP', skills: ['spa', 'nails'], locs: ['urdesa', 'samb'], avBg: '#EFE3FF', avFg: '#5523A0' },
    { id: 'sofia', name: 'Sofía León', role: 'Nail artist', initials: 'SL', skills: ['nails'], locs: ['urdesa'], avBg: '#FFE0EA', avFg: '#8C1D45' }
  ];

  return { esc, fmt, icons, SPECIALISTS };
})();
