describe('Eventi aplikacija', () => {
    it('promjena uloge korisnika u njegovim detaljima', () => {
    cy.visit('http://localhost:3000/login')
    cy.contains('Prijava')
    cy.get('[name=Username_]').type('radak01')
    cy.get('[name=Pass_]').type('tajna')
    cy.get('[name=Prijava]').click()
    cy.get('[name=korisnici]').click()
    cy.get('.search-element').type('test')
    cy.get('.btn-clear').click()
    cy.get('.promijeniUlogu').click()
    })
})