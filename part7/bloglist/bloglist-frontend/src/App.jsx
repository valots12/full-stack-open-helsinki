import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './app.css'
import LoginForm from './components/LoginForm'
import { showNotification } from './reducers/notificationReducer'
import { useDispatch } from 'react-redux'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()
  useEffect(() => {
    blogService
      .getAll().then(anecdotes => dispatch(setBlogs(anecdotes)))
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // const updateBlog = async (updatedBlog) => {
  //   const returnedBlog = await blogService.update(updatedBlog)

  //   if (returnedBlog.error) {
  //     dispatch(showNotification('error updating blog: ' + returnedBlog.erro, 5))
  //   } else {
  //     blogService.getAll().then(blogs =>
  //       setBlogs( blogs )
  //     )
  //   }
  // }

  // const deleteBlog = async (deletedBlog) => {

  //   if (window.confirm(`Remove blog '${deletedBlog.title}' by ${deletedBlog.author} ?`)) {
  //     const returnedBlog = await blogService.deleteIt(deletedBlog, deletedBlog.id)

  //     if (returnedBlog.error) {
  //       dispatch(showNotification('error deleting blog: ' + returnedBlog.error, 5))
  //     } else {
  //       blogService.getAll().then(blogs =>
  //         setBlogs( blogs )
  //       )
  //       dispatch(showNotification(`blog titled '${deletedBlog.title}' by ${deletedBlog.author} deleted`, 5))
  //     }
  //   }
  // }

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
      handleLogin = {handleLogin}
      handleUsernameChange = {handleUsernameChange}
      handlePasswordChange = {handlePasswordChange}
      username = {username}
      password = {password}
    />
  )

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm
        createBlog = {createBlog}
      />
    </Togglable>
  )

  const blogFormRef = useRef()

  return (
    <div>
      <h1>Blogs</h1>

      <Notification />
      <br/>
      <br/>

      {!user && loginForm()}

      {user && <div>
        <p>{user.username} logged in</p>
        {logoutForm()}
        <br/>
        {blogForm()}
        <br/>
      </div>
      }
      <br/>

      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
          />
        )}
    </div>
  )
}

export default App