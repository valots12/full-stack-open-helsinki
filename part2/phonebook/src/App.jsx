import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/filter'
import PersonForm from './components/personForm'
import Persons from './components/persons'
import Notification from './components/Notification'
import personService from './services/persons'


const App = () => {

  const [newName, setNewName] = useState('Insert new name..')
  const [newNumber, setNewNumber] = useState('Insert new number..')
  const [filter, setFilter] = useState('')
  const [contacts, setContacts] = useState([])
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialContacts => {
        setContacts(initialContacts)
      })
  }, [])

  console.log('render', contacts.length, 'contacts')

  const addContact = (event) => {
    event.preventDefault()
    const ContactContent = {
      name: newName,
      number: newNumber
    }
  
    if (contacts.some(contact => contact.name === newName)) {
      if (window.confirm(`'${ContactContent.name}' is already in the phonebook; replace the old number with a new one?`)) {
        const existingContact = contacts.find(contact => contact.name == newName);

        personService
        .update(existingContact.id, ContactContent)
          .then(returnedContact => {
            setContacts(contacts.map(contact => contact.id !== existingContact.id ? contact : returnedContact))

            setSuccessMessage(`Updated '${newName}'`)
            setTimeout(() => {
              setSuccessMessage(null)
            }, 2000)
        })
        .catch(error => {
          setSuccessMessage(`Information of '${newName}' has already been removed from server`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 2000)
        })
    }
  }
  
    else {
      personService
      .create(ContactContent)
        .then(returnedContact => {
          setContacts(contacts.concat(returnedContact))
          setNewName('')
          setNewNumber('')

          setSuccessMessage(`Added '${newName}'`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 2000)
      })
    }
  }

  const deleteContact = (id, name) => {
    const url = `http://localhost:3001/persons/${id}`
    const contact = contacts.find(n => n.id === id)
  
    if (window.confirm(`Delete '${contact.name}'?`)) {
      personService
      .deleteIt(id)
        .then(() => {
          const updatedContacts = contacts.filter((contact)=> contact.id!==id)
          setContacts(updatedContacts)
          console.log('Deletion confirmed')
        }
        )
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

      <Notification message={successMessage} />
      
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>

      <h2>Add new</h2>

      <PersonForm addContact={addContact} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>

      <h2>Numbers</h2>

      <Persons contacts={contacts} filter={filter} deleteContact={deleteContact}/>

    </div>
  )
}

export default App