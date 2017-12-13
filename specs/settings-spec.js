describe('The Example App', () => {
  context('Settings', () => {
    beforeEach(() => {
      cy.visit('/settings')
    })

    it('renders setting with default values', () => {
      cy.title().should('equals', 'Settings — The Example App')
      cy.get('main h1').should('have.text', 'Settings')
      cy.get('.status-block')
        .should('have.length', 1)
        .invoke('text').then((text) => {
          expect(text).to.contain('Connected space:')
        })
      cy.get('input#input-space-id').should('have.value', Cypress.env('CONTENTFUL_SPACE_ID'))
      cy.get('input#input-delivery-token').should('have.value', Cypress.env('CONTENTFUL_DELIVERY_TOKEN'))
      cy.get('input#input-preview-token').should('have.value', Cypress.env('CONTENTFUL_PREVIEW_TOKEN'))
    })

    it('checks for required fields', () => {
      cy.get('input#input-space-id').clear()
      cy.get('input#input-delivery-token').clear()
      cy.get('input#input-preview-token').clear()
      cy.get('input[type=submit]').click()

      cy.get('.status-block--info').should('not.exist')
      cy.get('.status-block--success').should('not.exist')
      cy.get('.status-block--error').should('exist')

      cy.get('input#input-space-id').parent().children('.form-item__error-wrapper')
        .should('exist')
        .find('.form-item__error-message')
        .should('contain', 'This field is required')
      cy.get('input#input-delivery-token').parent().children('.form-item__error-wrapper')
        .should('exist')
        .find('.form-item__error-message')
        .should('contain', 'This field is required')
      cy.get('input#input-preview-token').parent().children('.form-item__error-wrapper')
        .should('exist')
        .find('.form-item__error-message')
        .should('contain', 'This field is required')
    })

    it('validates field with actual client', () => {
      cy.get('input#input-space-id').clear().type(Math.random().toString(36).substring(12))
      cy.get('input#input-delivery-token').clear().type(Math.random().toString(36))
      cy.get('input#input-preview-token').clear().type(Math.random().toString(36))
      cy.get('input[type=submit]').click()

      cy.get('.status-block--info').should('not.exist')
      cy.get('.status-block--success').should('not.exist')
      cy.get('.status-block--error').should('exist')

      cy.get('input#input-delivery-token').parent().children('.form-item__error-wrapper')
        .should('exist')
        .find('.form-item__error-message')
        .should('contain', 'Your Delivery API key is invalid.')
    })

    it('shows success message when valid credentials are supplied', () => {
      cy.get('input#input-space-id').clear().type(Cypress.env('CONTENTFUL_SPACE_ID'))
      cy.get('input#input-delivery-token').clear().type(Cypress.env('CONTENTFUL_DELIVERY_TOKEN'))
      cy.get('input#input-preview-token').clear().type(Cypress.env('CONTENTFUL_PREVIEW_TOKEN'))
      cy.get('input[type=submit]').click()

      cy.get('.status-block--info').should('exist')
      cy.get('.status-block--success').should('exist')
      cy.get('.status-block--error').should('not.exist')

      cy.get('.form-item__error-wrapper').should('not.exist')
    })

    it('enables editorial features and displays them on home', () => {
      cy.get('input#input-editorial-features').check()
      cy.get('input[type=submit]').click()

      cy.get('.status-block--info').should('exist')
      cy.get('.status-block--success').should('exist')
      cy.get('.status-block--error').should('not.exist')

      cy.get('input#input-editorial-features').should('checked')

      cy.visit('/')

      cy.get('.editorial-features').should('exist')
    })
  })
})
