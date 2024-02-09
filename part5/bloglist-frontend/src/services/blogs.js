import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  console.log('baseurl', baseUrl)
  console.log('newObject', newObject)
  console.log('config', config)

	const response = await axios.post(baseUrl, newObject, config)
	return response.data
}


export default { 
  getAll, create, setToken
}