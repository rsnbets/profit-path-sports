/* Email gate for the Exchange Guide (hub, four venue pages, Reading the book).

   One file, loaded by all six pages. A page is gated only if it marks sections
   with [data-gated] and carries the #ppsGate card. The hub marks nothing, so it
   is open.

   PPS_GATE.endpoint is the signup POST URL. While it is empty the gate is OFF on
   every page and every section shows, so nobody hands over an email that goes
   nowhere. One unlock covers every gated page (shared storage key).

   The form's data-source attribute names the page the signup came from:
   guide-hub, guide-prophetx, guide-novig, guide-polymarket, guide-kalshi,
   guide-reads. */
(function () {
  var PPS_GATE = {
    endpoint: '',
    emailField: 'fields[email]',
    key: 'pps_exchange_guides_unlocked',
    fallbackMail: 'dr.rob@profitpathsports.com'
  };

  function read() { try { return localStorage.getItem(PPS_GATE.key) === '1'; } catch (e) { return false; } }
  function write() { try { localStorage.setItem(PPS_GATE.key, '1'); } catch (e) {} }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  var gated = document.querySelectorAll('[data-gated]');
  var card = document.getElementById('ppsGate');

  function reveal() {
    gated.forEach(function (el) { el.classList.remove('gate-hidden'); });
    if (card) card.hidden = true;
  }

  function send(email, source) {
    if (!PPS_GATE.endpoint) {
      window.location.href = 'mailto:' + PPS_GATE.fallbackMail +
        '?subject=' + encodeURIComponent('Founding list') +
        '&body=' + encodeURIComponent('Add me to the founding list: ' + email + ' (from ' + source + ')');
      return Promise.resolve();
    }
    var fd = new FormData();
    fd.append(PPS_GATE.emailField, email);
    fd.append('fields[source]', source);
    fd.append('ml-submit', '1');
    fd.append('anticsrf', 'true');
    return fetch(PPS_GATE.endpoint, { method: 'POST', mode: 'no-cors', body: fd });
  }

  function wire(form, onDone) {
    if (!form) return;
    var input = form.querySelector('input[type=email]');
    var btn = form.querySelector('button');
    var msg = form.parentElement.querySelector('.gate-msg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = (input.value || '').trim();
      if (!validEmail(v)) { if (msg) msg.textContent = 'That email does not look right.'; return; }
      btn.disabled = true;
      if (msg) msg.textContent = 'Sending...';
      send(v, form.getAttribute('data-source') || location.pathname).then(function () {
        if (msg) msg.textContent = 'You are on the list.';
        onDone();
      }).catch(function () {
        btn.disabled = false;
        if (msg) msg.textContent = 'Something went wrong. Try again.';
      });
    });
  }

  if (PPS_GATE.endpoint && gated.length && !read()) {
    gated.forEach(function (el) { el.classList.add('gate-hidden'); });
    if (card) card.hidden = false;
  } else {
    reveal();
  }

  wire(document.getElementById('ppsGateForm'), function () { write(); reveal(); });
  /* The playbook's founding form. Goes away when Reading the book is trimmed (build step 6). */
  wire(document.getElementById('ppsFoundingForm'), function () { write(); });
})();
