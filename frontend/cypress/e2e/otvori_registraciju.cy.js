describe('Eventi aplikacija', () => {
  it('Registracija', () => {
  cy.visit('http://localhost:3000/login')
  cy.contains('Registracija')
  cy.get('[name="Registracija"]').click()
  cy.get('[name="Username"]').type('cyTestniRegister')
  cy.get('[name="Pass"]').type('12345678')
  cy.get('[name="Email"]').type('cytestni1@gmail.com')
  cy.get('[name="Ime"]').type('TestniCyRegister')
  cy.get('[name="Registracija_"]').click()
  cy.visit('http://localhost:3000/login')
  cy.get('[name=Username_]').type('cyTestniRegister')
  cy.get('[name=Pass_]').type('12345678')
  cy.get('[name=Prijava]').click()
  cy.get('[name="profil-ulaz"]').click()
  cy.get('.btn-clear').click()
  })
 })
 