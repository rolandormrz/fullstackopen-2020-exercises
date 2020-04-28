import React from 'react';

const Notification = ({ message, styling }) => {

  return (
    <div style={styling}>
      <p>{message}</p>
    </div>
  );
}

export default Notification;