import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/filter'
import Display from './components/display'

const App = () => {

  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all').then(response => {
        setCountries(response.data)
      })
  }, [])

  const filterResult = name => {
    setFilter(name.toLowerCase())
  }
  
  const handleFilterChange = (eventFilter) => {
    console.log(eventFilter.target.value)
    setFilter(eventFilter.target.value.toLowerCase())
  }

  return (
    <div>
      <h2>Countries</h2>

      <Filter filter={filter} handleFilterChange={handleFilterChange}/>

      <Display countries={countries} filter={filter} filterResult={filterResult}/>

    </div>
  )
}

export default App