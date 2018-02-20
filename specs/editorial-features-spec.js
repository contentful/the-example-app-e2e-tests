const { switchToQASpace } = require('../utils')

function getCourseCardEditorialFeatures (title) {
  return cy.get('.course-card__title a')
    .contains(title)
    .parents('.course-card__title')
    .find('.editorial-features__item')
}

describe('The Example App - Editorial Features', () => {
  context('QA', () => {
    beforeEach(switchToQASpace)

    it('Editorial features show up on home', () => {
      cy.visit('/?api=cda&editorial_features=enabled')
      cy.get('.editorial-features').should('exist')
      cy.get('.pill').should('not.exist')

      cy.visit('/?api=cpa&editorial_features=enabled')
      cy.get('.editorial-features').should('exist')
      cy.get('.editorial-features .pill.pill--draft').should('exist')
      cy.get('.editorial-features .pill.pill--pending-changes').should('exist')
    })

    it('Editorial features show up on courses', () => {
      cy.visit('/courses?api=cda&editorial_features=enabled')
      cy.get('.editorial-features').should('exist')
      cy.get('.pill').should('not.exist')

      cy.visit('/courses?api=cpa&editorial_features=enabled')
      getCourseCardEditorialFeatures('My pending changes course').should('exist')
      getCourseCardEditorialFeatures('My pending changes course').find('.pill.pill--draft').should('not.exist')
      getCourseCardEditorialFeatures('My pending changes course').find('.pill.pill--pending-changes').should('exist')

      getCourseCardEditorialFeatures('My draft course').should('exist')
      getCourseCardEditorialFeatures('My draft course').find('.pill.pill--draft').should('exist')
      getCourseCardEditorialFeatures('My draft course').find('.pill.pill--pending-changes').should('not.exist')
    })

    it('Editorial features show up on filtered courses', () => {
      cy.visit('/courses/categories/getting-started?api=cda&editorial_features=enabled')
      cy.get('.editorial-features').should('exist')
      cy.get('.pill').should('not.exist')

      cy.visit('/courses/categories/getting-started?api=cpa&editorial_features=enabled')
      getCourseCardEditorialFeatures('My pending changes course').should('exist')
      getCourseCardEditorialFeatures('My pending changes course').find('.pill.pill--draft').should('not.exist')
      getCourseCardEditorialFeatures('My pending changes course').find('.pill.pill--pending-changes').should('exist')
    })

    it('Editorial features show up on draft course', () => {
      cy.visit('/courses/a_course_of_drafts?api=cpa&editorial_features=enabled')
      cy.get('.editorial-features').should('exist')
      cy.get('.editorial-features .pill.pill--draft').should('exist')
      cy.get('.editorial-features .pill.pill--pending-changes').should('not.exist')
    })

    it('Editorial features show up on pending changes course', () => {
      cy.visit('/courses/pending_changes?api=cda&editorial_features=enabled')
      cy.get('.editorial-features').should('exist')
      cy.get('.pill').should('not.exist')

      cy.visit('/courses/pending_changes?api=cpa&editorial_features=enabled')
      cy.get('.editorial-features').should('exist')
      cy.get('.editorial-features .pill.pill--draft').should('not.exist')
      cy.get('.editorial-features .pill.pill--pending-changes').should('exist')
    })

    it('Editorial features show up on pending changes and draft lesson', () => {
      cy.visit('/courses/course-with-draft-and-pending-lending/lessons/lesson_pending_and_drafted?api=cpa&editorial_features=enabled')
      cy.get('.editorial-features').should('exist')
      cy.get('.editorial-features .pill.pill--draft').should('exist')
      cy.get('.editorial-features .pill.pill--pending-changes').should('exist')
    })
  })
})
