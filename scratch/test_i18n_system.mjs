import { DICTIONARIES, translate } from '../src/frontend/src/lib/i18n/translations/index.ts';
import { SUPPORTED_LANGUAGES } from '../src/frontend/src/lib/i18n/types.ts';
import { mapLocationToLanguage } from '../src/frontend/src/lib/i18n/store.ts';

console.log('--- EZY1 i18n System Isolated Verification Suite ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// 1. Verify all 13 supported languages exist
assert(SUPPORTED_LANGUAGES.length === 13, `Supported languages count is 13 (found ${SUPPORTED_LANGUAGES.length})`);

const expectedLangs = ['en', 'hi', 'kn', 'bn', 'mr', 'te', 'ta', 'gu', 'ur', 'pa', 'ml', 'or', 'as'];
for (const lang of expectedLangs) {
  assert(DICTIONARIES[lang] !== undefined, `Translation dictionary exists for language code: '${lang}'`);
}

// 2. Default language verification
const defaultMeta = SUPPORTED_LANGUAGES.find(l => l.code === 'en');
assert(defaultMeta && defaultMeta.name === 'English', 'English is defined with code "en"');

// 3. Fallback verification
// If a non-existent key is queried, it returns token or key
const nonExistentKey = translate('en', 'non.existent.key');
assert(nonExistentKey === 'key', `Fallback on non-existent key returns token: got '${nonExistentKey}'`);

// 4. Test Key Presence and Localization across all languages
const testKeys = [
  'nav.home',
  'nav.categories',
  'nav.cart',
  'nav.login',
  'home.heroTitle',
  'search.placeholder',
  'checkout.orderSummary',
  'auth.loginTitle',
  'partner.partnerPortal',
  'common.loading',
  'common.apply'
];

for (const lang of expectedLangs) {
  for (const k of testKeys) {
    const val = translate(lang, k);
    assert(typeof val === 'string' && val.length > 0, `Lang '${lang}' has valid string for key '${k}': "${val}"`);
  }
}

// 5. Test variable interpolation
const interpolatedEn = translate('en', 'search.resultsFound', { count: '42' });
assert(interpolatedEn.includes('42'), `Variable interpolation works in English: "${interpolatedEn}"`);

const interpolatedHi = translate('hi', 'auth.otpSentTo', { phone: '9876543210' });
assert(interpolatedHi.includes('9876543210'), `Variable interpolation works in Hindi: "${interpolatedHi}"`);

// 6. Test location-based language recommendations
const locTests = [
  { state: 'Karnataka', city: 'Bengaluru', expected: 'kn' },
  { state: 'Maharashtra', city: 'Mumbai', expected: 'mr' },
  { state: 'West Bengal', city: 'Kolkata', expected: 'bn' },
  { state: 'Tamil Nadu', city: 'Chennai', expected: 'ta' },
  { state: 'Telangana', city: 'Hyderabad', expected: 'te' },
  { state: 'Gujarat', city: 'Ahmedabad', expected: 'gu' },
  { state: 'Punjab', city: 'Amritsar', expected: 'pa' },
  { state: 'Kerala', city: 'Kochi', expected: 'ml' },
  { state: 'Odisha', city: 'Bhubaneswar', expected: 'or' },
  { state: 'Assam', city: 'Guwahati', expected: 'as' },
  { state: 'Delhi', city: 'New Delhi', expected: 'hi' },
  { state: 'Unknown State', city: 'Unknown City', expected: null }
];

for (const lt of locTests) {
  const rec = mapLocationToLanguage(lt.state, lt.city);
  assert(rec === lt.expected, `Location mapping for ${lt.city}, ${lt.state} -> expected '${lt.expected}', got '${rec}'`);
}

// 7. Test RTL configuration for Urdu
const urduMeta = SUPPORTED_LANGUAGES.find(l => l.code === 'ur');
assert(urduMeta && urduMeta.isRtl === true, 'Urdu is marked with isRtl: true');
const hindiMeta = SUPPORTED_LANGUAGES.find(l => l.code === 'hi');
assert(hindiMeta && !hindiMeta.isRtl, 'Hindi is marked with isRtl: false');
const englishMeta = SUPPORTED_LANGUAGES.find(l => l.code === 'en');
assert(englishMeta && !englishMeta.isRtl, 'English is marked with isRtl: false');

console.log(`\n========================================`);
console.log(`Verification Complete: ${passedTests}/${totalTests} tests passed.`);
console.log(`========================================`);
