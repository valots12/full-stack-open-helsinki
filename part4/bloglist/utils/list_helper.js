const User = require('../models/user')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}
 
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {}

  const reducer = (max, item) => {
    return item.likes > max ? item.likes : max
  }
  const maxLikes = blogs.reduce(reducer, blogs[0].likes)
  const favoriteBlog = blogs.find(blog => blog.likes === maxLikes)
  const { author, likes, title } = favoriteBlog
  return { author, likes, title }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}

  const authorCount = {};
  blogs.forEach(blog => {
    const author = blog.author;
    authorCount[author] = (authorCount[author] || 0) + 1;
  });
  
  // Find the author with the most blogs
  let mostBlogsAuthor = null;
  let mostBlogsCount = 0;
  
  for (const author in authorCount) {
    if (authorCount[author] > mostBlogsCount) {
      mostBlogsCount = authorCount[author];
      mostBlogsAuthor = author;
    }
  }

  return { 
    "author": mostBlogsAuthor,
    "blogs": mostBlogsCount
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}

  const authorCount = {};
  blogs.forEach(blog => {
    const author = blog.author;
    authorCount[author] = (authorCount[author] || 0) + blog.likes;
  });
  
  // Find the author with the most blogs
  let mostBlogsAuthor = null;
  let mostBlogsLikes = 0;
  
  for (const author in authorCount) {
    if (authorCount[author] > mostBlogsLikes) {
      mostBlogsLikes = authorCount[author];
      mostBlogsAuthor = author;
    }
  }

  return { 
    'author': mostBlogsAuthor,
    'likes': mostBlogsLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  usersInDb
}