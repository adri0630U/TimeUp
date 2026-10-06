/* Screen 2 – Automated reminders and post-visit follow-up */
window.MessagesView = (function () {
  const { icons } = window.TU;
  const ALTS = [
    { label: 'Tue, Oct 6 · 3:00 PM', time: '3:00 PM' },
    { label: 'Wed, Oct 7 · 10:30 AM', time: '10:30 AM' },
    { label: 'Thu, Oct 8 · 11:00 AM', time: '11:00 AM' }
  ];
  const WORDS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];
  let s = { reply: null, alt: null, rating: 0, rebooked: false };
  let root = null;

  function render() {
    const apptTime = s.reply === 'resched' && s.alt !== null ? ALTS[s.alt].time : '10:30 AM';
    let h = '<div class="stage"><div class="phone">' +
      '<div class="m-head"><div class="av"><img src="assets/timeup-icon.png" alt="TimeUp"></div>' +
      '<div><strong>Glow Studio</strong><span>Automated messages · sent by TimeUp</span></div></div>' +
      '<div class="m-body">';

    h += '<div class="sys">Booking confirmed · Sun 4:12 PM</div>' +
      '<div class="in"><span>Hi Ana! Your <b>Haircut &amp; styling</b> with Andrea is booked for <b>Tue, Oct 6 at 10:30 AM</b> at Glow Studio Urdesa.</span>' +
      '<button class="btn-s">Add to calendar</button></div>';

    h += '<div class="sys">Reminder · 24 h before</div>' +
      '<div class="in"><span>See you tomorrow at 10:30 AM with Andrea. Can you make it?</span>' +
      (s.reply === null ? '<div class="row2"><button class="btn-p" data-act="confirm">Confirm</button><button class="btn-s" data-act="resched">Reschedule</button></div>' : '') +
      '</div>';
    if (s.reply === 'confirm') h += '<div class="out">' + icons.check(16, 'currentColor') + ' Confirmed</div>';
    if (s.reply === 'resched') {
      h += '<div class="out">Reschedule</div>' +
        '<div class="in"><span>No problem. Andrea is free at these times. Your old slot is released for other clients.</span><div class="stack">' +
        ALTS.map((a, i) => '<button class="' + (s.alt === i ? 'btn-p' : 'btn-s') + '" data-act="alt" data-arg="' + i + '">' + a.label + (s.alt === i ? '  ·  Booked' : '') + '</button>').join('') +
        '</div></div>';
    }

    h += '<div class="sys">Reminder · 2 h before</div>' +
      '<div class="in"><span>Your appointment starts at ' + apptTime + '. Please arrive 5 minutes early.</span><a href="#" onclick="return false">Get directions</a></div>';

    h += '<div class="sys">Follow-up · after the visit</div>' +
      '<div class="in"><span>Thanks for visiting, Ana! How easy was it to book and how was your haircut?</span><div class="stars">' +
      [1, 2, 3, 4, 5].map((n) => '<button class="star' + (n <= s.rating ? ' on' : '') + '" data-act="rate" data-arg="' + n + '" aria-label="' + n + ' star' + (n > 1 ? 's' : '') + '">' + icons.star(n <= s.rating ? '#E8A317' : 'none') + '</button>').join('') +
      '</div></div>';

    if (s.rating > 0) {
      h += '<div class="out">' + s.rating + ' / 5 · ' + WORDS[s.rating] + '</div>' +
        '<div class="in"><span>Thank you! A cut usually lasts about 4 weeks. Want to save your next visit with Andrea now?</span>' +
        (s.rebooked
          ? '<div class="ok">' + icons.check(18, 'currentColor') + ' Next visit booked: Tue, Nov 3 · 10:30 AM</div>'
          : '<div class="stack"><button class="btn-p" data-act="rebook">Book Tue, Nov 3 · 10:30 AM</button><button class="btn-s">See other times</button></div>') +
        '</div>';
    }

    h += '</div></div></div>';
    root.innerHTML = h;
  }

  function onClick(e) {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const a = b.dataset.act, v = b.dataset.arg;
    if (a === 'confirm') s.reply = 'confirm';
    else if (a === 'resched') s.reply = 'resched';
    else if (a === 'alt') s.alt = +v;
    else if (a === 'rate') s.rating = +v;
    else if (a === 'rebook') s.rebooked = true;
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
