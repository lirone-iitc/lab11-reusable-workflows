const { formatRelease } = require('../src/release');

test('formats release string with uppercased environment', () => {
  expect(formatRelease('1.3.0', 'staging')).toBe('[STAGING] Deploying v1.3.0');
});

test('throws when version is missing', () => {
  expect(() => formatRelease('', 'staging')).toThrow('version is required');
});

test('throws when environment is missing', () => {
  expect(() => formatRelease('1.3.0', '')).toThrow('environment is required');
});
