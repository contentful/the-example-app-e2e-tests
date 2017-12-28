const { formItemByLabel } = require('../utils')

describe('The Example App - Settings', () => {
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

      formItemByLabel('Space ID').should('have.value', Cypress.env('CONTENTFUL_SPACE_ID'))
      formItemByLabel('Content Delivery API access token').should('have.value', Cypress.env('CONTENTFUL_DELIVERY_TOKEN'))
      formItemByLabel('Content Preview API access token').should('have.value', Cypress.env('CONTENTFUL_PREVIEW_TOKEN'))
    })

    it('checks for required fields', () => {
      formItemByLabel('Space ID').clear()
      formItemByLabel('Content Delivery API access token').clear()
      formItemByLabel('Content Preview API access token').clear()

      cy.get('input[type=submit]').click()

      cy.get('.status-block--info').should('exist')
      cy.get('.status-block--success').should('not.exist')
      cy.get('.status-block--error').should('not.exist')

      formItemByLabel('Space ID').should('have.attr', 'required')
      formItemByLabel('Content Delivery API access token').should('have.attr', 'required')
      formItemByLabel('Content Preview API access token').should('have.attr', 'required')
    })

    it('validates field with actual client', () => {
      formItemByLabel('Space ID').clear().type(Math.random().toString(36).substring(12))
      formItemByLabel('Content Delivery API access token').clear().type(Math.random().toString(36))
      formItemByLabel('Content Preview API access token').clear().type(Math.random().toString(36))
      cy.get('input[type=submit]').click()

      cy.get('.status-block--info').should('not.exist')
      cy.get('.status-block--success').should('not.exist')
      cy.get('.status-block--error').should('exist')

      formItemByLabel('Content Delivery API access token').parent().children('.form-item__error-wrapper')
        .should('exist')
        .find('.form-item__error-message')
        .should('contain', 'Your Delivery API key is invalid.')
    })

    it('shows success message when valid credentials are supplied', () => {
      cy.get('.status-block')
        .should('have.length', 1)
        .invoke('text').then((text) => {
          expect(text).to.contain('The example app is currently using server side stored credentials to connect to a Contentful space.')
        })
      formItemByLabel('Space ID').clear().type(Cypress.env('CONTENTFUL_SPACE_ID'))
      formItemByLabel('Content Delivery API access token').clear().type(Cypress.env('CONTENTFUL_DELIVERY_TOKEN'))
      formItemByLabel('Content Preview API access token').clear().type(Cypress.env('CONTENTFUL_PREVIEW_TOKEN'))
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
