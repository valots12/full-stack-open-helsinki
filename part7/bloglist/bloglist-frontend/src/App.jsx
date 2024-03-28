import { useState, useEffect, useRef } from 'react'
import './app.css'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import { showNotification } from './reducers/notificationReducer'
import { useDispatch } from 'react-redux'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const createBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject)

    if (returnedBlog.error) {
      dispatch(showNotification('error creating blog: ' + returnedBlog.error, 5))
    } else {
      blogService.getAll().then((blogs) => setBlogs(blogs))
      console.log('blogs', blogs)
      blogFormRef.current.toggleVisibility()
      dispatch(
        showNotification(`a new blog '${returnedBlog.title}' by ${returnedBlog.author} added`, 5)
      )
    }
  }

  const updateBlog = async (updatedBlog) => {
    const returnedBlog = await blogService.update(updatedBlog)

    if (returnedBlog.error) {
      dispatch(showNotification('error updating blog: ' + returnedBlog.error, 5))
    } else {
      blogService.getAll().then((blogs) => setBlogs(blogs))
    }
  }

  const deleteBlog = async (deletedBlog) => {
    if (window.confirm(`Remove blog '${deletedBlog.title}' by ${deletedBlog.author} ?`)) {
      const returnedBlog = await blogService.deleteIt(deletedBlog, deletedBlog.id)

      if (returnedBlog.error) {
        dispatch(showNotification('error deleting blog: ' + returnedBlog.error, 5))
      } else {
        blogService.getAll().then((blogs) => setBlogs(blogs))
        dispatch(
          showNotification(`blog titled '${deletedBlog.title}' by ${deletedBlog.author} deleted`, 5)
        )
      }
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(showNotification('logging in with ' + username, 5))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(showNotification('error: wrong credentials', 5))
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser('')
    setUsername('')
    setPassword('')
    dispatch(showNotification('logging out', 5))
  }

  const logoutForm = () => (
    <form onSubmit={handleLogout}>
      <button type="submit">logout</button>
    </form>
  )

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const loginForm = () => (
    <LoginForm
      handleLogin={handleLogin}
      handleUsernameChange={handleUsernameChange}
      handlePasswordChange={handlePasswordChange}
      username={username}
      password={password}
    />
  )

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={createBlog} />
    </Togglable>
  )

  const blogFormRef = useRef()

  return (
    <div>
      <h1>Blogs</h1>

      <Notification />
      <br />
      <br />

      {!user && loginForm()}

      {user && (
        <div>
          <p>{user.username} logged in</p>
          {logoutForm()}
          <br />
          {blogForm()}
          <br />
        </div>
      )}
      <br />

      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} />
        ))}
    </div>
  )
}

export default App
