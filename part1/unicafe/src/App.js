import React, { useState } from 'react';
import './App.css';
import Statistics from './components/Statistics';
import Button from './components/Button';

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  let total = good + neutral + bad;

  return (
    <div>
      <h1>Unicafe Feedback Form</h1>
      <h2>Give Feedback</h2>
      <span>
        <Button text={'good'} feedback={good} setFeedback={setGood} />
        <Button text={'neutral'} feedback={neutral} setFeedback={setNeutral} />
        <Button text={'bad'} feedback={neutral} setFeedback={setBad} />
      </span>
      <Statistics feedback={{good, neutral, bad}} total={total} />
    </div>
  );
}

export default App;