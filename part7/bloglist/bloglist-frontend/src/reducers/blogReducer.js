import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'values',
  initialState: [],
  reducers: {
    // addVote(state, action) {
    //   const id = action.payload
    //   const anecdoteToChange = state.find(n => n.id === id)
    //   const changedAnecdote = {
    //     ...anecdoteToChange,
    //     votes: anecdoteToChange.votes + 1
    //   }
    //   return state.map(anecdote =>
    //     anecdote.id !== id ? anecdote : changedAnecdote
    //   )
    // },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    }
  },
})

export const { appendBlog, setBlogs } = blogSlice.actions

export const createBlog = content => {
  return async dispatch => {
    const newAnecdote = await blogService.create(content)
    dispatch(appendBlog(newAnecdote))
  }
}

// export const voteAnecdote = id => {
//   return async dispatch => {
//     const anecdote = await blogService.getOne(id)
//     const updatedAnecdote = {
//       ...anecdote,
//       votes: anecdote.votes + 1,
//     }
//     await anecdoteService.update(id, updatedAnecdote)
//     dispatch(addVote(id))
//   }
// }

export default blogSlice.reducer