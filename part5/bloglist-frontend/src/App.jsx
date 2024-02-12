import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import "./app.css"

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
      setBlogs(blogs.concat(returnedBlog))
      setNotificationMessage("a new blog '" + returnedBlog.title + "' by " + returnedBlog.author + " added")
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
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

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          autoComplete="on"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const logoutForm = () => (
    <form onSubmit={handleLogout}>
      <button type="submit">logout</button>
    </form>      
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title:
          <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
          <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
          <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>  
  )

  return (
    <div>
      <h1>Blogs</h1>

      <Notification message={notificationMessage} />
      <br/>
      <br/> 

      {!user && loginForm()}

      {user && <div>
        <p>{user.username} logged in</p>
        {logoutForm() }
        <br/>
        <h2>Create new</h2>
        <br/>
        {blogForm()}
        <br/>
        </div>
      }

      <br/>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App