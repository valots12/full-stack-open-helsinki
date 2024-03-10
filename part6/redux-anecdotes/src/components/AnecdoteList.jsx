import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()

    const anecdotes = useSelector(state => state.values)
    const filter = useSelector(state => state.filter)
    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes).filter(anecdote => anecdote.content.includes(filter))

    return (
    <div>
        {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
            <div>
            {anecdote.content}
            </div>
            <div>
            has {anecdote.votes}
            <button onClick={() => {dispatch(voteAnecdote(anecdote.id)),
                                    dispatch(showNotification(`Successfully voted ${anecdote.content}`, 5))}}>vote</button>
            </div>
        </div>
        )}
    </div>
)
}

export default AnecdoteList