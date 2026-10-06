/* Screen 3 – Business dashboard: one calendar for every specialist */
window.DashboardView = (function () {
  const { esc, fmt, icons, SPECIALISTS } = window.TU;
  const HOUR = 64, START = 9 * 60, OPEN_MIN = 540;

  // [id, specialist, start (min after 9:00), duration, client, service, status, source, visits]
  const APPOINTMENTS = [
    ['a1', 'andrea', 0, 45, 'Ana Torres', 'Haircut & styling', 'done', 'Website', 6],
    ['a2', 'andrea', 60, 45, 'Luis Paredes', 'Haircut & styling', 'confirmed', 'Instagram', 3],
    ['a3', 'andrea', 150, 120, 'María José Cedeño', 'Color & highlights', 'confirmed', 'WhatsApp link', 9],
    ['a4', 'andrea', 300, 45, 'Pedro Salazar', 'Haircut & styling', 'scheduled', 'Website', 1],
    ['a5', 'andrea', 390, 45, 'Gabriela Mena', 'Haircut & styling', 'awaiting', 'Instagram', 2],
    ['b1', 'carlos', 30, 120, 'Karla Rivas', 'Color & highlights', 'done', 'Website', 4],
    ['b2', 'carlos', 210, 45, 'Diego Franco', 'Haircut & styling', 'awaiting', 'WhatsApp link', 1],
    ['b3', 'carlos', 270, 120, 'Paula Ortega', 'Color & highlights', 'scheduled', 'Website', 5],
    ['c1', 'daniela', 0, 60, 'Fernanda Gil', 'Relaxing massage', 'done', 'Instagram', 7],
    ['c2', 'daniela', 90, 60, 'Roberto Haro', 'Relaxing massage', 'confirmed', 'Website', 2],
    ['c3', 'daniela', 240, 60, 'Camila Ríos', 'Relaxing massage', 'awaiting', 'WhatsApp link', 3],
    ['c4', 'daniela', 360, 60, 'Andrés Vélez', 'Relaxing massage', 'scheduled', 'Website', 1],
    ['d1', 'valeria', 30, 50, 'Isabel Quinde', 'Facial treatment', 'confirmed', 'Instagram', 5],
    ['d2', 'valeria', 120, 40, 'Lucía Arteaga', 'Gel manicure', 'awaiting', 'Website', 2],
    ['d3', 'valeria', 210, 50, 'Sara Montero', 'Facial treatment', 'confirmed', 'Website', 8],
    ['d4', 'valeria', 330, 40, 'Natalia Pazmiño', 'Gel manicure', 'scheduled', 'WhatsApp link', 1],
    ['e1', 'sofia', 0, 40, 'Verónica Loor', 'Gel manicure', 'done', 'Instagram', 11],
    ['e2', 'sofia', 60, 40, 'Daniela Castro', 'Gel manicure', 'confirmed', 'Website', 3],
    ['e3', 'sofia', 180, 40, 'Elena Burgos', 'Gel manicure', 'awaiting', 'Instagram', 2],
    ['e4', 'sofia', 300, 40, 'Mónica Zambrano', 'Gel manicure', 'scheduled', 'Website', 4],
    ['e5', 'sofia', 420, 40, 'Julia Andrade', 'Gel manicure', 'confirmed', 'WhatsApp link', 6]
  ];

  const STATUS = {
    done: { label: 'Completed', bg: '#EEF0F4', border: '#9AA3B5', fg: '#3D4760', line: 'solid' },
    confirmed: { label: 'Confirmed by client', bg: '#DCE8FF', border: '#0D50CA', fg: '#0B2E70', line: 'solid' },
    awaiting: { label: 'Reminder sent · awaiting reply', bg: '#FFEBD6', border: '#C2620A', fg: '#6B3300', line: 'solid' },
    scheduled: { label: 'Reminder scheduled', bg: '#FFFFFF', border: '#8793AD', fg: '#0B1B3F', line: 'dashed' },
    noshow: { label: 'No-show', bg: '#FDE4E1', border: '#A21C0F', fg: '#7A1409', line: 'solid' }
  };
  const NAV = ['Calendar', 'Clients', 'Specialists', 'Reminders', 'Reports', 'Settings'];
  const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  let s = { filter: 'all', selected: 'a4', overrides: {}, nav: 'Calendar' };
  let root = null;

  const appts = () => APPOINTMENTS.map((r) => ({
    id: r[0], spec: r[1], start: r[2], dur: r[3], client: r[4], service: r[5],
    status: s.overrides[r[0]] || r[6], base: r[6], source: r[7], visits: r[8]
  }));
  const range = (a) => fmt(START + a.start) + ' – ' + fmt(START + a.start + a.dur);
  const statusStyle = (st) => 'background:' + st.bg + ';border:2px ' + st.line + ' ' + st.border + ';color:' + st.fg;

  function render() {
    const A = appts();
    const total = A.length;
    const bookedAll = A.reduce((t, a) => t + a.dur, 0);
    const confirmedN = A.filter((a) => a.status === 'confirmed' || a.status === 'done').length;
    const awaitingN = A.filter((a) => a.status === 'awaiting').length;
    const noshowN = A.filter((a) => a.status === 'noshow').length;
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes() - START;
    const visible = SPECIALISTS.filter((p) => s.filter === 'all' || s.filter === p.id);
    const cols = '64px repeat(' + visible.length + ', minmax(150px, 1fr))';

    /* Sidebar */
    let h = '<div class="dash"><aside class="side"><div class="logo"><div><img src="assets/timeup-icon.png" alt=""></div><div><b>TimeUp</b><span>Glow Studio</span></div></div><nav aria-label="Dashboard">' +
      NAV.map((l) => '<button class="nav-btn' + (s.nav === l ? ' on' : '') + '" data-act="nav" data-arg="' + l + '"><i></i>' + l +
        (l === 'Reminders' && awaitingN ? '<em>' + awaitingN + '</em>' : '') + '</button>').join('') +
      '</nav><div class="linkbox">Booking link<b>glowstudio.ec/book</b>Embedded on website, Instagram &amp; WhatsApp</div></aside>';

    /* Header + KPIs + filters */
    h += '<section class="content"><div class="d-top"><div class="t"><h1>Today’s calendar</h1><span>' +
      DOW[now.getDay()] + ', ' + MON[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear() + ' · Open 9:00 AM – 6:00 PM</span></div>' +
      '<label for="loc">Location</label><select id="loc"><option>Urdesa</option><option>Samborondón</option></select>' +
      '<button class="btn-new">' + icons.plus + ' New appointment</button></div>';

    const kpis = [
      ['Appointments today', String(total), 'Across ' + SPECIALISTS.length + ' specialists · 0 double bookings'],
      ['Team occupancy', Math.round((bookedAll / (OPEN_MIN * SPECIALISTS.length)) * 100) + '%', 'Booked hours vs. open hours'],
      ['Confirmed or completed', confirmedN + ' / ' + total, awaitingN + ' reminders awaiting a reply'],
      ['No-shows today', String(noshowN), 'Tracked against the pre-TimeUp baseline']
    ];
    h += '<div class="kpis">' + kpis.map((k) => '<div class="kpi"><span>' + k[0] + '</span><b>' + k[1] + '</b><small>' + k[2] + '</small></div>').join('') + '</div>';

    h += '<div class="filters"><span>Specialists</span>' +
      [{ id: 'all', label: 'All' }].concat(SPECIALISTS.map((p) => ({ id: p.id, label: p.name.split(' ')[0] })))
        .map((f) => '<button class="fchip' + (s.filter === f.id ? ' on' : '') + '" data-act="filter" data-arg="' + f.id + '">' + esc(f.label) + '</button>').join('') +
      '<div class="legend">' + ['confirmed', 'awaiting', 'scheduled', 'done', 'noshow'].map((k) => {
        const st = STATUS[k];
        return '<span><i style="background:' + st.bg + ';border-color:' + st.border + ';border-style:' + st.line + '"></i>' + st.label.split(' · ')[0] + '</span>';
      }).join('') + '</div></div>';

    /* Calendar */
    h += '<div class="d-main"><div class="cal"><div style="min-width:' + (64 + visible.length * 150) + 'px">' +
      '<div class="cal-grid cal-head" style="grid-template-columns:' + cols + '"><div></div>' +
      visible.map((p) => {
        const mine = A.filter((a) => a.spec === p.id);
        const occ = Math.round((mine.reduce((t, a) => t + a.dur, 0) / OPEN_MIN) * 100);
        return '<div class="col-head"><div class="avatar" style="background:' + p.avBg + ';color:' + p.avFg + '">' + p.initials + '</div>' +
          '<div><b>' + esc(p.name) + '</b><small>' + mine.length + ' appts · ' + occ + '% booked</small></div></div>';
      }).join('') + '</div>';

    let hours = '';
    for (let hr = 9; hr < 18; hr++) hours += '<div class="hour">' + fmt(hr * 60) + '</div>';
    h += '<div class="cal-grid cal-body" style="grid-template-columns:' + cols + '"><div>' + hours + '</div>' +
      visible.map((p) => '<div class="col">' + A.filter((a) => a.spec === p.id).map((a) => {
        const st = STATUS[a.status];
        return '<button class="appt' + (a.dur < 60 ? ' short' : '') + (s.selected === a.id ? ' sel' : '') + '" data-act="select" data-arg="' + a.id + '" ' +
          'aria-label="' + esc(a.client + ', ' + range(a) + ', ' + st.label) + '" ' +
          'style="top:' + ((a.start / 60) * HOUR + 1) + 'px;height:' + ((a.dur / 60) * HOUR - 3) + 'px;' + statusStyle(st) + '">' +
          '<b>' + esc(a.client) + '</b><span>' + fmt(START + a.start) + ' · ' + esc(a.service) + '</span></button>';
      }).join('') + (nowMin > 0 && nowMin < OPEN_MIN ? '<div class="now" style="top:' + (nowMin / 60) * HOUR + 'px"></div>' : '') + '</div>').join('') +
      '</div></div></div>';

    /* Detail panel */
    const a = A.find((x) => x.id === s.selected) || A[0];
    const st = STATUS[a.status];
    const spec = SPECIALISTS.find((p) => p.id === a.spec);
    const isDone = a.status === 'done';
    const sent24 = a.status !== 'scheduled';
    const sent2 = isDone || a.status === 'noshow';
    const timeline = [
      ['Booking confirmation', 'Sent', true],
      ['Reminder · 24 h before', sent24 ? 'Sent' : 'Today 6:00 PM', sent24],
      ['Reminder · 2 h before', sent2 ? 'Sent' : 'Scheduled', sent2],
      ['Follow-up & rebook offer', isDone ? 'Sent' : 'After visit', isDone]
    ];
    const canUndo = !!s.overrides[a.id] && s.overrides[a.id] !== a.base;

    h += '<aside class="detail"><div><div class="eyebrow">Appointment</div><h2>' + esc(a.client) + '</h2>' +
      '<span class="status" style="background:' + st.bg + ';color:' + st.fg + ';border-color:' + st.border + ';border-style:' + st.line + '">' + st.label + '</span></div>' +
      '<div class="kv"><div><span>Service</span><b>' + esc(a.service) + '</b></div><div><span>Time</span><b>' + range(a) + '</b></div>' +
      '<div><span>Specialist</span><b>' + esc(spec.name) + '</b></div><div><span>Booked via</span><b>' + a.source + '</b></div>' +
      '<div><span>Visits</span><b>' + (a.visits === 1 ? 'First visit' : a.visits + ' visits') + '</b></div></div><hr>' +
      '<div class="tl"><b>Automated messages</b>' + timeline.map((t) =>
        '<div class="tl-row"><span class="dot' + (t[2] ? ' done' : '') + '">' + (t[2] ? icons.check(12, '#FFFFFF', 3.4) : '') + '</span><b>' + t[0] + '</b><span>' + t[1] + '</span></div>').join('') + '</div>' +
      '<div class="actions">' +
      (a.status === 'scheduled' ? '<button class="btn-p" data-act="status" data-arg="awaiting">Send reminder now</button>' : '') +
      (a.status === 'scheduled' || a.status === 'awaiting' ? '<button class="btn-s" data-act="status" data-arg="confirmed">Mark as confirmed</button>' : '') +
      (a.status !== 'done' && a.status !== 'noshow' ? '<button class="btn-danger" data-act="status" data-arg="noshow">Mark as no-show</button>' : '') +
      (canUndo ? '<button class="btn-s" data-act="undo">Undo change</button>' : '') +
      '</div></aside></div></section></div>';

    root.innerHTML = h;
  }

  function onClick(e) {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const a = b.dataset.act, v = b.dataset.arg;
    if (a === 'nav') s.nav = v;
    else if (a === 'filter') s.filter = v;
    else if (a === 'select') s.selected = v;
    else if (a === 'status') s.overrides = Object.assign({}, s.overrides, { [s.selected]: v });
    else if (a === 'undo') { const o = Object.assign({}, s.overrides); delete o[s.selected]; s.overrides = o; }
    render();
  }

  return {
    mount(el) {
      root = el;
      root.onclick = onClick;
      root.oninput = null;
      root.onchange = null;
      render();
    }
  };
})();
