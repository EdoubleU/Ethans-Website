const allDetails = document.querySelectorAll("details");

allDetails.forEach((details) => {
  const content = details.querySelector(".post-content");
  const article = details.closest(".blog-post");

  details.addEventListener("toggle", () => {
    if (details.open) {
      // Close all other posts
      allDetails.forEach((other) => {
        if (other !== details) {
          other.removeAttribute("open");
        }
      });

      // Update URL hash
      if (article?.id) {
        history.replaceState(null, "", `#${article.id}`);
      }

      // Open animation
      const height = content.scrollHeight;
      content.animate(
        [{ height: "0px" }, { height: height + "px" }],
        { duration: 300, easing: "ease-out" }
      );
    } else {
      // Close animation
      const height = content.scrollHeight;
      content.animate(
        [{ height: height + "px" }, { height: "0px" }],
        { duration: 250, easing: "ease-in" }
      );
    }
  });
});

// Open post from URL hash on page load
window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.slice(1);
  if (!hash) return;

  const article = document.getElementById(hash);
  if (!article) return;

  const details = article.querySelector("details");
  if (!details) return;

  // Close others
  allDetails.forEach((d) => d.removeAttribute("open"));

  details.setAttribute("open", "");

  // Scroll into view
  article.scrollIntoView({ behavior: "smooth", block: "start" });
});
