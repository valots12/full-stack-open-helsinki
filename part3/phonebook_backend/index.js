const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

// const exp = require('constants')
const morgan = require('morgan')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

app.use(morgan(function (tokens, req, res) {

  if (tokens.method(req, res) === 'POST') {
    const body = req.body

    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify({ name: body['name'], number: body['number'] })
    ].join(' ')
  }

  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}))

// let persons = []

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/info', async (request, response) => {
  const currentDate = new Date()
  const count = await Person.countDocuments({ })

  response.send(`<p>Phonebook has info for ${count} people</p>
                   <p>${currentDate}</p>`)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })

    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  Person.findOne({ name: person.name }).then(user => {
    if(user){
      console.log('user', user)
      return response.status(400).json({
        error: 'contact already present'
      })
    }
  }).catch(error => next(error))

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => {
      console.log(error.message)
      next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})