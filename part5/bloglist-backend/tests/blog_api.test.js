const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('../utils/test_helper')
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZhbG90cyIsImlkIjoiNjVhYTFiODQxYjViMmYzODNiZmVjNjQ0IiwiaWF0IjoxNzA1OTU1NjQ1fQ.g0d9HQ28VTxRwAqOIKLYxmIsRLAxHIqAD9yUFP5oTbQ"

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.listWithMoreBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

const api = supertest(app)

describe('check on blogs api', () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    console.log('test',response.body)

    expect(response.body).toHaveLength(helper.listWithMoreBlogs.length)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('the unique identifier is renamed as id', async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)

		expect(response.body[0].id).toBeDefined()
		expect(response.body[0]._id).not.toBeDefined()
  })

  test('the POST request works correctly', async () => {

    const newBlog = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2
    }  

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const response = await api
      .get("/api/blogs")
      .expect(200)

    expect(response.body).toHaveLength(helper.listWithMoreBlogs.length + 1)
  })

  test('the POST request does not work with bad token', async () => {

    const newBlog = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2
    }  

    const token_bad = "BAD TOKEN"

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token_bad}`)
      .send(newBlog)
      .expect(401)

    const response = await api
      .get("/api/blogs")
      .expect(200)

    expect(response.body).toHaveLength(helper.listWithMoreBlogs.length)
  })

  test('the likes property has a default value equal to 0', async () => {

    newBlog = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html"
    }  

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const response = await api
      .get("/api/blogs")
      .expect(200)

    const filteredBlogs = response.body.filter(blog => blog.url == newBlog.url)
    expect(filteredBlogs[0].likes).toBe(0)
  })

  test('the POST request return 400 if title or url are missing', async () => {

    newBlogWithoutUrl = {
      title: "Type wars",
      author: "Robert C. Martin"
    }  

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlogWithoutUrl)
      .expect(400)

    newBlogWithoutTitle = {
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html"
    }  

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlogWithoutTitle)
      .expect(400)
  })

  test('the DELETE request works correctly', async () => {

    const blogsAtStart = await Blog.find({}).populate('user')
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204)
  })

  test('the UPDATE request works correctly', async () => {

    const blogsAtStart = await Blog.find({}).populate('user')
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      likes: 50
    }

    await api
      .put(`/api/blogs/${blogToUpdate._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedBlog)
      .expect(200)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})