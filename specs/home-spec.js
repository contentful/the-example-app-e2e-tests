describe('The Example App - Home', () => {
  context('Home - non QA', () => {
    it('Renders home page', () => {
      cy.visit('/')
      cy.get('main .module-highlighted-course').should('have.length.gte', 1, 'should have at least one highlighted course')
    })
  })

  context('Home - QA', () => {
    before(() => {
      // Go back to home
      const getParams = [
        `space_id=${Cypress.env('CONTENTFUL_QA_SPACE_ID')}`,
        `delivery_token=${Cypress.env('CONTENTFUL_QA_DELIVERY_TOKEN')}`,
        `preview_token=${Cypress.env('CONTENTFUL_QA_PREVIEW_TOKEN')}`
      ]
      cy.visit(`/?${getParams.join('&')}`)
    })

    it('Renders all modules and variants', () => {
      // Verify we can see only a single highlighted course
      cy.get('main .module')
        .should('have.length', 1, 'should have only one module')
      cy.get('main .module-highlighted-course')
        .should('have.length', 1, 'should have only one highlighted course module')

      // Switch to preview
      cy.visit('/?api=cpa')

      // Should show all modules, one for each variant
      cy.get('main .module')
        .should('have.length', 4, 'should have 4 modules')

      // @todo check correct order of modules

      // Highlighted course modules
      cy.get('main .module-highlighted-course')
        .should('have.length', 1, 'should have one highlighted course module')

      cy.get('.module-highlighted-course .module-highlighted-course__categories')
        .find('a', 'Category is linked')
        .should('contain', 'Getting started', 'Category has correct title')
        .and('have.attr', 'href')
        .and('match', /^\/courses\/categories\/getting-started/, 'Category links to correct page')

      cy.get('.module-highlighted-course .module-highlighted-course__title')
        .find('a', 'Title is linked')
        .should('contain', 'Hello world', 'Title has correct text')
        .and('have.attr', 'href')
        .and('match', /^\/courses\/hello-world/, 'Title links to correct page')

      cy.get('.module-highlighted-course .module-highlighted-course__description-wrapper p')
        .should('have.text', 'Learn how to build your own applications with Contentful.', 'Course description is displayed')

      cy.get('.module-highlighted-course .module-highlighted-course__link')
        .should('contain', 'view course', 'Course link has correct text')
        .and('have.attr', 'href')
        .and('match', /^\/courses\/hello-world/, 'Course link links to correct page')

      // Hero image
      cy.get('main .module-hero-image__image')
        .should('have.length', 1, 'should have one hero image module')

      cy.get('main .module-hero-image__image')
        .should('have.attr', 'src')
        .and('match', /^\/\/images\.contentful\.com\//, 'link to the correct image using the image-api')

      cy.get('main .module-hero-image__headline')
        .should('contain', '[Draft] Hero Image Copy', 'displays headline')

      // Copy
      function testCopyModule (base, mod) {
        cy.get(`.${base}${mod}`)
          .should('have.length', 1, 'should have one basic copy module variant')

        cy.get(`.${base}${mod} .${base}__first${mod}`)
          .should('have.length', 1, 'should have one first section')
          .find(`.${base}__headline${mod},.${base}__copy${mod}`)
          .should('have.length', 2, 'should contain headline and copy once')

        cy.get(`.${base}${mod} .${base}__headline${mod}`)
          .should(($element) => {
            const textLength = $element.text().trim().length
            expect(textLength).to.be.gt(0, 'contains some text')
          })

        cy.get(`.${base}${mod} .${base}__copy${mod}`)
          .should(($element) => {
            const textLength = $element.text().trim().length
            expect(textLength).to.be.gt(0, 'contains some text')
          })

        cy.get(`.${base}${mod} .${base}__second${mod}`)
          .should('have.length', 1, 'should have one second section')

        cy.get(`.${base}${mod} .${base}__second${mod} .${base}__cta${mod}`)
          .should('have.length', 1, 'contain only one cta button')
          .and('have.attr', 'href')
          .and('matches', /^https?:\/\//, 'CTA button links to correct page')

        cy.get(`.${base}${mod} .${base}__second${mod} .${base}__cta${mod}`)
          .should(($element) => {
            const textLength = $element.text().trim().length
            expect(textLength).to.be.gt(0, 'contains some text')
          })
      }

      testCopyModule('module-copy', '')
      testCopyModule('module-copy', '--emphasized')
    })
  })
})
