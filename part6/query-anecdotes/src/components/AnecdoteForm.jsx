import { useMutation, useQueryClient } from '@tanstack/react-query' 
import { createAnecdote } from '../requests' 
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 10000).toString()
  }

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate(
      { content, id: generateRandomNumber(), votes: 0 },
      {
        onSuccess: () => {
          notificationDispatch({
            type: 'show',
            data: `the new anecdote '${content}' has been created`,
          })
          setTimeout(() => {
            notificationDispatch({ type: 'hide' })
          }, 5000)
        },
        onError: () => {
          notificationDispatch({
            type: 'show',
            data: `too short anecdote, must have lenght 5 or more`,
          })
          setTimeout(() => {
            notificationDispatch({ type: 'hide' })
          }, 5000)       
        }
      }
    )
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
