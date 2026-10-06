/* Simple hash router: #booking, #messages, #dashboard */
(function () {
  const views = { booking: window.BookingView, messages: window.MessagesView, dashboard: window.DashboardView };
  const app = document.getElementById('app');
  const tabs = document.querySelectorAll('.tab');

  function show() {
    const name = (location.hash || '#booking').slice(1);
    const view = views[name] ? name : 'booking';
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.view === view));
    views[view].mount(app);
  }

  tabs.forEach((t) => t.addEventListener('click', () => { location.hash = t.dataset.view; }));
  window.addEventListener('hashchange', show);
  show();
})();
