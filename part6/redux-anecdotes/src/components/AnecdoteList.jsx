import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()

    const anecdotes = useSelector(state => state)
    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

    const vote = (id) => {
        dispatch(addVote(id))
    }

    return (
    <div>
        <h2>Anecdotes</h2>
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