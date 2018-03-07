function formItemByLabel (label) {
  return cy
    .get('label')
    .contains(label)
    .parents('.form-item')
    .find('input')
}

function switchToQASpace () {
  const getParams = [
    `space_id=${Cypress.env('CONTENTFUL_QA_SPACE_ID')}`,
    `delivery_token=${Cypress.env('CONTENTFUL_QA_DELIVERY_TOKEN')}`,
    `preview_token=${Cypress.env('CONTENTFUL_QA_PREVIEW_TOKEN')}`
  ]
  cy.visit(`/?${getParams.join('&')}`)
}

function switchToEmptyStatesSpace () {
  const getParams = [
    `space_id=${Cypress.env('CONTENTFUL_QA_EMPTY_STATES_SPACE_ID')}`,
    `delivery_token=${Cypress.env('CONTENTFUL_QA_EMPTY_STATES_DELIVERY_TOKEN')}`,
    `preview_token=${Cypress.env('CONTENTFUL_QA_EMPTY_STATES_PREVIEW_TOKEN')}`
  ]
  cy.visit(`/?${getParams.join('&')}`)
}

module.exports = {
  formItemByLabel,
  switchToEmptyStatesSpace,
  switchToQASpace
}
