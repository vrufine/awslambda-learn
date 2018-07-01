'use strict'

const uuid = require('uuid/v4')
const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1'
})
const flavorIsValid = require('./../utils/validators/flavorValidator')

const TableName = 'life_sabores'

const getFlavors = async (event, context) => {
  try {
    const params = {
      TableName
    }
    const flavors = await documentClient.scan(params).promise()
    return {
      isBase64Encoded: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 200,
      body: JSON.stringify(flavors.Items)
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

const createFlavor = async (event, context) => {
  const body = JSON.parse(event.body)
  try {
    const isValid = flavorIsValid(body)
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
        message: 'Flavor created!'
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

const getFlavorById = async (event, context) => {
  try {
    const id = event.pathParameters.id
    const params = {
      TableName,
      Key: {
        id
      }
    }
    const flavor = (await documentClient.get(params).promise()).Item
    if (flavor) {
      return {
        isBase64Encoded: false,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
        statusCode: 200,
        body: JSON.stringify(flavor)
      }
    } else {
      throw new Error('Flavor not found')
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

const deleteFlavor = async (event, context) => {
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
        message: 'Flavor deleted'
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
        isBase64Encoded: false,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
        error: error.message
      })
    }
  }
}

module.exports = {
  getFlavors,
  createFlavor,
  getFlavorById,
  deleteFlavor
}