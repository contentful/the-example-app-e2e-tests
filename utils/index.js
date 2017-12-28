function formItemByLabel (label) {
  return cy
    .get('label')
    .contains(label)
    .parents('.form-item')
    .find('input')
}

module.exports = {
  formItemByLabel
}
