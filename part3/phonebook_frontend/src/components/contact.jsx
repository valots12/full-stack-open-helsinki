const Contact = ({ contact, deleteContact }) => {
    return (
      <p>{contact.name} {contact.number} <button onClick={() => deleteContact(contact.id, contact.name)}>Delete</button></p>
    )
  }
  
  export default Contact