import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()

    const anecdotes = useSelector(state => state.values)
    const filter = useSelector(state => state.filter)
    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes).filter(anecdote => anecdote.content.includes(filter))

    const vote = (id) => {
        dispatch(addVote(id))
    }

    return (
    <div>
        {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
            <div>
            {anecdote.content}
            </div>
            <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
        </div>
        )}
    </div>
)
}

export default AnecdoteList