// ─── scripts.js ──────────────────────────────────────────────────
// Handles: tab switching, lazy loading embeds, resume modal overlay

(() => {
  'use strict';

  // ── Element references ─────────────────────────────────────────
  const homeBtn       = document.getElementById('home-btn');
  const resumeBtn     = document.getElementById('resume-btn');
  const resumeOverlay = document.getElementById('resume-overlay');
  const resumeClose   = document.getElementById('resume-close');
  const resumeWrap    = document.getElementById('resume-frame-wrap');
  const tabBar        = document.getElementById('tab-bar');
  const contentArea   = document.getElementById('content-area');
  const btnMusic      = document.getElementById('btn-music');
  const btnPhotos     = document.getElementById('btn-photos');
  const btnGames      = document.getElementById('btn-games');

  // ── Lazy-load flags (each embed loads only once per session) ───
  let resumeLoaded  = false;
  let beholdLoaded  = false;

  // ── Helpers ────────────────────────────────────────────────────

  /** Clear active state from all tab buttons */
  function clearActive() {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  }

  /**
   * Show the content area with new HTML, hide the tab bar.
   * Passes optional postInsert callback for widgets that need
   * the element to be in the DOM before initialising.
   */
  function showContent(html, activeBtn, postInsert) {
    clearActive();

    contentArea.innerHTML = html;
    contentArea.removeAttribute('hidden');

    // Hide the tab bar — widget takes over the full container
    tabBar.setAttribute('hidden', '');

    // Scroll main into view smoothly
    document.getElementById('main').scrollIntoView({ behavior: 'smooth' });

    if (typeof postInsert === 'function') postInsert();
  }

  /** Reset: hide content area, show tab bar, clear active buttons */
  function showDefault() {
    clearActive();
    contentArea.innerHTML = '';
    contentArea.setAttribute('hidden', '');

    // Restore the tab bar
    tabBar.removeAttribute('hidden');

    tabBar.scrollIntoView({ behavior: 'smooth' });
  }

  // ── Tab: Music ─────────────────────────────────────────────────
  function showMusic() {
    const html = `
      <div class="embed-wrap">
        <iframe
          width="100%" height="300"
          scrolling="no" frameborder="no" allow="autoplay"
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A2205460061&color=%23548f59&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true">
        </iframe>
      </div>
      <p class="sc-credit">
        <a href="https://soundcloud.com/cowpatch-media" target="_blank" rel="noopener">Cowpatch Media</a>
        &middot;
        <a href="https://soundcloud.com/cowpatch-media/sets/concrete-echoes-ep" target="_blank" rel="noopener">MC Cowpatch: Concrete Echoes EP</a>
      </p>`;
    showContent(html, btnMusic);
  }

  // ── Tab: Photos ────────────────────────────────────────────────
  function showPhotos() {
    const html = `<div class="photos-wrap"><behold-widget feed-id="BsmxDO1yIIL1zPsolSGb"></behold-widget></div>`;

    showContent(html, btnPhotos, () => {
      // Lazy-load Behold widget script only once
      if (!beholdLoaded) {
        const s = document.createElement('script');
        s.type = 'module';
        s.src  = 'https://w.behold.so/widget.js';
        document.head.appendChild(s);
        beholdLoaded = true;
      }
    });
  }

  // ── Tab: Games ─────────────────────────────────────────────────
  function showGames() {
    const html = `
      <div class="game-wrap">
        <iframe
          src="game/dicegolfv2.html"
          width="640" height="480"
          allowfullscreen
          title="Dice Golf v2">
        </iframe>
      </div>`;
    showContent(html, btnGames);
  }

  // ── Resume Modal ───────────────────────────────────────────────
  function openResume() {
    // Lazy-load PDF iframe only on first open
    if (!resumeLoaded) {
      const iframe = document.createElement('iframe');
      // URL-encode the filename to handle the spaces
      iframe.src   = 'website-images/cowpatch-resume.pdf';
      iframe.title = 'Cowpatch Media Resume';
      resumeWrap.appendChild(iframe);
      resumeLoaded = true;
    }
    resumeOverlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden'; // prevent page scroll behind modal
    resumeClose.focus();
  }

  function closeResume() {
    resumeOverlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  // ── Event Listeners ────────────────────────────────────────────
  homeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  resumeBtn.addEventListener('click', (e) => { e.preventDefault(); openResume(); });
  resumeClose.addEventListener('click', closeResume);

  // Close modal on backdrop click
  resumeOverlay.addEventListener('click', (e) => {
    if (e.target === resumeOverlay) closeResume();
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !resumeOverlay.hidden) closeResume();
  });

  btnMusic.addEventListener('click',  showMusic);
  btnPhotos.addEventListener('click', showPhotos);
  btnGames.addEventListener('click',  showGames);

})();