import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import "./app.css"
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    const returnedBlog = await blogService.create(blogObject)
    console.log('returnedBlog.error', returnedBlog.error)
    console.log('returnedBlog', returnedBlog)

    if (returnedBlog.error) {
      setNotificationMessage("error creating blog: " + returnedBlog.error)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } else {
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )  
      console.log('blogs', blogs)
      setTitle('')
      setAuthor('')
      setUrl('')
      blogFormRef.current.toggleVisibility()
      setNotificationMessage("a new blog '" + returnedBlog.title + "' by " + returnedBlog.author + " added")
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async (updatedBlog) => {
    const returnedBlog = await blogService.update(updatedBlog)

    if (returnedBlog.error) {
      setNotificationMessage("error updating blog: " + returnedBlog.error)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } else {
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
    }
  }
  
  const deleteBlog = async (deletedBlog) => {
    const returnedBlog = await blogService.deleteIt(deletedBlog, deletedBlog.id)

    if (returnedBlog.error) {
      setNotificationMessage("error deleting blog: " + returnedBlog.error)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } else {
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setNotificationMessage('logging in with ' + username)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationMessage('error: wrong credentials')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser('')
    setUsername('')
    setPassword('')

    setNotificationMessage('logging out')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)

  }

  const logoutForm = () => (
    <form onSubmit={handleLogout}>
      <button type="submit">logout</button>
    </form>      
  )

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

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
        addBlog = {addBlog}
        handleTitleChange = {handleTitleChange}
        handleAuthorChange = {handleAuthorChange}
        handleUrlChange = {handleUrlChange}
        title = {title}
        author = {author}
        url = {url}
      />
    </Togglable>
  )

  const blogFormRef = useRef()

  return (
    <div>
      <h1>Blogs</h1>

      <Notification message={notificationMessage} />
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