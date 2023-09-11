import React, { useMemo } from 'react';
import { Button, Avatar } from '@mui/material';
import './selection.scss';

const UserSelection = ({ conversations, selectedConversation, handleUserSelection, searchQuery }) => {
  
  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;

    return conversations.filter(conversation => conversation.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery, conversations])


  return (
    <div style={{ width: '100%' }}>
      {filteredConversations.map((conversation) => (
        <Button
          key={conversation.id}
          onClick={() => handleUserSelection(conversation)}
          className={`user-selection__button ${
            selectedConversation?.id === conversation.id ? 'user-selection__button--active' : ''
          }`}
        >
          <Avatar>{conversation.title}</Avatar>
          <span className="user-selection__name">{conversation.title}</span>
        </Button>
      ))}
    </div>
  );
};

export default UserSelection;
