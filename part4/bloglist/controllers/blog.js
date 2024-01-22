// const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user')

  response.json(blogs)
})

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogRouter.post('/', async (request, response) => {
	const body = request.body

	// if (!body.title || !body.url) {
	// 	return response.status(400).json({ error: "Title or URL Missing" })
	// }

  // const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }

  // const user = await User.findById(decodedToken.id
  
  const user = await User.findById(body.user)

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: user._id,
	})

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
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