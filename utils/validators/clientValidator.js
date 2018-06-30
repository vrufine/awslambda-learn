module.exports = client => {
  const requiredFields = [
    {
      field: 'nome',
      type: 'string',
      requiredError: 'The field \'nome\' is required!',
      typeError: 'The field \'nome\' should be a STRING!'
    },
    {
      field: 'tipo_pessoa',
      type: 'string',
      requiredError: 'The field \'tipo_pessoa\' is required!',
      typeError: 'The field \'tipo_pessoa\' should be a STRING!'
    },
    {
      field: 'razao',
      type: 'string',
      requiredError: 'The field \'razao\' is required!',
      typeError: 'The field \'razao\' should be a STRING!'
    },
    {
      field: 'cpf_cnpj',
      type: 'string',
      requiredError: 'The field \'cpf_cnpj\' is required!',
      typeError: 'The field \'cpf_cnpj\' should be a STRING!'
    },
    {
      field: 'rg_ie',
      type: 'string',
      requiredError: 'The field \'rg_ie\' is required!',
      typeError: 'The field \'rg_ie\' should be a STRING!'
    },
    {
      field: 'situacao',
      type: 'number',
      requiredError: 'The field \'situacao\' is required!',
      typeError: 'The field \'situacao\' should be a NUMBER!'
    },
    {
      field: 'razao',
      type: 'string',
      requiredError: 'The field \'razao\' is required!',
      typeError: 'The field \'razao\' should be a STRING!'
    },
    {
      field: 'observacoes',
      type: 'string',
      requiredError: 'The field \'observacoes\' is required!',
      typeError: 'The field \'observacoes\' should be a STRING!'
    }
  ]

  for (const i in requiredFields) {
    const requiredField = requiredFields[i];
    if (!client[requiredField.field]) {
      return new Error(requiredField.requiredError)
    }
    if (typeof client[requiredField.field] !== requiredField.type) {
      return new Error(requiredField.typeError)
    }
  }
  return true
}