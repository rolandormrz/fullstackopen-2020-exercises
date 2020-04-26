import React, {useState} from 'react';
import './App.css';

const App = (props) => {
  const [selected, setSelected] = useState(0)

  const handleClick = () => {
    const randomAnecdote = Math.floor(Math.random() * props.anecdotes.length);
    setSelected(randomAnecdote);
  }

  return (
    <div>
      <h1>Random Anecdote Randomizer</h1>
      <p>{props.anecdotes[selected]}</p>
      <button onClick={handleClick}>Next Anecdote</button>
    </div>
  )
}



export default App;
