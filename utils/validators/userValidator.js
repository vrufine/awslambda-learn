module.exports = user => {
  const requiredFields = [
    {
      field: 'nome',
      type: 'string',
      requiredError: 'The field \'nome\' is required!',
      typeError: 'The field \'nome\' should be a STRING!'
    },
    {
      field: 'login',
      type: 'string',
      requiredError: 'The field \'login\' is required!',
      typeError: 'The field \'login\' should be a STRING!'
    },
    {
      field: 'senha',
      type: 'string',
      requiredError: 'The field \'senha\' is required!',
      typeError: 'The field \'senha\' should be a STRING!'
    }
  ]

  for (const i in requiredFields) {
    const requiredField = requiredFields[i];
    if (!user[requiredField.field]) {
      return new Error(requiredField.requiredError)
    }
    if (typeof user[requiredField.field] !== requiredField.type) {
      return new Error(requiredField.typeError)
    }
  }
  return true
}