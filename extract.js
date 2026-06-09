const fs = require('fs');

const html = fs.readFileSync('public/index.html', 'utf-8');

const styleStart = html.indexOf('<style>');
const styleEnd = html.indexOf('</style>');

if (styleStart !== -1 && styleEnd !== -1) {
  const css = html.substring(styleStart + 7, styleEnd);
  fs.writeFileSync('public/css/style.css', css.trim());

  const newHtml = html.replace(html.substring(styleStart, styleEnd + 8), '<link rel="stylesheet" href="/css/style.css">');
  fs.writeFileSync('public/index.html', newHtml);
}

const scriptStart = html.indexOf('<script>');
const scriptEnd = html.lastIndexOf('</script>');

if (scriptStart !== -1 && scriptEnd !== -1) {
  const js = html.substring(scriptStart + 8, scriptEnd);
  fs.writeFileSync('public/js/all.js', js.trim());

  const newHtml2 = fs.readFileSync('public/index.html', 'utf-8').replace(html.substring(scriptStart, scriptEnd + 9), '<script src="/js/api.js"></script>\n<script src="/js/render.js"></script>\n<script src="/js/game.js"></script>');
  fs.writeFileSync('public/index.html', newHtml2);
}
