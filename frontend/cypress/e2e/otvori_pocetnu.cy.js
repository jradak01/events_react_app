describe('Eventi aplikacija', () => {
  it('naslovna stranica se otvara', () => {
  cy.visit('http://localhost:3000')
  cy.contains('Istraži')
  })
 })
 