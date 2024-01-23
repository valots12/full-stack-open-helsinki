const logger = require('./logger')
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const indexAuthorization = request.rawHeaders.indexOf("Authorization")
  const token = request.rawHeaders[indexAuthorization+1].replace('Bearer', '').trim();
  request.token = token

  next()
}

const userExtractor = async (request, response, next) => {
	if (request.method === "GET") {
		return next()
	}

	const token = request.token
	const decodedToken = jwt.verify(token, process.env.SECRET)

	if (!token || !decodedToken.id) {
		return response.status(401).json({ error: "token missing or invalid" })
	}

	const user = await User.findById(decodedToken.id)

	if (!user) {
		return response.status(401).send({ error: "invalid token" })
	}

	request.user = user

	next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}