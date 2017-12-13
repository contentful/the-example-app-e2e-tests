describe.only('The Example App', () => {
  context('Home', () => {
    it('renders home page', () => {
      cy.visit('/')
      cy.get('main .module-highlighted-course').should('have.length.gte', 1, 'should have at least one highlighted course')
    })
  })
})
