DIST_DIR=dist
rm -rf $DIST_DIR
npm run build
cd dist
git init
git add -A
git commit -m 'Auto deploy to GitHub Pages.'
git push -f git@github.com:gera2ld/github-widget-lite.git master:gh-pages
