'use strict'

const uuid = require('uuid/v4')
const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1'
})
const packagingIsValid = require('./../utils/validators/packagingValidator')

const TableName = 'life_embalagens'

const getPackagings = async (event, context) => {
  try {
    const params = {
      TableName
    }
    const packagings = await documentClient.scan(params).promise()
    return {
      isBase64Encoded: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 200,
      body: JSON.stringify(packagings.Items)
    }
  } catch (error) {
    return {
      isBase64Encoded: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: error.statusCode || 400,
      body: JSON.stringify({
        error: error.message
      })
    }
  }
}

const getPackagingById = async (event, context) => {
  try {
    const id = event.pathParameters.id
    const params = {
      TableName,
      Key: {
        id
      }
    }
    const packaging = (await documentClient.get(params).promise()).Item
    if (packaging) {
      return {
        isBase64Encoded: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        statusCode: 200,
        body: JSON.stringify(packaging)
      }
    } else {
      throw new Error('Packaging not found')
    }
  } catch (error) {
    return {
      isBase64Encoded: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: error.statusCode || 400,
      body: JSON.stringify({
        error: error.message
      })
    }
  }
}

const createPackaging = async (event, context) => {
  try {
    const body = JSON.parse(event.body)
    const isValid = packagingIsValid(body)
    if (typeof isValid === 'object') {
      throw new Error(isValid.message)
    }
    const params = {
      TableName,
      Item: {
        ...body,
        id: uuid(),
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      }
    }
    await documentClient.put(params).promise()
    return {
      isBase64Encoded: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 200,
      body: JSON.stringify({
        message: 'Packaging created!'
      })
    }
  } catch (error) {
    return {
      isBase64Encoded: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: error.statusCode || 400,
      body: JSON.stringify({
        error: error.message
      })
    }
  }
}

const deletePackaging = async (event, context) => {
  try {
    const id = event.pathParameters.id
    const params = {
      TableName,
      Key: {
        id
      }
    }
    await documentClient.delete(params).promise()
    return {
      isBase64Encoded: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 200,
      body: JSON.stringify({
        message: 'Packaging deleted!'
      })
    }
  } catch (error) {
    return {
      isBase64Encoded: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: error.statusCode || 400,
      body: JSON.stringify({
        error: error.message
      })
    }
  }
}

module.exports = {
  getPackagings,
  getPackagingById,
  createPackaging,
  deletePackaging
}