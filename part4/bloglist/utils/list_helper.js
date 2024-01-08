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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}