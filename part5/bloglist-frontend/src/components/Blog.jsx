import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const increaseLike = () => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      id: blog.id
    }

    updateBlog(updatedBlog)
  }

  const deleteIt = () => {
    const deletedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      id: blog.id
    }

    deleteBlog(deletedBlog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return(
    <div style={blogStyle} className='blog'>
      <div style={hideWhenVisible}>
        {blog.title} - {blog.author} <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} - {blog.author} <button onClick={toggleVisibility}>hide</button>
        <br />
        {blog.url}
        <br />
        {blog.likes} <button onClick={increaseLike}>like</button>
        <br />
        {blog.user.username}
        <br />
        <button onClick={deleteIt}>delete</button>
      </div>
    </div>
  )}

export default Blog