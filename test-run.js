// Einfache Testausführung ohne Jest
console.log('Starte einfachen Test...');

function testBasic() {
  console.log('Test: 1 + 1 =', 1 + 1);
  
  // Asynchroner Test
  Promise.resolve(42)
    .then(result => {
      console.log('Asynchroner Test erfolgreich:', result);
    })
    .catch(error => {
      console.error('Fehler im asynchronen Test:', error);
    });
}

testBasic();
console.log('Test abgeschlossen.');
