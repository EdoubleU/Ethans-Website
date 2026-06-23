// email-protect.js
// Keeps the contact email out of the page's raw HTML/JS source so basic
// scraping bots (which look for "mailto:" links or "name@domain" patterns
// in static markup) can't pick it up. The address is stored base64-encoded
// and is only decoded and turned into a mailto: link at the moment of the
// click — nothing resembling an email address exists in the source at all.
//
// This isn't bulletproof against a bot sophisticated enough to run a full
// browser and execute JS on click, but it stops the vast majority of
// simple harvesters that just regex the page source.

document.addEventListener('DOMContentLoaded', () => {
  const emailBtn = document.getElementById('email-btn');
  if (!emailBtn) return;

  const encoded = 'ZXRoYW53aW5nQHByb3Rvbi5tZQ==';

  emailBtn.addEventListener('click', () => {
    const address = atob(encoded);
    window.location.href = `mailto:${address}`;
  });
});
