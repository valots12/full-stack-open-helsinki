import Contact from './Contact'

const Persons = ({contacts, filter}) => {
    return (
        <div>
        {contacts.filter(contact => contact.name.toLowerCase().includes(filter)).map(contact =>
            <Contact key={contact.name} contact={contact}/>
          )}
        </div>
    )
  }
  
  export default Persons