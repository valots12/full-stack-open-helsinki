import { useDispatch } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const Filter = () => {
    const dispatch = useDispatch()

    const handleChange = (event) => {
      event.preventDefault()
      const content = event.target.value
      dispatch(filterChange(content))
    }

    const style = {
      marginBottom: 10
    }
  
    return (
      <div style={style}>
        filter <input name="filterString" onChange={handleChange} />
      </div>
    )
  }
  
  export default Filter