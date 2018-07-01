'use strict'

const uuid = require('uuid/v4')
const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1'
})
const clientValidator = require('./../utils/validators/clientValidator')

const TableName = 'life_clientes'

const getClients = async (event, context) => {
  try {
    const params = {
      TableName
    }
    const clients = await documentClient.scan(params).promise()
    return {
      isBase64Encoded: false,
      headers: {},
      statusCode: 200,
      body: clients.Items
    }
  } catch (error) {
    return {
      isBase64Encoded: false,
      headers: {},
      statusCode: error.statusCode,
      body: {
        error: error.message
      }
    }
  }
}

const getClientById = async (event, context) => {
  const id = event.pathParameters.id
  try {
    const params = {
      TableName,
      Key: {
        id
      }
    }
    const client = (await documentClient.get(params).promise()).Item
    if (client) {
      return {
        isBase64Encoded: false,
        headers: {},
        statusCode: 200,
        body: client
      }
    } else {
      throw new Error('Client not found')
    }
  } catch (error) {
    return {
      isBase64Encoded: false,
      headers: {},
      statusCode: error.statusCode,
      body: {
        error: error.message
      }
    }
  }
}

const createClient = async (event, context) => {
  try {
    const body = JSON.parse(event.body)
    const isValid = clientValidator(body)
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
      headers: {},
      statusCode: 200,
      body: {
        message: 'Client created!'
      }
    }
  } catch (error) {
    return {
      isBase64Encoded: false,
      headers: {},
      statusCode: error.statusCode,
      body: {
        error: error.message
      }
    }
  }
}

const deleteClient = async (event, context) => {
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
      headers: {},
      statusCode: 200,
      body: {
        message: 'Client deleted'
      }
    }
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: {
        isBase64Encoded: false,
        headers: {},
        error: error.message
      }
    }
  }
}

module.exports = {
  getClients,
  getClientById,
  createClient,
  deleteClient
}