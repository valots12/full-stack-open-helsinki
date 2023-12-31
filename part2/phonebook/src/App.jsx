import {useState} from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'


const App = () => {

  const [contacts, setContacts] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('Insert new name..')
  const [newNumber, setNewNumber] = useState('Insert new number..')
  const [filter, setFilter] = useState('')

  const addContact = (event) => {
    event.preventDefault()
    const ContactContent = {
      name: newName,
      number: newNumber
    }
  
    if (contacts.some(contact => contact.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    }
  
    else {
      setContacts(contacts.concat(ContactContent))
      setNewName('')
      setNewNumber('')
    }
  }
  
  const handleNameChange = (eventName) => {
    console.log(eventName.target.value)
    setNewName(eventName.target.value)
  }
  
  const handleNumberChange = (eventNumber) => {
    console.log(eventNumber.target.value)
    setNewNumber(eventNumber.target.value)
  }
  
  const handleFilterChange = (eventFilter) => {
    console.log(eventFilter.target.value)
    setFilter(eventFilter.target.value.toLowerCase())
  }


  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>

      <h2>Add new</h2>

      <PersonForm addContact={addContact} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>

      <h2>Numbers</h2>

      <Persons contacts={contacts} filter={filter} />

      {/* <p>debug: {newName}</p>
      <p>debug: {newNumber}</p> */}
    </div>
  )
}

export default App