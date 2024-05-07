describe('Eventi aplikacija', () => {
    it('stranica s eventima', () => {
    cy.visit('http://localhost:3000/dogadaji')
    cy.get('.search-element').type('sajam jahti')
    cy.get('.Detalji').click()
    })
})