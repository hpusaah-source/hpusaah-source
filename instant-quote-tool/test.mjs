import { chromium } from 'playwright';
import { pathToFileURL } from 'url';
import path from 'path';

const file = pathToFileURL(path.resolve('index.html')).href;

// Mirror of the page's pricing model, to independently verify the DOM output.
const P = { base: 49, perBedroom: 22, perBathroom: 28, perSqft: 0.045, deepMult: 1.4, min: 89 };
function expectedTotal(bed, bath, sqft, deep) {
  let sub = P.base + bed * P.perBedroom + bath * P.perBathroom + sqft * P.perSqft;
  let total = deep ? sub * P.deepMult : sub;
  if (total < P.min) total = P.min;
  return Math.round(total); // page displays rounded to whole dollars
}
function money(n) { return '$' + Math.round(n).toLocaleString(); }

const consoleErrors = [];
const pageErrors = [];

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await browser.newContext();
// grant clipboard so copy path doesn't throw
await ctx.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
const page = await ctx.newPage();
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => pageErrors.push(e.message));

let pass = 0, fail = 0;
function check(name, cond, extra = '') {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; console.log('  ✗ ' + name + (extra ? '  -> ' + extra : '')); }
}

await page.goto(file);

const cases = [
  { bed: 3, bath: 2, sqft: 1500, deep: false },
  { bed: 3, bath: 2, sqft: 1500, deep: true },
  { bed: 0, bath: 0, sqft: 100, deep: false }, // tiny -> min price
  { bed: 5, bath: 4, sqft: 4000, deep: true },
  { bed: 1, bath: 1, sqft: 800, deep: false },
  { bed: 12, bath: 12, sqft: 20000, deep: true }, // max bounds
];

console.log('--- Live pricing cases ---');
for (const c of cases) {
  await page.fill('#bedrooms', String(c.bed));
  await page.fill('#bathrooms', String(c.bath));
  await page.fill('#sqft', String(c.sqft));
  const checked = await page.isChecked('#deepClean');
  if (checked !== c.deep) await page.click('.slider');
  await page.dispatchEvent('#sqft', 'input');
  await page.waitForTimeout(50);
  const shown = (await page.textContent('#priceDisplay')).trim();
  const exp = money(expectedTotal(c.bed, c.bath, c.sqft, c.deep));
  check(`${c.bed}bd/${c.bath}ba/${c.sqft}sqft/deep=${c.deep} => ${exp}`, shown === exp, `got ${shown}`);
}

console.log('--- Deep clean is more expensive than standard ---');
async function priceFor(deep) {
  await page.fill('#bedrooms', '3'); await page.fill('#bathrooms', '2'); await page.fill('#sqft', '1500');
  if (await page.isChecked('#deepClean') !== deep) await page.click('.slider');
  await page.dispatchEvent('#sqft', 'input'); await page.waitForTimeout(30);
  return parseInt((await page.textContent('#priceDisplay')).replace(/[^0-9]/g, ''), 10);
}
const std = await priceFor(false); const deep = await priceFor(true);
check('deep > standard', deep > std, `std=${std} deep=${deep}`);

console.log('--- Invalid input handling ---');
await page.fill('#sqft', '');
await page.dispatchEvent('#sqft', 'input'); await page.waitForTimeout(30);
check('empty sqft shows dash', (await page.textContent('#priceDisplay')).includes('—'));
check('empty sqft shows error', (await page.textContent('#sqftError')).length > 0);
check('get-quote disabled when invalid', await page.isDisabled('#getQuoteBtn'));

await page.fill('#sqft', '50');
await page.dispatchEvent('#sqft', 'input'); await page.waitForTimeout(30);
check('too-small sqft shows error', (await page.textContent('#sqftError')).length > 0);

await page.fill('#sqft', '99999');
await page.dispatchEvent('#sqft', 'input'); await page.waitForTimeout(30);
check('too-large sqft shows error', (await page.textContent('#sqftError')).length > 0);

console.log('--- Stepper buttons ---');
await page.fill('#sqft', '1500'); await page.dispatchEvent('#sqft', 'input');
await page.fill('#bedrooms', '3');
await page.click('[data-step="bedrooms"][data-dir="1"]');
check('stepper + increments', (await page.inputValue('#bedrooms')) === '4');
await page.click('[data-step="bedrooms"][data-dir="-1"]');
await page.click('[data-step="bedrooms"][data-dir="-1"]');
check('stepper - decrements', (await page.inputValue('#bedrooms')) === '2');

console.log('--- Share / summary flow ---');
await page.fill('#bedrooms', '4'); await page.fill('#bathrooms', '3'); await page.fill('#sqft', '2200');
if (!(await page.isChecked('#deepClean'))) await page.click('.slider');
await page.dispatchEvent('#sqft', 'input'); await page.waitForTimeout(30);
const livePrice = (await page.textContent('#priceDisplay')).trim();
await page.click('#getQuoteBtn');
await page.waitForTimeout(60);
check('summary view visible', await page.isVisible('#summary'));
check('app view hidden', !(await page.isVisible('#app')));
check('summary price matches live price', (await page.textContent('#summaryPrice')).trim() === livePrice,
  `summary=${(await page.textContent('#summaryPrice')).trim()} live=${livePrice}`);
check('summary shows bedrooms=4', (await page.textContent('#sBed')).trim() === '4');
check('summary shows deep=Yes', (await page.textContent('#sDeep')).trim() === 'Yes');
check('quote id present', /BSC-/.test(await page.textContent('#quoteId')));
check('url has view=quote', page.url().includes('view=quote'));

console.log('--- Copy link ---');
await page.click('#copyLinkBtn');
await page.waitForTimeout(60);
check('copy shows confirmation', (await page.textContent('#copiedMsg')).length > 0);

console.log('--- Back to edit ---');
await page.click('#backBtn');
await page.waitForTimeout(40);
check('back returns to app', await page.isVisible('#app'));
check('back hides summary', !(await page.isVisible('#summary')));

console.log('--- Reload from shareable URL ---');
const shareUrl = file + '?bed=5&bath=3&sqft=3000&deep=1&view=quote';
await page.goto(shareUrl);
await page.waitForTimeout(60);
check('shared url opens summary directly', await page.isVisible('#summary'));
check('shared url restores bedrooms=5', (await page.textContent('#sBed')).trim() === '5');
check('shared url restores deep=Yes', (await page.textContent('#sDeep')).trim() === 'Yes');
const sharedPrice = money(expectedTotal(5, 3, 3000, true));
check('shared url price correct', (await page.textContent('#summaryPrice')).trim() === sharedPrice,
  `got ${(await page.textContent('#summaryPrice')).trim()} exp ${sharedPrice}`);

console.log('--- Standalone charset (served as file, emoji title) ---');
const hasCharset = await page.$('meta[charset]');
check('charset meta present', !!hasCharset);

await page.screenshot({ path: 'scratchpad-summary.png' });
await page.goto(file);
await page.waitForTimeout(40);
await page.screenshot({ path: 'scratchpad-app.png' });

console.log('\n--- Console / page errors ---');
check('no console errors', consoleErrors.length === 0, consoleErrors.join(' | '));
check('no page errors', pageErrors.length === 0, pageErrors.join(' | '));

await browser.close();
console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
