import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }

  try {
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
  } catch (error) {
    if (error.response.status === 401) {
      console.error('Authentication failed:', error.response.data)
      return error.response.data
    } else {
      console.error('Error:', error.response.data)
      return error.response.data
    }
  }
}

const update = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }

  try {
    const response = await axios.put(`${baseUrl}/${newObject.id}`, newObject, config)
    return response.data
  } catch (error) {
    console.log('errr', error.response)
    console.log('new', newObject)
    if (error.response.status === 401) {
      console.error('Authentication failed:', error.response.data)
      return error.response.data
    } else {
      console.error('Error:', error.response.data)
      return error.response.data
    }
  }
}

const deleteIt = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }

  try {
    const request = await axios.delete(`${baseUrl}/${newObject.id}`, config)
    return request.data
  } catch (error) {
    console.log('errr', error.response)
    console.log('new', newObject)
    if (error.response.status === 401) {
      console.error('Authentication failed:', error.response.data)
      return error.response.data
    } else {
      console.error('Error:', error.response.data)
      return error.response.data
    }
  }
}

export default {
  getAll,
  create,
  update,
  deleteIt,
  setToken
}
