import React, {useState} from 'react';
import './App.css';

const App = (props) => {
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState({ 0: 0 });
  const [mostVotes, setMostVotes] = useState( { anecdote: props.anecdotes[selected], votes: 0} );

  const handleClick = () => {
    const randomAnecdote = Math.floor(Math.random() * props.anecdotes.length);
    setSelected(randomAnecdote);
    
    if(typeof votes[randomAnecdote] === 'undefined') {
      const newVotes = {...votes, [randomAnecdote]: 0};
      setVotes(newVotes);
    }
  }

  const handleVoteBtn = () => {
    const newVotes = {...votes, [selected]: votes[selected] + 1};
    setVotes(newVotes);

    if(newVotes[selected] > mostVotes.votes) {
      const newMostVotes = { anecdote: props.anecdotes[selected], votes: newVotes[selected]};
      setMostVotes(newMostVotes);
    }
  }

  return (
    <div>
      <h1>Anecdote Generator</h1>
      <h2>Anecdote of the Day</h2>
      <p>{props.anecdotes[selected]}</p>
      <p>Has {votes[selected]} votes</p>
      <span>
        <button onClick={handleVoteBtn}>Vote</button>
        <button onClick={handleClick}>Next Anecdote</button>
      </span>
      <h2>Anecdote with the Most Votes</h2>
      <p>{mostVotes.anecdote}</p>
      <p>With {mostVotes.votes} votes</p>
    </div>
  )
}

export default App;