set -x
set -e

mkdir -p out
cd explorer
rm -rf src/**/*.js
rm -rf src/**/*.js.map
npm install
npm run build
rm -rf ../out/webview
mv build ../out/webview
cd ../

