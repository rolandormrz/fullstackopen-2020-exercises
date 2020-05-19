import React from 'react';
import './Notification.css';

const Notification = ({ message }) => {
  return (
    <div className={message.styling}>
      <p>{message.text}</p>
    </div>
  );
}

export default Notification;