/* Screen 1 – Client booking flow (the plug-in a business embeds) */
window.BookingView = (function () {
  const { esc, fmt, icons, SPECIALISTS } = window.TU;

  const LOCATIONS = [
    { id: 'urdesa', name: 'Urdesa', addr: 'Urdesa Central, Guayaquil', note: 'Hair · Spa · Nails' },
    { id: 'samb', name: 'Samborondón', addr: 'Vía a Samborondón, Km 2.5', note: 'Hair · Spa · Massage' }
  ];
  const CATEGORIES = [
    { id: 'all', label: 'All' }, { id: 'hair', label: 'Hair' }, { id: 'spa', label: 'Spa' }, { id: 'nails', label: 'Nails' }
  ];
  const CAT_LABEL = { hair: 'Hair', spa: 'Spa', nails: 'Nails' };
  const SERVICES = [
    { id: 'cut', name: 'Haircut & styling', cat: 'hair', dur: 45, price: 18 },
    { id: 'color', name: 'Color & highlights', cat: 'hair', dur: 120, price: 65 },
    { id: 'massage', name: 'Relaxing massage', cat: 'spa', dur: 60, price: 35 },
    { id: 'facial', name: 'Facial treatment', cat: 'spa', dur: 50, price: 30 },
    { id: 'mani', name: 'Gel manicure', cat: 'nails', dur: 40, price: 15 }
  ];
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const TIMES = [];
  for (let m = 9 * 60; m <= 17 * 60 + 30; m += 30) TIMES.push(m);
  const TITLES = ['Choose a location', 'Choose a service', 'Choose your specialist', 'Pick a date & time', 'Review & confirm'];

  const fresh = () => ({ step: 0, loc: null, cat: 'all', svc: null, spec: null, day: 0, time: null, channel: 'WhatsApp', r24: true, r2: true, name: '', phone: '', start: Date.now(), elapsed: 0 });
  let s = fresh();
  let root = null;

  /* Simulated availability: in the real product this comes from the business calendar */
  function busyFor(specId, day, i) {
    const now = new Date();
    if (day === 0 && TIMES[i] < now.getHours() * 60 + now.getMinutes() + 60) return true;
    return (specId.charCodeAt(0) * 7 + specId.charCodeAt(1) * 3 + day * 13 + i * 31) % 10 < 4;
  }
  const service = () => SERVICES.find((v) => v.id === s.svc);
  const location = () => LOCATIONS.find((l) => l.id === s.loc);
  const pool = () => {
    const svc = service();
    return SPECIALISTS.filter((p) => (!svc || p.skills.includes(svc.cat)) && (!s.loc || p.locs.includes(s.loc)));
  };
  const freeAt = (specId, day, i) => specId === 'any' ? pool().some((p) => !busyFor(p.id, day, i)) : !busyFor(specId, day, i);
  function firstFree(specId) {
    for (let d = 0; d < 7; d++) for (let i = 0; i < TIMES.length; i++) {
      if (freeAt(specId, d, i)) return (d === 0 ? 'Today ' : d === 1 ? 'Tmrw ' : '') + fmt(TIMES[i]);
    }
    return 'Full';
  }
  function dayInfo(d) {
    const now = new Date();
    const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d);
    return { dow: d === 0 ? 'Today' : DOW[dt.getDay()], num: dt.getDate(), mon: MON[dt.getMonth()], full: DOW[dt.getDay()] + ', ' + MON[dt.getMonth()] + ' ' + dt.getDate() };
  }
  function assignedSpec() {
    if (s.spec === 'any') return s.time !== null ? pool().find((p) => !busyFor(p.id, s.day, s.time)) : null;
    return SPECIALISTS.find((p) => p.id === s.spec);
  }
  function specLabel() {
    const sp = assignedSpec();
    return sp ? sp.name + (s.spec === 'any' ? ' (auto-assigned)' : '') : 'Any available';
  }
  function whenLabel() {
    const svc = service();
    const t = s.time !== null ? fmt(TIMES[s.time]) + ' – ' + fmt(TIMES[s.time] + (svc ? svc.dur : 0)) : '';
    return dayInfo(s.day).full + ' · ' + t;
  }
  const canNext = () => [!!s.loc, !!s.svc, !!s.spec, s.time !== null, true][s.step];

  /* ---------- Step templates ---------- */
  function stepLocation() {
    return '<h1>Book your next visit in under 2 minutes</h1>' +
      '<p class="lead">Pick where you want to go. You can change it later.</p>' +
      LOCATIONS.map((l) =>
        '<button class="card-btn' + (s.loc === l.id ? ' on' : '') + '" data-act="loc" data-arg="' + l.id + '">' +
        '<div class="tile">' + icons.pin + '</div>' +
        '<div class="grow"><span class="title">' + l.name + '</span><span class="sub">' + l.addr + '</span><span class="note">' + l.note + '</span></div>' +
        (s.loc === l.id ? icons.checkCircle : '') + '</button>'
      ).join('');
  }
  function stepService() {
    const list = SERVICES.filter((v) => s.cat === 'all' || v.cat === s.cat);
    return '<div class="chips">' + CATEGORIES.map((c) =>
      '<button class="chip' + (s.cat === c.id ? ' on' : '') + '" data-act="cat" data-arg="' + c.id + '">' + c.label + '</button>').join('') + '</div>' +
      list.map((v) =>
        '<button class="card-btn' + (s.svc === v.id ? ' on' : '') + '" data-act="svc" data-arg="' + v.id + '">' +
        '<div class="grow"><span class="title">' + esc(v.name) + '</span><span class="sub">' + v.dur + ' min · ' + CAT_LABEL[v.cat] + '</span></div>' +
        '<span class="price">$' + v.price + '</span></button>'
      ).join('');
  }
  function stepSpecialist() {
    const list = [{ id: 'any', name: 'Any available', role: 'Fastest free slot', initials: '★', avBg: '#0D50CA', avFg: '#FFFFFF' }].concat(pool());
    return '<p class="lead">Specialists who offer <b>' + esc(service().name) + '</b> at ' + location().name + '</p>' +
      list.map((p) =>
        '<button class="card-btn' + (s.spec === p.id ? ' on' : '') + '" data-act="spec" data-arg="' + p.id + '">' +
        '<div class="avatar" style="background:' + p.avBg + ';color:' + p.avFg + '">' + p.initials + '</div>' +
        '<div class="grow"><span class="title">' + esc(p.name) + '</span><span class="sub">' + esc(p.role) + '</span></div>' +
        '<span class="pill-green">' + firstFree(p.id) + '</span></button>'
      ).join('');
  }
  function stepTime() {
    let days = '';
    for (let d = 0; d < 7; d++) {
      const di = dayInfo(d);
      days += '<button class="day' + (s.day === d ? ' on' : '') + '" data-act="day" data-arg="' + d + '"><small>' + di.dow + '</small><b>' + di.num + '</b><i>' + di.mon + '</i></button>';
    }
    let free = 0;
    const slots = TIMES.map((m, i) => {
      const ok = freeAt(s.spec, s.day, i);
      if (ok) free++;
      return '<button class="slot' + (s.time === i ? ' on' : '') + '" data-act="time" data-arg="' + i + '"' + (ok ? '' : ' disabled aria-label="' + fmt(m) + ' unavailable"') + '>' + fmt(m) + '</button>';
    }).join('');
    const who = s.spec === 'any' ? 'any specialist' : assignedSpec().name.split(' ')[0];
    return '<div class="days">' + days + '</div>' +
      '<div class="slots-head"><b>Available times</b><span>' + free + ' free · ' + who + '</span></div>' +
      '<div class="slots">' + slots + '</div>' +
      '<div class="hint">' + icons.clock + ' Slots update in real time from the studio’s calendar, so no double bookings.</div>';
  }
  function stepReview() {
    const svc = service();
    return '<div class="summary">' +
      '<div class="r"><span>Service</span><b>' + esc(svc.name) + '</b></div>' +
      '<div class="r"><span>Specialist</span><b>' + esc(specLabel()) + '</b></div>' +
      '<div class="r"><span>When</span><b>' + whenLabel() + '</b></div>' +
      '<div class="r"><span>Where</span><b>Glow Studio ' + location().name + '</b></div><hr>' +
      '<div class="r"><b>Total (pay at the studio)</b><b style="font-size:16px">$' + svc.price + '</b></div></div>' +
      '<div class="field"><label for="tu-name">Your name</label><input id="tu-name" data-input="name" value="' + esc(s.name) + '" placeholder="Full name" autocomplete="name">' +
      '<label for="tu-phone">Mobile number</label><input id="tu-phone" data-input="phone" value="' + esc(s.phone) + '" placeholder="+593 9X XXX XXXX" inputmode="tel" autocomplete="tel"></div>' +
      '<div class="reminders"><b>Automatic reminders</b><div class="seg">' +
      ['WhatsApp', 'SMS', 'Email'].map((c) => '<button class="' + (s.channel === c ? 'on' : '') + '" data-act="channel" data-arg="' + c + '">' + c + '</button>').join('') +
      '</div><label class="check"><input type="checkbox" data-toggle="r24"' + (s.r24 ? ' checked' : '') + '> 24 hours before</label>' +
      '<label class="check"><input type="checkbox" data-toggle="r2"' + (s.r2 ? ' checked' : '') + '> 2 hours before</label></div>';
  }
  function stepDone() {
    const svc = service();
    const when = [s.r24 ? '24 h' : null, s.r2 ? '2 h' : null].filter(Boolean);
    const reminder = when.length
      ? 'We’ll remind you by ' + s.channel + ' ' + when.join(' and ') + ' before your appointment, and check in afterwards to hear how it went.'
      : 'Reminders are off. We’ll still send a short follow-up after your visit.';
    const el = s.elapsed;
    const elapsed = el >= 60 ? Math.floor(el / 60) + ' min ' + (el % 60) + ' s' : el + ' s';
    const first = s.name.trim() ? ', ' + esc(s.name.trim().split(' ')[0]) : '';
    return '<div class="success">' +
      '<div class="badge">' + icons.check(44, '#FFFFFF') + '</div>' +
      '<h1>You’re booked' + first + '!</h1>' +
      '<span class="pill-green">Booked in ' + elapsed + '</span>' +
      '<div class="box"><b>' + esc(svc.name) + '</b><span>' + whenLabel() + '</span><span>with ' + esc(specLabel()) + ' · Glow Studio ' + location().name + '</span></div>' +
      '<div class="info">' + icons.bell + '<span>' + reminder + '</span></div>' +
      '<button class="btn-outline">Add to my calendar</button>' +
      '<button class="btn-link" data-act="restart">Book another appointment</button></div>';
  }

  function render() {
    const steps = [stepLocation, stepService, stepSpecialist, stepTime, stepReview, stepDone];
    const inFlow = s.step < 5;
    const crumbs = [];
    if (location()) crumbs.push(location().name);
    if (service() && s.step > 1) crumbs.push(service().name);
    if (s.spec && s.step > 2) crumbs.push(s.spec === 'any' ? 'Any specialist' : assignedSpec().name.split(' ')[0]);
    const svc = service();

    root.innerHTML = '<div class="stage"><div class="phone">' +
      '<div class="b-head"><div class="b-row">' +
      (s.step > 0 && inFlow ? '<button class="icon-btn" aria-label="Back" data-act="back">' + icons.back + '</button>' : '') +
      '<div class="biz"><strong>Glow Studio</strong><span>Hair · Spa · Wellness · Guayaquil</span></div>' +
      '<div class="powered"><img src="assets/timeup-icon.png" alt="">TimeUp</div></div>' +
      (inFlow ? '<div class="progress">' + [0, 1, 2, 3, 4].map((i) => '<span class="' + (i <= s.step ? 'on' : '') + '"></span>').join('') + '</div>' +
        '<div class="step-meta"><b>' + TITLES[s.step] + '</b><span>Step ' + (s.step + 1) + ' of 5</span></div>' : '') +
      '</div>' +
      '<div class="b-body">' + steps[s.step]() + '</div>' +
      (inFlow ? '<div class="b-foot">' + (s.step > 0 && crumbs.length ? '<div class="crumbs">' + esc(crumbs.join(' · ')) + '</div>' : '') +
        '<button class="cta" data-act="next"' + (canNext() ? '' : ' disabled') + '>' + (s.step === 4 ? 'Confirm booking · $' + svc.price : 'Continue') + '</button></div>' : '') +
      '</div></div>';
  }

  function onClick(e) {
    const b = e.target.closest('[data-act]');
    if (!b || b.disabled) return;
    const a = b.dataset.act, v = b.dataset.arg;
    if (a === 'loc') Object.assign(s, { loc: v, spec: null, time: null });
    else if (a === 'cat') s.cat = v;
    else if (a === 'svc') Object.assign(s, { svc: v, spec: null, time: null });
    else if (a === 'spec') Object.assign(s, { spec: v, time: null });
    else if (a === 'day') Object.assign(s, { day: +v, time: null });
    else if (a === 'time') s.time = +v;
    else if (a === 'channel') s.channel = v;
    else if (a === 'back') s.step = Math.max(0, s.step - 1);
    else if (a === 'restart') s = fresh();
    else if (a === 'next') {
      if (!canNext()) return;
      if (s.step === 4) { s.elapsed = Math.max(1, Math.round((Date.now() - s.start) / 1000)); s.step = 5; }
      else s.step += 1;
    }
    render();
  }
  function onInput(e) {
    const f = e.target.dataset.input;
    if (f) s[f] = e.target.value; // no re-render, keeps focus
  }
  function onChange(e) {
    const t = e.target.dataset.toggle;
    if (t) { s[t] = e.target.checked; }
  }

  return {
    mount(el) {
      root = el;
      root.onclick = onClick;
      root.oninput = onInput;
      root.onchange = onChange;
      render();
    }
  };
})();
