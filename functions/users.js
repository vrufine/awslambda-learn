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
      statusCode: 200,
      body: users.Items
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
      statusCode: 200,
      body: {
        message: 'User created!'
      }
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
        statusCode: 200,
        body: user
      }
    } else {
      throw new Error('User not found')
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
      statusCode: 200,
      body: {
        message: 'User deleted!'
      }
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