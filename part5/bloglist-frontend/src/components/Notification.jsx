const Notification = ({ message }) => {
  if(message === null) return null

  if (message.includes('error')){
    return (
      <span  className="error">
        {message}
      </span>
    )
  } else {
    return (
      <span  className="success">
        {message}
      </span>
    )
  }
}

export default Notification