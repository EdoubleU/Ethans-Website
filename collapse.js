// collapse.js
// Animates <details> open/close for .blog-post elements.
// Falls back to native (instant) behavior if anything goes wrong,
// and skips animation entirely when the user prefers reduced motion.

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.blog-post details').forEach((details) => {
    const summary = details.querySelector('summary');
    const content = details.querySelector('.post-content');
    const dateEl = details.querySelector('.post-date');
    if (!summary || !content) return;

    let animation = null;
    let isClosing = false;
    let isExpanding = false;

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      details.style.overflow = 'hidden';

      if (isClosing || !details.open) {
        openDetails();
      } else if (isExpanding || details.open) {
        shrink();
      }
    });

    function shrink() {
      isClosing = true;
      const startHeight = `${details.offsetHeight}px`;
      const endHeight = `${summary.offsetHeight}px`;

      if (animation) animation.cancel();

      animation = details.animate(
        { height: [startHeight, endHeight] },
        { duration: prefersReducedMotion ? 0 : 220, easing: 'ease-out' }
      );

      animation.onfinish = () => onAnimationFinish(false);
      animation.oncancel = () => { isClosing = false; };
    }

    function openDetails() {
      details.style.height = `${details.offsetHeight}px`;
      details.open = true;
      window.requestAnimationFrame(() => expand());
    }

    function expand() {
      isExpanding = true;
      const startHeight = `${details.offsetHeight}px`;
      const endHeight = `${summary.offsetHeight + (dateEl ? dateEl.offsetHeight : 0) + content.offsetHeight}px`;

      if (animation) animation.cancel();

      animation = details.animate(
        { height: [startHeight, endHeight] },
        { duration: prefersReducedMotion ? 0 : 220, easing: 'ease-out' }
      );

      animation.onfinish = () => onAnimationFinish(true);
      animation.oncancel = () => { isExpanding = false; };
    }

    function onAnimationFinish(open) {
      details.open = open;
      animation = null;
      isClosing = false;
      isExpanding = false;
      details.style.height = '';
      details.style.overflow = '';
    }
  });
});

