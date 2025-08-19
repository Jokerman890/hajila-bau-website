// Einfacher Test, um die grundlegende Funktionalität zu überprüfen
test('sollte Hallo Welt ausgeben', () => {
  const hello = 'Hallo';
  const welt = 'Welt';
  expect(`${hello} ${welt}`).toBe('Hallo Welt');
});
