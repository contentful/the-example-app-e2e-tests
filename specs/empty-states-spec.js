const { switchToEmptyStatesSpace } = require('../utils')

function switchToGerman () {
  cy.get('header :nth-child(2) > form > .header__controls_label')
    .click()
    .parents('form')
    .find('button[value=de-DE]')
    .click()
}

describe('The Example App - Empty states', () => {
  beforeEach(switchToEmptyStatesSpace)

  context('Home', () => {
    it('Renders empty state warning', () => {
      cy.visit('/?api=cpa')

      cy.contains('No content found.')
      switchToGerman()
      cy.contains('Keinen Inhalt gefunden.')
    })
  })

  context('Courses', () => {
    it('Renders empty state warning', () => {
      cy.visit('/courses/?api=cda')

      cy.contains('No content found.')
      switchToGerman()
      cy.contains('Keinen Inhalt gefunden.')
    })
  })

  context('Lesson', () => {
    it('Renders empty state warning', () => {
      cy.visit('/courses/hello-sdks/lessons/sdk-basics?api=cpa')

      cy.contains('No content found.')
      switchToGerman()
      cy.contains('Keinen Inhalt gefunden.')
    })
  })
})
