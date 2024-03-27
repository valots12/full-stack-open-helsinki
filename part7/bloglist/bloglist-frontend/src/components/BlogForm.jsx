import { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  const [form, setForm] = useState({
    author: '',
    title: '',
    url: '',
    likes: 0
  })

  const handleAuthor = (event) => {
    setForm({
      ...form,
      author: event.target.value
    })
  }

  const handleTitle = (event) => {
    setForm({
      ...form,
      title: event.target.value
    })
  }

  const handleUrl = (event) => {
    setForm({
      ...form,
      url: event.target.value
    })
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: form.title,
      author: form.author,
      url: form.url
    })
    setForm({
      title: '',
      author: '',
      url: ''
    })
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
            title:
          <input
            id='title'
            type='text'
            value={form.title}
            name='Title'
            onChange={handleTitle}
          />
        </div>
        <div>
            author:
          <input
            id='author'
            type='text'
            value={form.author}
            name='Author'
            onChange={handleAuthor}
          />
        </div>
        <div>
            url:
          <input
            id='url'
            type='text'
            value={form.url}
            name='Url'
            onChange={handleUrl}
          />
        </div>
        <button id="create-button" type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm


const createBlog = async (blogObject) => {
  const returnedBlog = await blogService.create(blogObject)
  console.log('returnedBlog.error', returnedBlog.error)
  console.log('returnedBlog', returnedBlog)

  if (returnedBlog.error) {
    dispatch(showNotification('error creating blog: ' + returnedBlog.error, 5))
  } else {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
    blogFormRef.current.toggleVisibility()
    dispatch(showNotification(`a new blog '${returnedBlog.title}' by ${returnedBlog.author} added`, 5))
  }
}