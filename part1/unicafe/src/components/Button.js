import React from 'react';

const Button = ({ text, feedback, setFeedback }) => {
  const handleClick = () => setFeedback(feedback + 1);

  return <button onClick={handleClick} >{text}</button>;
}

export default Button;