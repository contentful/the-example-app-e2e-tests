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
  cy.visit(`/courses?${getParams.join('&')}`)
}

module.exports = {
  formItemByLabel,
  switchToQASpace
}
