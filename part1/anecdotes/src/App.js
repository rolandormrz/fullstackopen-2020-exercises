import React, {useState} from 'react';
import './App.css';

const App = (props) => {
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState({ 0: 0 });

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
  }

  return (
    <div>
      <h1>Random Anecdote Randomizer</h1>
      <p>{props.anecdotes[selected]}</p>
      <p>Has {votes[selected]} votes</p>
      <span>
        <button onClick={handleVoteBtn}>Vote</button>
        <button onClick={handleClick}>Next Anecdote</button>
      </span>
      
    </div>
  )
}



export default App;
