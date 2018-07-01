module.exports = flavor => {
  const requiredFields = [
    {
      field: 'nome',
      type: 'string',
      requiredError: 'The field \'nome\' is required!',
      typeError: 'The field \'nome\' should be a STRING!'
    }
  ]

  for (const i in requiredFields) {
    const requiredField = requiredFields[i];
    if (!flavor[requiredField.field]) {
      return new Error(requiredField.requiredError)
    }
    if (typeof flavor[requiredField.field] !== requiredField.type) {
      return new Error(requiredField.typeError)
    }
  }
  return true
}