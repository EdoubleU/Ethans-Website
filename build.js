/**
 * build.js
 * Runs during every Netlify deploy (see netlify.toml).
 * Reads all Markdown files in the posts/ folder, parses their
 * frontmatter (title, date) and body, then writes a single
 * posts/index.json that blog.html fetches to render posts.
 *
 * No npm dependencies — uses only Node.js built-ins.
 */

const fs   = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'posts');
const OUT_FILE  = path.join(POSTS_DIR, 'index.json');

// ---- Frontmatter parser ----
// Handles the --- delimited YAML frontmatter that Decap writes.
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { body: raw.trim() };

  const fm = {};
  match[1].split('\n').forEach(function (line) {
    var colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    var key = line.slice(0, colonIdx).trim();
    var val = line.slice(colonIdx + 1).trim()
                  .replace(/^["'](.*)["']$/, '$1');  // strip quotes
    fm[key] = val;
  });

  return Object.assign({}, fm, { body: match[2].trim() });
}

// ---- Date parser for sorting ----
// Handles both "M/D/YYYY" (our display format) and "YYYY-MM-DD"
function parseDate(str) {
  if (!str) return new Date(0);
  // M/D/YYYY
  var slash = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slash) return new Date(+slash[3], +slash[1] - 1, +slash[2]);
  // YYYY-MM-DD or ISO
  var d = new Date(str);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

// ---- Main ----
if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
  console.log('posts/ directory created.');
}

var mdFiles = fs.readdirSync(POSTS_DIR)
  .filter(function (f) { return f.endsWith('.md'); });

var posts = mdFiles.map(function (filename) {
  var slug    = filename.replace(/\.md$/, '');
  var content = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
  var parsed  = parseFrontmatter(content);

  return {
    slug:  slug,
    title: parsed.title || slug,
    date:  parsed.date  || '',
    body:  parsed.body  || ''
  };
});

// Sort newest first
posts.sort(function (a, b) {
  return parseDate(b.date) - parseDate(a.date);
});

var output = JSON.stringify({ posts: posts }, null, 2);
fs.writeFileSync(OUT_FILE, output);

console.log('posts/index.json written — ' + posts.length + ' post(s).');
posts.forEach(function (p) {
  console.log('  • ' + p.slug + ' (' + (p.date || 'no date') + ')');
});
