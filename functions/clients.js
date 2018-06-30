'use strict'

const uuid = require('uuid/v4')
const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1'
})

const TableName = 'life_clientes'

const getClients = async (event, context) => {
  try {
    const params = {
      TableName
    }
    const clients = await documentClient.scan(params).promise()
    return {
      statusCode: 200,
      body: clients.Items
    }
  } catch (error) {
    return {
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
        statusCode: 200,
        body: client
      }
    } else {
      throw new Error('Client not found')
    }
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: {
        error: error.message
      }
    }
  }
}

module.exports = {
  getClients,
  getClientById
}