import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
  axios.get(baseUrl).then(res => res.data)

export const createAnecdote = newAnecdote => {
  if (newAnecdote.content.length >= 5) {
    return axios.post(baseUrl, newAnecdote).then(res => res.data)
  } else {
    return Promise.reject(new Error("Anecdote content length must be at least 5 characters."));
  }
}

export const updateAnecdote = updatedAnecdote =>
  axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote).then(res => res.data)