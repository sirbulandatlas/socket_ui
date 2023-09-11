import React from 'react';
import { Typography } from '@mui/material';
import './messages.scss'; // Import the separate CSS/SCSS file
import { useUserContext } from '../../context/useUserContext';

const Messages = ({ messages }) => {
  const { user } = useUserContext();

  return (
    <div className="user-messages">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`user-messages__message ${
            msg.sender_id === user.id ? 'user-messages__message--sent' : ''
          }`}
        >
          <Typography
            variant="body2"
            className={`user-messages__message-sender ${
              msg.sender_id === user.id ? 'user-messages__message-sender--sent' : ''
            }`}
          >
            {msg.sender_id === user.id ? '' : msg.send_by}
          </Typography>
          <span
            className={`user-messages__message-text ${
              msg.sender_id === user.id ? 'user-messages__message-text--sent' : ''
            }`}
          >
            {msg.content}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Messages;
