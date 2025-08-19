// Einfacher Test zur Überprüfung der Testumgebung
describe('Basic Test', () => {
  it('sollte 1 + 1 gleich 2 sein', () => {
    expect(1 + 1).toBe(2);
  });

  it('sollte asynchronen Code testen', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});
