'use strict'

const uuid = require('uuid/v4')
const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1'
})
const userIsValid = require('./../utils/validators/userValidator')

const TableName = 'life_usuarios'

module.exports.getUsers = async (event, context) => {
  try {
    const params = {
      TableName
    }
    const users = await documentClient.scan(params).promise()
    return {
      isBase64Encoded: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 200,
      body: JSON.stringify(users.Items)
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

module.exports.createUser = async (event, context) => {
  try {
    const body = JSON.parse(event.body)
    const isValid = userIsValid(body)
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
        message: 'User created!'
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

module.exports.getUserById = async (event, context) => {
  const id = event.pathParameters.id
  try {
    const params = {
      TableName,
      Key: {
        id
      }
    }
    const user = (await documentClient.get(params).promise()).Item
    if (user) {
      return {
        isBase64Encoded: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        statusCode: 200,
        body: JSON.stringify(user)
      }
    } else {
      throw new Error('User not found')
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

module.exports.deleteUser = async (event, context) => {
  const id = event.pathParameters.id
  try {
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
        message: 'User deleted!'
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