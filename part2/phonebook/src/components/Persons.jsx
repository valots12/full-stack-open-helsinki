import Contact from './Contact'

const Persons = ({contacts, filter, deleteContact}) => {
    return (
        <div>
        {contacts.filter(contact => contact.name.toLowerCase().includes(filter)).map(contact =>
            <Contact key={contact.name} contact={contact} deleteContact={deleteContact}/>
          )}
        </div>
    )
  }
  
  export default Persons