const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})

blogRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

blogRouter.put('/:id', (request, response) => {

  const { body } = request;

  const result = Blog.updateOne(
    { _id: request.params.id },
    { $set: { likes: body.likes } }
  );

  if (result.n === 0) {
    return response.status(404).json({ error: 'Note not found' });
  }

  response.status(200).json({ message: 'Likes updated successfully' });
})

module.exports = blogRouter