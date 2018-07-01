module.exports = flavor => {
  const requiredFields = [
    {
      field: 'descricao',
      type: 'string',
      requiredError: 'The field \'descricao\' is required!',
      typeError: 'The field \'descricao\' should be a STRING!'
    },
    {
      field: 'conteudo',
      type: 'string',
      requiredError: 'The field \'conteudo\' is required!',
      typeError: 'The field \'conteudo\' should be a STRING!'
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